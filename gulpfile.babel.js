import 'babel-polyfill';
import fs from 'fs';
import gulp from 'gulp';
import RSA from 'node-rsa';
import crx from 'gulp-crx-pack';

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

gulp.task('compress', 'crx:compress');
