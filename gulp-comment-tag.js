/**
 * Gulp Comment Tag
 * @author Takuto Yanagida
 * @version 2019-05-07
 */


const through     = require('through2');
const PluginError = require('plugin-error');


module.exports = function (lang) {
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
		let inLineComment = false;
		let ignore = false;
		for (let line of lines) {
			const tl = line.trim();
			if (!inComment) {
				if (tl.startsWith('/**~')) {
					inComment = true;
					ignore = !tl.startsWith('/**~' + lang);
					if (!ignore) line = line.replace('/**~' + lang, '/**');
				} else if (tl.startsWith('/*~')) {
					inComment = true;
					ignore = !tl.startsWith('/*~' + lang);
					if (!ignore) line = line.replace('/*~' + lang, '/*');
				} else if (tl.startsWith('//~')) {
					inLineComment = true;
					ignore = !tl.startsWith('//~' + lang);
					if (!ignore) line = line.replace('//~' + lang, '//');
				}
			}
			if ((inComment && tl.endsWith('*/')) || inLineComment) {
				inComment = false;
				inLineComment = false;
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
};