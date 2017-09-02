var gulp = require('gulp');
var uglify = require('gulp-uglify');
var exec = require('child_process').exec;
var sass = require('gulp-sass');

gulp.on('stop', function() {  process.exit(0); });
gulp.on('err', function() { 
	console.log("Error:")
	console.log(err);
	process.exit(1);
 });


gulp.task('compile_kotlin', [], function () {
  return exec('kotlinc-js src -output tmp/PracticingMusician.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  	return gulp.src('tmp/PracticingMusician.js')
    //.pipe(uglify())
    .pipe(gulp.dest('dist/pm-listener/js/'));
  });
});

gulp.task('copy_js_files', function () {
  return gulp.src('./app/pm-listener/js/**/*.js')
    //.pipe(uglify())
    .pipe(gulp.dest('dist/pm-listener/js/'));
});

gulp.task('copy_kotlin_compiled_code', function () {
  return gulp.src('tmp/PracticingMusician.js')
    //.pipe(uglify())
    .pipe(gulp.dest('dist/pm-listener/js/'));
});

gulp.task('copy_kotlin', function () {
  return gulp.src('./node_modules/kotlin/kotlin.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/pm-listener/js/'));
});

gulp.task('copy_html', function () {
  return gulp.src('app/app.html')
    .pipe(gulp.dest('dist/'));
});

gulp.task('copy_xml_converter',function() {
  return gulp.src('app/xml_converter.html')
    .pipe(gulp.dest('dist/'));
})

gulp.task('copy_test_site',function() {
  return gulp.src('app/test-site.php')
    .pipe(gulp.dest('dist/'));
})

gulp.task('compile_sass', function () {
  return gulp.src('app/pm-listener/sass/notation.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/pm-listener/css/'));
});

gulp.task('copy_sass', function () {
  return gulp.src('app/pm-listener/sass/notation.scss')
    .pipe(gulp.dest('dist/pm-listener/sass/'));
});

gulp.task('copy_images', function () {
  return gulp.src('app/pm-listener/images/*')
    .pipe(gulp.dest('dist/pm-listener/images'));
});

gulp.task('copy_audio', function () {
  return gulp.src('app/pm-listener/audio/*')
    .pipe(gulp.dest('dist/pm-listener/audio'));
});

// gulp.task('cleanup', [], function() {})

gulp.task('default', [
  'copy_test_site',
	'copy_xml_converter',
  'compile_kotlin',
  //'copy_kotlin_compiled_code',
  'copy_js_files',
  'copy_kotlin',
  'compile_sass',
  'copy_sass',
  'copy_html',
  'copy_images',
  'copy_audio'
]);
