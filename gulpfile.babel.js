import gulp from 'gulp';
import gutil from 'gulp-util';
import jade from 'gulp-jade';
import babel from 'gulp-babel';
import livereload from 'gulp-livereload';
import rename from 'gulp-rename';
import zip from 'gulp-zip';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import prodConfig from './webpack/prod.config';
import devConfig from './webpack/dev.config';

const port = 3000;

/*
 * dev tasks
 */

gulp.task('webpack-dev-server', () => {
  let myConfig = Object.create(devConfig);
  new WebpackDevServer(webpack(myConfig), {
    contentBase: `http://localhost:${port}/js`,
    publicPath: myConfig.output.publicPath,
    stats: {colors: true},
    hot: true,
    historyApiFallback: true
  }).listen(port, 'localhost', (err) => {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }
    gutil.log('[webpack-dev-server]', `http://localhost:${port}/webpack-dev-server/index.html`);
  });
});

gulp.task('views:dev', () => {
  gulp.src('./app/views/*.jade')
    .pipe(jade({
      locals: { env: 'dev' }
    }))
    .pipe(gulp.dest('./dev'))
    .pipe(livereload());
});

gulp.task('babel:dev', () => {
  gulp.src(['./app/scripts/content.js', './app/scripts/background.js', './app/scripts/reactdevtool.js', './app/scripts/livereload.js'])
    .pipe(babel())
    .pipe(gulp.dest('./dev/js'))
    .pipe(livereload());
});

gulp.task('copy:dev', () => {
  gulp.src('./app/manifest.dev.json')
    .pipe(rename('manifest.json'))
    .pipe(gulp.dest('./dev'));
  gulp.src('./app/assets/**/*').pipe(gulp.dest('./dev'));
});

gulp.task('watch', () => {
  livereload.listen();
  gulp.watch('./app/views/*.jade', ['views:dev']);
  gulp.watch('./app/scripts/content.js', ['babel:dev']);
  gulp.watch('./app/scripts/background.js', ['babel:dev']);
  gulp.watch('./app/scripts/reactdevtool.js', ['babel:dev']);
  gulp.watch('./app/scripts/livereload.js', ['babel:dev']);
  gulp.watch('./app/manifest.dev.json', ['copy:dev']);
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
  gulp.src('./app/views/*.jade')
    .pipe(jade({
      locals: { env: 'prod' }
    }))
    .pipe(gulp.dest('./build'));
});

gulp.task('babel:build', () => {
  gulp.src(['./app/scripts/content.js', './app/scripts/background.js'])
    .pipe(babel())
    .pipe(gulp.dest('./build/js'));
});

gulp.task('copy:build', () => {
  gulp.src('./app/manifest.prod.json')
    .pipe(rename('manifest.json'))
    .pipe(gulp.dest('./build'));
  gulp.src('./app/assets/**/*').pipe(gulp.dest('./build'));
});

/*
 * compress task
 */

gulp.task('zip:compress', () => {
  gulp.src('build/*')
    .pipe(zip('archive.zip'))
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['webpack-dev-server', 'views:dev', 'babel:dev', 'copy:dev', 'watch']);
gulp.task('build', ['webpack:build', 'views:build', 'babel:build', 'copy:build']);
gulp.task('compress', ['zip:compress']);