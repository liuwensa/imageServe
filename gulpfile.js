/**
 * Created by liuwensa on 2016/11/29.
 */

'use strict';

const gulp         = require('gulp');
const eslint       = require('gulp-eslint');
const jsdoc        = require('gulp-jsdoc3');
const gutil        = require('gulp-util');
const gulpJsdoc2md = require('gulp-jsdoc-to-markdown');
const concat       = require('gulp-concat');

gulp.task('lint', () => {
  return gulp.src('**/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('jsdoc', function (cb) {
  gulp.src('./controller/*.js', {read: false})
    .pipe(jsdoc(cb))
    .pipe(gulp.dest('docs'));
});

gulp.task('docs', function () {
  return gulp.src('controller/*.js')
    .pipe(concat('api.md'))
    .pipe(gulpJsdoc2md())
    .on('error', function (err) {
      gutil.log('jsdoc2md failed:', err.message);
    })
    .pipe(gulp.dest('docs'));
});
