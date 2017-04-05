/**
 * Created by liuwensa on 2016/11/29.
 */

'use strict';

const gulp   = require('gulp');
const eslint = require('gulp-eslint');

gulp.task('lint', () => {
  return gulp.src('**/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format());
});
