// ================================================ 音声ファイル・パッチ


class SoundFilePatch extends Patch {

	constructor(synth, params) {
		super();
		this._synth = synth;
		this._targets = [];
		this._pluged = null;

		this.begin = par(params, 'begin', 0);
		this.end = par(params, 'end', 0);

		this._buf = par(params, 'buf', null);
		if (this._buf) {
			this._buf.getBuffer((audioBuf) => {
				this.audioBuf = audioBuf;
			});
		}
	}

	_update() {
	}

	_getTarget(opt_param) {
	}

	_construct() {
		this.src = this._synth.context.createBufferSource();
		if (this.audioBuf) this.src.buffer = this.audioBuf;
		this._pluged = this.src;
	}

	_reserveStart(t) {
		if (this.src && this.audioBuf) {
			this.src.loop = false;
			this.src.loopStart = 0;
			this.src.loopEnd = (this.audioBuf) ? this.audioBuf.duration : 0;
			this.src.playbackRate.value = 1.0;
			this.src.start(t, this.begin, this.end || this.audioBuf.duration);
			this.isStarted = true;
		}
	}

	_reserveStop(t) {
		if (this.isStarted && this.src) {
			this.src.stop(t);
			this.isStarted = false;
		}
	}

	_destruct() {
	}

}

class SoundFile {

	constructor(synth, url) {
		this._synth = synth;
		this._url = url;
		this._audioBuf = null;
		this.getBuffer();
	}

	getBuffer(fn) {
		if (this._audioBuf) {
			if (fn) fn(this._audioBuf);
			return;
		}
		var r = new XMLHttpRequest();
		r.open('GET', this._url, true);
		r.responseType = 'arraybuffer';
		r.onload = () => {
			console.log('SoundFile - loaded');
			this._synth.context.decodeAudioData(r.response, function (audioBuf) {
				this._audioBuf = audioBuf;
				console.log('SoundFile - decoded');
				if (fn)
					fn(this._audioBuf);
				return;
			}, function (err) {
				console.log('SoundFile - error');
			});
		};
		r.send();
	}
}
