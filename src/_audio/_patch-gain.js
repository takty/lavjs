// ================================================ ゲイン・パッチ


class GainPatch extends Patch {

	constructor(quilt, type, params) {
		this._quilt = quilt;
		this._targets = [];
		this._pluged = null;

		this.type = type;
		if (type === 'constant') {
			this.amp = par(params, 'amp', 1.0);
		} else {
			this.begin = par(params, 'begin', 0.5);
			this.end = par(params, 'end', 0.00001);
			if (this.end === 0) this.end = 1e-6;
			this.dur = par(params, 'dur', 0.1);
			this.base = par(params, 'base', 0);

			this.start = par(params, 'start', 0);
			this.stop = par(params, 'stop', 0);
		}
	}

	_update() {
		if (this.a && this.a.gain.value !== this.amp) this.a.gain.value = this.amp;
	}

	_getTarget(opt_param) {
		if (opt_param === undefined) {
			return function () { return this.g; }.bind(this);
		} else {
			if (opt_param === 'amp') {
				return function () { return this.g.gain; }.bind(this);
			}
		}
	}

	_construct() {
		this.g = this._quilt.context.createGain();
		this.g.gain.value = (this.amp === undefined) ? 0 : this.amp;
		this._pluged = this.g;
	}

	_reserveStart(t) {
		if (this.type !== 'constant') {
			this.g.gain.setValueAtTime(this.begin, t + this.start);
			if (this.type === 'line') {
				this.g.gain.linearRampToValueAtTime(this.end, t + this.start + this.dur);
			} else if (this.type === 'exponential') {
				this.g.gain.exponentialRampToValueAtTime(this.end, t + this.start + this.dur);
			}
			return true;
		}
	}

	_keyOff(t, notifyShutdown) {
		if (this.type !== 'constant' && this.g) {
			var g = this.g;
			g.gain.setValueAtTime(this.end, t + this.stop);
			var id = window.setInterval(function () {
				if (g.gain.value < 1e-3) {
					window.clearInterval(id);
					notifyShutdown();
				}
			}, (t - this._quilt.context.currentTime) * 1000);
		}
	}

	_reserveStop(t) {
		if (this.g && this.type === 'constant') {
			this.g.gain.setValueAtTime(0, t);
		}
	}

	_destruct() {
		disconnect(this.g);
		this.g = null;
	}

}

