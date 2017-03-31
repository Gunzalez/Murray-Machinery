'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var del = require('del');
var runSequence = require('run-sequence');
var plumber = require('gulp-plumber');
var ftp = require('gulp-ftp');

gulp.task('runSass', function() {
    return gulp.src('develop/scss/**/*.scss')
        .pipe(sass())
        .pipe(plumber())
        .pipe(gulp.dest('website/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'website'
        }
    })
});

gulp.task('watch', function (){
    gulp.watch('develop/scss/**/*.scss', ['runSass']);
    gulp.watch('website/*.html', browserSync.reload);
    gulp.watch('website/js/**/*.js', browserSync.reload);
});

gulp.task('default', function (callback) {
    runSequence(['runSass','browserSync', 'watch'], callback)
});




