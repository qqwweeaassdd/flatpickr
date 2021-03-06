const gulp = require("gulp");
const stylus = require("gulp-stylus");
const babel = require("gulp-babel");
const cssmin = require("gulp-cssmin");
const lint = require("gulp-jshint");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");

const paths = {
    style: "src/style/flatpickr.styl",
    script: "src/flatpickr.js",
    themes: "./src/style/themes/*.styl"
};

function script() {
    return gulp.src(paths.script)
    .pipe(lint({
        "esversion": 6,
        "unused": true
    }))
    .pipe(lint.reporter('default'))
    .pipe(babel({presets: ['es2015']}))
    .pipe(uglify()).on('error', errorHandler)
    .pipe(rename({ suffix: '.min'}))
    .pipe(gulp.dest('dist'));
};

function style() {
    return gulp.src(paths.style)
    .pipe(stylus())
    .pipe(cssmin()).on('error', errorHandler)
    .pipe(rename({ suffix: '.min'}))
    .pipe(gulp.dest('dist'));
};

function themes() {
    return gulp.src(paths.themes)
    .pipe(stylus())
    .pipe(cssmin()).on('error', errorHandler)
    .pipe(rename({ prefix: 'flatpickr.',suffix: '.min'}))
    .pipe(gulp.dest('dist'));
};

function watch(cb) {
    gulp.watch('./src/style/**/*.styl', gulp.parallel(style, themes));
    gulp.watch(paths.script, script);
    return cb();
};

// Handle the error
function errorHandler (error) {
    console.log(error.toString());
}

const build = gulp.parallel(script, style, themes,watch);

gulp.task("build",  build );
gulp.task("default", build);
