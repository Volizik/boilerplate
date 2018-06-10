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
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify');


gulp.task('pug', function () {
    return gulp.src('./src/pages/*.pug')
        .pipe(plumber())
        .pipe(pug({pretty: true}))
        .pipe(gulpPugBeautify({omit_empty: false}))
        .pipe(gulp.dest('./dist'));
});
gulp.task('css', function () {
    gulp.src(['./src/shared/sass/**/*.sass', './src/components/**/*.sass'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat('style.css'))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer({
            browsers: ['> 1%', 'last 5 versions', 'Android >= 3', 'Firefox ESR', 'Opera 12.1']
        }))
        .pipe(gulp.dest('./dist/assets/css'));
});
gulp.task('js', function () {
    gulp.src(['./src/shared/js/**/*.js', './src/components/**/*.js'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('script.js'))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/assets/js'))
});

gulp.task('pug-build', function () {
    return gulp.src('./src/pages/*.pug')
        .pipe(plumber())
        .pipe(pug({pretty: true}))
        .pipe(gulpPugBeautify({omit_empty: false}))
        .pipe(gulp.dest('./build'));
});
gulp.task('css-build', function () {
    gulp.src(['./src/shared/sass/**/*.sass', './src/components/**/*.sass'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(concat('style.css'))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer({
            browsers: ['> 1%', 'last 5 versions', 'Android >= 3', 'Firefox ESR', 'Opera 12.1']
        }))
        .pipe(gulp.dest('./build/assets/css'));
});
gulp.task('js-build', function () {
    gulp.src(['./src/shared/js/**/*.js', './src/components/**/*.js'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('script.js'))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build/assets/js'))
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        open: false,
        tunnel: false,
        host: 'localhost',
        port: 9000,
        logPrefix: "Craft Group"
    });
});
gulp.task('watch', ['pug', 'css', 'js'], function () {

    gulp.watch(['./src/components/**/*.pug'], ['pug']);
    gulp.watch(['./src/components/**/*.sass', './src/shared/sass/**/*.sass'], ['css']);
    gulp.watch(['./src/components/**/*.js', './src/shared/js/**/*.js'], ['js']);

    gulp.watch('./dist/assets/js/*.js').on('change', browserSync.reload);
    gulp.watch('./dist/assets/css/*.css').on('change', browserSync.reload);
    gulp.watch('./dist/*.html').on('change', browserSync.reload);

});

gulp.task('build', ['pug-build', 'css-build', 'js-build']);
gulp.task('default', ['watch', 'browser-sync']);
