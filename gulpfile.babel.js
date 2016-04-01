import gulp    from 'gulp';
import rename  from 'gulp-rename';
import uglify  from 'gulp-uglify';
import mocha   from 'gulp-mocha';
import babel   from 'gulp-babel';

var source_path = "./src/tagval.js";
var test_path = "test/*.js";
var js_dest = "./build";
var js_min_filename = "tagval-min.js";
var test_path = "test/*.js";

gulp.task('build', ()=> {
  gulp.src(source_path)
    .pipe(babel())
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
    .pipe(mocha());
});

gulp.task('prepublish', ['test']);
