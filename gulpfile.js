"use strict";

var gulp = require("gulp");

var plumber = require("gulp-plumber");
var pug = require("gulp-pug");
var server = require("browser-sync").create();
var styl = require("gulp-stylus");

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
