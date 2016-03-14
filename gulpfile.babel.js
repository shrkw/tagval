import gulp    from 'gulp';
import rename  from 'gulp-rename';
import plumber from 'gulp-plumber';
import coffee  from 'gulp-coffee';
import uglify  from 'gulp-uglify';
import notify  from 'gulp-notify';
import mocha   from 'gulp-mocha';

var source_path = "tagval.coffee";
var test_path = "test/*.js";
var js_dest = "./";
var js_min_filename = "./tagval-min.js";

gulp.task('build', ()=> {
  gulp.src(source_path)
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(coffee())
    .pipe(gulp.dest(js_dest))
    .pipe(uglify())
    .pipe(rename(js_min_filename))
    .pipe(gulp.dest(js_dest));
});

gulp.task('watch', ()=> {
  gulp.watch(source_path, ['build']);
});

gulp.task('test', ()=> {
  gulp.src(test_path)
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(coffee())
    .pipe(mocha());
});

gulp.task('prepublish', ['build', 'test']);
