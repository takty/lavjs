// ================================================ マイク・パッチ


class MicrophonePatch extends Patch {

	constructor(synth, params) {
		this._synth = synth;
		this._targets = [];
		this._pluged = null;

		this.amp = par(params, 'amp', 10);
		this.afFreq = par(params, 'afFreq', 0);
		this.afQ = par(params, 'afQ', 12);
	}

	_update() {
		if (this.a && this.a.gain.value !== this.amp) this.a.gain.value = this.amp;
		if (this.f && this.f.frequency.value !== this.afFreq) this.f.frequency.value = this.afFreq;
		if (this.f && this.f.Q.value !== this.afQ) this.f.Q.value = this.afQ;
	}

	_getTarget(opt_param) {
		if (opt_param === 'amp') {
			return function () { return this.a.gain; }.bind(this);
		}
		if (opt_param === 'afFreq') {
			return function () { return this.f.frequency; }.bind(this);
		}
		if (opt_param === 'afQ') {
			return function () { return this.f.Q; }.bind(this);
		}
	}

	_construct() {
		this.a = this._synth.context.createGain();
		this.a.gain.value = this.amp;

		this.f = null;
		if (typeof this.afFreq !== 0) {
			this.f = this._synth.context.createBiquadFilter();
			this.f.type = 'notch';
			this.f.Q.value = this.afQ;
			this.f.frequency.value = this.afFreq;
		}
		navigator.webkitGetUserMedia({ audio: true, video: false }, (stream) => {
			this.m = this._synth.context.createMediaStreamSource(stream);
			if (this.f) {
				this.m.connect(this.f);
				this.f.connect(this.a);
			}
			else {
				this.m.connect(this.a);
			}
		}, () => {});
		this._pluged = this.a;
	}

	_destruct() {
		disconnect(this.a, this.f, this.m);
		this.a = this.f = this.m = null;
	}

}
