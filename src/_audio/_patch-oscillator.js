// ================================================ オシレーター・パッチ


class OscillatorPatch extends Patch {

	constructor(synth, type, params) {
		this._synth = synth;
		this._targets = [];
		this._pluged = null;

		this.type = par(params, 'type', type);
		this.freq = par(params, 'freq', 440);
		this.detune = par(params, 'detune', 0);
		this.amp = par(params, 'amp', 0.5);
		this.base = par(params, 'base', 0);

		this.start = par(params, 'start', 0);
		this.stop = par(params, 'stop', 0);
	}

	_update() {
		if (this.o && this.o.type !== this.type) this.o.type = this.type;
		if (this.o && this.o.frequency.value !== this.freq) this.o.frequency.value = this.freq;
		if (this.o && this.o.detune.value !== this.detune) this.o.detune.value = this.detune;
		if (this.a && this.a.gain.value !== this.amp) this.a.gain.value = this.amp;
		if (this.base) {
			for (var i = 0, I = this._targets.length; i < I; i += 1) {
				var t = this._targets[i]();  // 実行すると有効な接続先が得られる
				if (t.value !== undefined) {
					t.value = this.base;
				}
			}
		}
	}

	_getTarget(opt_param) {
		if (opt_param === 'freq') {
			return function () { return this.o.frequency; }.bind(this);
		} else if (opt_param === 'detune') {
			return function () { return this.o.detune; }.bind(this);
		} else if (opt_param === 'amp') {
			return function () { return this.a.gain; }.bind(this);
		}
	}

	_construct() {
		this.o = this._synth.context.createOscillator();
		this.o.type = this.type;
		this.o.frequency.value = this.freq;
		this.o.detune.value = this.detune;

		this.a = this._synth.context.createGain();
		this.a.gain.value = this.amp;

		this.o.connect(this.a);
		this._pluged = this.a;
	}

	_reserveStart(t) {
		if (this.o) this.o.start(t + this.start);
	}

	_reserveStop(t) {
		if (this.o) this.o.stop(t + this.stop);
		if (this.a) this.a.gain.setValueAtTime(0, t + this.stop);
	}

	_destruct() {
		disconnect(this.o, this.a);
		this.o = this.a = null;
	}
}
