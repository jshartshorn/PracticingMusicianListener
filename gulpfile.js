var gulp = require('gulp');
var uglify = require('gulp-uglify');
var exec = require('child_process').exec;

gulp.task('compile_kotlin', [], function () {
  exec('kotlinc-js src -output tmp/PracticingMusician.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
})

gulp.task('copy_js_files', function() {
	gulp.src('./app/js/**/*.js')
	.pipe(uglify())
	.pipe(gulp.dest('gulp-build/pm-listener/js'))
})

gulp.task('copy_kotlin_compiled_code',function() {
	gulp.src('tmp/PracticingMusician.js')
	.pipe(uglify())
	.pipe(gulp.dest('gulp-build/pm-listener/js'))
})

gulp.task('copy_kotlin',function() {
	gulp.src('./node_modules/kotlin/kotlin.js')
	.pipe(uglify())
	.pipe(gulp.dest('gulp-build/pm-listener/js'))
})

gulp.task('copy_html', function() {
	gulp.src('app/app.html')
	.pipe(gulp.dest('gulp-build/'))
})

gulp.task('copy_css', function() {
	gulp.src('app/css/*')
	.pipe(gulp.dest('gulp-build/pm-listener/css'))
})

gulp.task('copy_images', function() {
	gulp.src('app/images/*')
	.pipe(gulp.dest('gulp-build/pm-listener/images'))
})

gulp.task('copy_audio', function() {
	gulp.src('app/audio/*')
	.pipe(gulp.dest('gulp-build/pm-listener/audio'))
})

gulp.task('cleanup', [], function() {})

gulp.task('default', ['compile_kotlin','copy_kotlin_compiled_code','copy_js_files','copy_kotlin','copy_css','copy_html','copy_images','copy_audio','cleanup'])
