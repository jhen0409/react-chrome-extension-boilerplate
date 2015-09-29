import fs from 'fs';
import gulp from 'gulp';
import gutil from 'gulp-util';
import jade from 'gulp-jade';
import rename from 'gulp-rename';
import zip from 'gulp-zip';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import prodConfig from './webpack/prod.config';
import devConfig from './webpack/dev.config';

const port = 3000;

/*
 * common tasks
 */
gulp.task('replace-webpack-code', () => {
  const replaceTasks = [ {
    from: './webpack/replace/JsonpMainTemplate.runtime.js',
    to: './node_modules/webpack/lib/JsonpMainTemplate.runtime.js'
  }, {
    from: './webpack/replace/log-apply-result.js',
    to: './node_modules/webpack/hot/log-apply-result.js'
  } ];
  replaceTasks.forEach(task => fs.writeFileSync(task.to, fs.readFileSync(task.from)));
});

/*
 * dev tasks
 */

gulp.task('webpack-dev-server', () => {
  let myConfig = Object.create(devConfig);
  new WebpackDevServer(webpack(myConfig), {
    contentBase: `http://localhost:${port}`,
    publicPath: myConfig.output.publicPath,
    stats: {colors: true},
    hot: true,
    historyApiFallback: true,
    https: true
  }).listen(port, 'localhost', (err) => {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }
    gutil.log('[webpack-dev-server]', `listening at port ${port}`);
  });
});

gulp.task('views:dev', () => {
  gulp.src('./chrome/views/*.jade')
    .pipe(jade({
      locals: { env: 'dev' }
    }))
    .pipe(gulp.dest('./dev'));
});

gulp.task('copy:dev', () => {
  gulp.src('./chrome/manifest.dev.json')
    .pipe(rename('manifest.json'))
    .pipe(gulp.dest('./dev'));
  gulp.src('./chrome/assets/**/*').pipe(gulp.dest('./dev'));
});

/*
 * build tasks
 */

gulp.task('webpack:build', (callback) => {
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
  gulp.src('./chrome/views/*.jade')
    .pipe(jade({
      locals: { env: 'prod' }
    }))
    .pipe(gulp.dest('./build'));
});

gulp.task('copy:build', () => {
  gulp.src('./chrome/manifest.prod.json')
    .pipe(rename('manifest.json'))
    .pipe(gulp.dest('./build'));
  gulp.src('./chrome/assets/**/*').pipe(gulp.dest('./build'));
});

/*
 * compress task
 */

gulp.task('zip:compress', () => {
  gulp.src('build/*')
    .pipe(zip('archive.zip'))
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['replace-webpack-code', 'webpack-dev-server', 'views:dev', 'copy:dev']);
gulp.task('build', ['replace-webpack-code', 'webpack:build', 'views:build', 'copy:build']);
gulp.task('compress', ['zip:compress']);