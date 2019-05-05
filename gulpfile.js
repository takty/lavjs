'use strict';

const fs          = require('fs-extra');
const glob        = require('glob');
const path        = require('path');
const gulp        = require('gulp');
const $           = require('gulp-load-plugins')({ pattern: ['gulp-*'] });
const through     = require('through2');
const PluginError = require('plugin-error');

const stripLangComments = (lang) => {
	return through.obj(function (file, enc, done) {
		if (file.isNull()) {
			done(null, file);
			return;
		}
		if (file.isStream()) {
			done(new PluginError("gulp-strip-lang-comments", "Streaming not supported."));
			return;
		}
		const str = file.contents.toString();
		const lines = str.split(/\r\n|\r|\n/);
		const mods = [];
		let inComment = false;
		let ignore = false;
		for (let line of lines) {
			const tl = line.trim();
			if (!inComment && tl.startsWith('/**~')) {
				inComment = true;
				ignore = tl !== '/**~' + lang;
				if (!ignore) line = line.replace('/**~' + lang, '/**');
			}
			if (inComment && tl.endsWith('*/')) {
				inComment = false;
				if (ignore) {
					ignore = false;
					continue;
				}
			}
			if (!inComment || !ignore) mods.push(line);
		}
		file.contents = Buffer.from(mods.join('\n'));
		this.push(file);
		done();
	});
}

function copySync(from, to) {
	const isToDir = to.endsWith('/');
	const files = glob.sync(from);
	for (let f of files) {
		if (isToDir) {
			const fn = path.basename(f);
			fs.copySync(f, path.join(to, fn));
		} else {
			fs.copySync(f, to);
		}
	}
}

gulp.task('compile-ja', () => {
	return gulp.src(['src/**/[^_]*.js'])
		.pipe($.plumber())
		.pipe($.include())
		.pipe($.deleteLines({ 'filters': [/\/\/=/] }))
		.pipe($.replace(/^\t$/gm, ''))
		.pipe(stripLangComments('ja'))
		.pipe(gulp.dest('dist-ja'));
});

gulp.task('compile-en', () => {
	return gulp.src(['src/**/[^_]*.js'])
		.pipe($.plumber())
		.pipe($.include())
		.pipe($.deleteLines({ 'filters': [/\/\/=/] }))
		.pipe($.replace(/^\t$/gm, ''))
		.pipe(stripLangComments('en'))
		.pipe(gulp.dest('dist'));
});

gulp.task('compile', gulp.parallel('compile-ja', 'compile-en'));

gulp.task('watch', () => {
	gulp.watch('src/**/*.js', gulp.series('compile'));
});

gulp.task('default', gulp.series('compile', 'watch'));
