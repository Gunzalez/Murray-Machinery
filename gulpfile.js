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
var nunjucksRender = require('gulp-nunjucks-render');

gulp.task('runSass', function() {
    return gulp.src('develop/scss/**/*.scss')
        .pipe(sass())
        .pipe(plumber())
        .pipe(gulp.dest('website/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('nunjucks', function() {
    // Gets .html and .nunjucks files in pages
    return gulp.src('develop/pages/**/*.+(html|nunjucks)')
        // Renders template with nunjucks
            .pipe(nunjucksRender({
                path: ['develop/templates']
            }))
        // output files in app folder
            .pipe(gulp.dest('website'))
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
    gulp.watch('develop/pages/**/*.*', ['nunjucks']);
    gulp.watch('develop/templates/**/*.*', ['nunjucks']);
    gulp.watch('website/*.html', browserSync.reload);
    gulp.watch('website/js/**/*.js', browserSync.reload);
});

gulp.task('default', function (callback) {
    runSequence(['runSass','browserSync', 'watch'], callback)
});




