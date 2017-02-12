"use strict";

var gulp = require("gulp");

var imagemin = require("gulp-imagemin");
var inject = require("gulp-inject");
var plumber = require("gulp-plumber");
var pug = require("gulp-pug");
var server = require("browser-sync").create();
var styl = require("gulp-stylus");
var svgmin = require("gulp-svgmin");
var svgstore = require("gulp-svgstore");

gulp.task("serve", ["markup", "style"], function() {
  server.init({
    server: "app",
    notify: false,
    ui: false
  });

  gulp.watch("app/pages/**/*.pug", ["markup"]);
  gulp.watch("app/styles/**/*.styl", ["style"]);

  gulp.watch("app/*.html").on("change", server.reload);
});

gulp.task("markup", function() {
  return gulp.src("app/pages/*.pug")
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest("app"))
    .pipe(server.stream());
});

gulp.task("style", function() {
  return gulp.src("styles/style.styl")
    .pipe(plumber())
    .pipe(styl())
    .pipe(gulp.dest("app/css"))
    .pipe(server.stream());
});

gulp.task("images", function() {
  return gulp.src("app/img/**/*.{png,jpg,gif}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true})
  ]))
  .pipe(gulp.dest("dist/img"));
});

gulp.task("svg-sprite", function() {
  var icons = gulp.src("app/img/icons/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({inlineSvg: true}));

  function fileContents(filePath, file) {
    return file.contents.toString();
  }

  return gulp.src("app/pages/parts/svg-sprite.pug")
    .pipe(inject(icons, {transform: fileContents}))
    .pipe(gulp.dest("app/pages/parts"));
});
