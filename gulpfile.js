var gulp = require('gulp');
var uglify = require('gulp-uglify');
var shell = require('gulp-shell')


gulp.task('compile_kotlin', [], function() {})

gulp.task('copy_js_files', function() {
	gulp.src('./app/js/**/*.js')
	.pipe(uglify())
	.pipe(gulp.dest('gulp-build/js'))
})

gulp.task('copy_kotlin_compiled_code',function() {
	shell.task('kotlinc-js src -output tmp/PracticingMusician.js')
	
	gulp.src('tmp/PracticingMusician.js')
	.pipe(uglify())
	.pipe(gulp.dest('gulp-build/js'))
	
})

gulp.task('copy_kotlin',function() {
	gulp.src('./out/production/PracticingMusician/lib/kotlin.js')
	.pipe(uglify())
	.pipe(gulp.dest('gulp-build/js'))
})

gulp.task('copy_html', function() {
	gulp.src('app/app.html')
	.pipe(gulp.dest('gulp-build'))
})

gulp.task('copy_css', function() {
	gulp.src('app/css/*')
	.pipe(gulp.dest('gulp-build/css'))
})

gulp.task('copy_images', function() {
	gulp.src('app/images/*')
	.pipe(gulp.dest('gulp-build/images'))
})

gulp.task('copy_audio', function() {
	gulp.src('app/audio/*')
	.pipe(gulp.dest('gulp-build/audio'))
})

gulp.task('cleanup', [], function() {})

gulp.task('default', ['compile_kotlin','copy_kotlin_compiled_code','copy_js_files','copy_kotlin','copy_css','copy_html','copy_images','copy_audio','cleanup'])