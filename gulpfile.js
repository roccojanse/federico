
var gulp = require('gulp'),
    jsdoc = require('gulp-jsdoc3');

gulp.task('docs', function(cb) {
    var config = require('./jsdoc.json');
    gulp.src(['./README.md', './index.js', './Frontend/**/*.js'], {
        read: false
    })
    .pipe(jsdoc(cb));
});