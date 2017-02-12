"use strict";

var gulp = require("gulp");

var autoprefixer = require("gulp-autoprefixer");
var cssmin = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var inject = require("gulp-inject");
var plumber = require("gulp-plumber");
var pug = require("gulp-pug");
var rename = require("gulp-rename");
var server = require("browser-sync").create();
var styl = require("gulp-stylus");
var svgmin = require("gulp-svgmin");
var svgstore = require("gulp-svgstore");

gulp.task("serve", ["markup", "styles"], function() {
  server.init({
    server: "app",
    notify: false,
    ui: false
  });

  gulp.watch("app/pages/**/*.pug", ["markup"]);
  gulp.watch("app/styles/**/*.styl", ["styles"]);

  gulp.watch("app/*.html").on("change", server.reload);
});

gulp.task("markup", function() {
  return gulp.src("app/pages/*.pug")
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest("app"))
    .pipe(server.stream());
});

gulp.task("styles", function() {
  return gulp.src("styles/style.styl")
    .pipe(plumber())
    .pipe(styl())
    .pipe(gulp.dest("app/css"))
    .pipe(server.stream());
});

gulp.task("images-dist", function() {
  return gulp.src("app/img/**/*.{png,jpg,gif}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true})
  ]))
  .pipe(gulp.dest("dist/img"));
});

gulp.task("styles-dist", function() {
  return gulp.src("app/css/style.css")
    .pipe(autoprefixer({
      browsers: ["last 2 versions"]
    }))
    .pipe(cssmin())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("dist/css"));
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
