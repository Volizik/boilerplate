'use strict';

const gulp = require('gulp'),
    sass = require('gulp-sass'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    pug = require('gulp-pug'),
    browserSync = require('browser-sync').create(),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    gulpPugBeautify = require('gulp-pug-beautify'),
    autoprefixer = require('gulp-autoprefixer');


gulp.task('pug', function () {
    return gulp.src('./src/pages/*.pug')
        .pipe(plumber())
        .pipe(pug({pretty: true}))
        .pipe(pug())
        .pipe(gulpPugBeautify({omit_empty: false}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('css', function () {
    gulp.src(['./src/shared/styles/*.sass', './src/blocks/**/*.sass'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(concat('style.min.css'))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer({
            browsers: ['> 1%', 'last 5 versions', 'Android >= 3', 'Firefox ESR', 'Opera 12.1']
        }))
        .pipe(gulp.dest('./dist/assets/css'));
});

gulp.task('js', function () {
    gulp.src('src/pages/**/*.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(concat('script.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/assets/js'))
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        tunnel: true,
        host: 'localhost',
        port: 9000,
        logPrefix: "Craft Group"
    });
});

gulp.task('watch', ['pug', 'css', 'js'], function () {

    gulp.watch('./src/blocks/**/*.pug', ['pug']);
    gulp.watch('./src/blocks/**/*.sass', ['css']);
    gulp.watch('./src/blocks/**/*.js', ['js']);

    gulp.watch('./dist/assets/js/*.js').on('change', browserSync.reload);
    gulp.watch('./dist/assets/css/*.css').on('change', browserSync.reload);
    gulp.watch('./dist/*.html').on('change', browserSync.reload);

});

gulp.task('default', ['watch', 'browser-sync']);
