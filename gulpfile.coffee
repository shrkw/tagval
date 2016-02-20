gulp = require 'gulp'
rename = require 'gulp-rename'
plumber = require 'gulp-plumber'
coffee = require 'gulp-coffee'
uglify = require 'gulp-uglify'
notify = require 'gulp-notify'
mocha = require 'gulp-mocha'

source_path = "tagval.coffee"
js_dest = "./"
js_min_filename = "./tagval-min.js"
gulp.task 'build', ->
  gulp.src source_path
    .pipe plumber(errorHandler: notify.onError '<%= error.message %>')
    .pipe coffee()
    .pipe gulp.dest(js_dest)
    .pipe uglify()
    .pipe rename(js_min_filename)
    .pipe gulp.dest(js_dest)

gulp.task 'watch', ->
  gulp.watch source_path, ['build']

test_path = "test/*.js"
gulp.task 'test', ->
  gulp.src test_path
    .pipe plumber(errorHandler: notify.onError '<%= error.message %>')
    .pipe coffee()
    .pipe mocha()

gulp.task 'prepublish', ['build', 'test']
