
var gulp = require('gulp'),
    jsdoc = require('gulp-jsdoc3');

'use strict';

gulp.task('docs', function(cb) {
    var config = require('./jsdoc.json');
    gulp.src(['./README.md', './index.js', './src/**/*.js'], {
        read: false
    })
    .pipe(jsdoc(cb));
});