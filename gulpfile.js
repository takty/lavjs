const gulp       = require('gulp');
const $          = require('gulp-load-plugins')({ pattern: ['gulp-*'] });
const commentTag = require('./gulp-comment-tag');
const copySync   = require('./copy-sync');

gulp.task('compile-ja', () => {
	return gulp.src(['src/**/[^_]*.js'])
		.pipe($.plumber())
		.pipe($.include())
		.pipe($.deleteLines({ 'filters': [/\/\/=/] }))
		.pipe($.replace(/^\t$/gm, ''))
		.pipe(commentTag('ja'))
		.pipe(gulp.dest('dist-ja'));
});

gulp.task('compile-en', () => {
	return gulp.src(['src/**/[^_]*.js'])
		.pipe($.plumber())
		.pipe($.include())
		.pipe($.deleteLines({ 'filters': [/\/\/=/] }))
		.pipe($.replace(/^\t$/gm, ''))
		.pipe(commentTag('en'))
		.pipe(gulp.dest('dist'));
});

gulp.task('compile', gulp.parallel('compile-ja', 'compile-en'));

gulp.task('copy-def', (done) => {
	copySync('./src/def', './dist/def');
	copySync('./src/def', './dist-ja/def');
	done();
});

gulp.task('watch', () => {
	gulp.watch('src/**/*.js', gulp.series('compile'));
	gulp.watch('src/**/*.json', gulp.series('copy-def'));
});

gulp.task('default', gulp.series('compile', 'copy-def', 'watch'));
