'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var plumber = require('gulp-plumber');

gulp.task('test', function (callback) {
  gulp.src(['lib/**/*.js', 'index.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .on('finish', function () {
      gulp.src(['tests/unit/**/*.js'])
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(mocha({
          reporter: 'dot'
        }))
        .on('end', callback);
    });
});

gulp.task('watch', function () {
  gulp.watch(['lib/**/*.js', 'index.js', 'tests/**/*.js'], ['test']);
});

gulp.task('default', ['test', 'watch']);
