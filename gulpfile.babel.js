import 'babel-polyfill';
import fs from 'fs';
import gulp from 'gulp';
import merge from 'merge-stream';
import gulpSync from 'gulp-sync';
import gutil from 'gulp-util';
import jade from 'gulp-jade';
import rename from 'gulp-rename';
import RSA from 'node-rsa';
import crx from 'gulp-crx-pack';
import mocha from 'gulp-mocha';
import eslint from 'gulp-eslint';
import crdv from 'chromedriver';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import prodConfig from './webpack/prod.config';
import devConfig from './webpack/dev.config';

const port = 3000;
const { sync } = gulpSync(gulp);

/*
 * common tasks
 */
gulp.task('replace-webpack-code', () => {
  const replaceTasks = [{
    from: './webpack/replace/JsonpMainTemplate.runtime.js',
    to: './node_modules/webpack/lib/JsonpMainTemplate.runtime.js'
  }, {
    from: './webpack/replace/log-apply-result.js',
    to: './node_modules/webpack/hot/log-apply-result.js'
  }];
  replaceTasks.forEach(task => fs.writeFileSync(task.to, fs.readFileSync(task.from)));
});

/*
 * dev tasks
 */

gulp.task('webpack-dev-server', () => {
  let myConfig = Object.create(devConfig);
  new WebpackDevServer(webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('Please allow `https://localhost:3000` connections in Google Chrome');
    gutil.log('and load unpacked extensions with `./dev` folder.  (see https://developer.chrome.com/extensions/getstarted#unpacked)');
  }), {
    publicPath: myConfig.output.publicPath,
    stats: {colors: true},
    noInfo: true,
    hot: true,
    historyApiFallback: true,
    https: true
  }).listen(port, 'localhost', (err) => {
    if (err) throw new gutil.PluginError('webpack-dev-server', err);
    gutil.log('[webpack-dev-server]', `listening at port ${port}`);
  });
});

gulp.task('views:dev', () => {
  return gulp.src('./chrome/views/*.jade')
    .pipe(jade({
      locals: {
        env: 'dev',
        devToolsExt: !!process.env.DEVTOOLS_EXT || true
      }
    }))
    .pipe(gulp.dest('./dev'));
});

gulp.task('copy:dev', () => {
  const manifest = gulp.src('./chrome/manifest.dev.json')
    .pipe(rename('manifest.json'))
    .pipe(gulp.dest('./dev'));
  const assets = gulp.src('./chrome/assets/**/*').pipe(gulp.dest('./dev'));
  return merge(manifest, assets);
});

/*
 * build tasks
 */

gulp.task('webpack:build', callback => {
  let myConfig = Object.create(prodConfig);
  webpack(myConfig, (err, stats) => {
    if (err) {
      throw new gutil.PluginError('webpack:build', err);
    }
    gutil.log('[webpack:build]', stats.toString({ colors: true }));
    callback();
  });
});

gulp.task('views:build', () => {
  return gulp.src('./chrome/views/*.jade')
    .pipe(jade({
      locals: { env: 'prod' }
    }))
    .pipe(gulp.dest('./build'));
});

gulp.task('copy:build', () => {
  const manifest = gulp.src('./chrome/manifest.prod.json')
    .pipe(rename('manifest.json'))
    .pipe(gulp.dest('./build'));
  const assets = gulp.src('./chrome/assets/**/*').pipe(gulp.dest('./build'));
  return merge(manifest, assets);
});

/*
 * compres tasks
 */

gulp.task('crx:compress', () => {
  const keyPath = './key.pem';
  let privateKey;
  if (!fs.existsSync('./key.pem')) {
    privateKey = new RSA({ b: 1024 }).exportKey('pkcs1-private-pem');
    fs.writeFileSync(keyPath, privateKey);
  } else {
    privateKey = fs.readFileSync('./key.pem', 'utf8');
  }
  return gulp.src('./build')
    .pipe(crx({
      privateKey,
      filename: require('./build/manifest.json').name + '.crx'
      // if you want autoupdating,
      // refer: https://github.com/PavelVanecek/gulp-crx#autoupdating
    }))
    .pipe(gulp.dest('.'));
});

/*
 * test tasks
 */

gulp.task('lint', () => {
  return gulp.src([
    'app/**/*.js',
    'chrome/**/*.js',
    'test/**/*.js',
    '*.js'
  ]).pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

require('./test/setup-app');

gulp.task('app:test', () => {
  return gulp.src('./test/app/**/*.spec.js')
    .pipe(mocha());
});

gulp.task('watch:app:test', ['app:test'], () => {
  return gulp.watch(['test/app/**/*.spec.js', 'app/**/*.js'], ['app:test']);
});

gulp.task('e2e:test', () => {
  crdv.start();
  return gulp.src('./test/e2e/**/*.js')
    .pipe(mocha({ require: ['co-mocha'] }))
    .on('end', () => crdv.stop());
});

gulp.task('default', ['replace-webpack-code', 'webpack-dev-server', 'views:dev', 'copy:dev']);
gulp.task('build', ['replace-webpack-code', 'webpack:build', 'views:build', 'copy:build']);
gulp.task('compress', sync(['build', 'crx:compress']));
gulp.task('test', sync(['lint', 'app:test', 'build', 'e2e:test']));
