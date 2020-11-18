// ================================================ マイク・パッチ


class MicrophonePatch extends Patch {

	constructor(quilt, params) {
		this._quilt = quilt;
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
		this.a = this._quilt.context.createGain();
		this.a.gain.value = this.amp;

		this.f = null;
		if (typeof this.afFreq !== 0) {
			this.f = this._quilt.context.createBiquadFilter();
			this.f.type = 'notch';
			this.f.Q.value = this.afQ;
			this.f.frequency.value = this.afFreq;
		}
		var that = this;
		navigator.webkitGetUserMedia({ audio: true, video: false }, function (stream) {
			that.m = that._quilt.context.createMediaStreamSource(stream);
			if (that.f) {
				that.m.connect(that.f);
				that.f.connect(that.a);
			}
			else {
				that.m.connect(that.a);
			}
		}, function () {
		});
		this._pluged = this.a;
	}

	_destruct() {
		disconnect(this.a, this.f, this.m);
		this.a = this.f = this.m = null;
	}

}
