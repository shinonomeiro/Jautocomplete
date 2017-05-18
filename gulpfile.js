var gulp 	= require('gulp');
var watch 	= require('gulp-watch');
var babel	= require('gulp-babel');

gulp.task('default', ['watch']);　// $ gulp
gulp.task('build', ['babel']); // $ gulp build

gulp.task('watch', function() {
	return watch('./jautocomplete.js', { ignoreInitial: false }, function() {
		gulp.start('build');
	});
});

gulp.task('build', function() {
	// ES6 -> ES5 トランスパイル
	return gulp.src('./jautocomplete.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('./build'));
});
