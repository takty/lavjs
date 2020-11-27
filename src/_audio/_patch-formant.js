// ================================================ フォルマント・パッチ


class FormantPatch extends Patch {

	constructor(synth, params) {
		super();
		this._synth = synth;
		this._targets = [];
		this._pluged = null;

		this.freq1 = par(params, 'freq1', 700);
		this.freq2 = par(params, 'freq2', 1200);
		this.freq3 = par(params, 'freq3', 2900);
		this.q1 = par(params, 'q1', 32);
		this.q2 = par(params, 'q2', 32);
		this.q3 = par(params, 'q3', 32);
	}

	_update() {
		if (this.f1 && this.f1.frequency.value !== this.freq1) this.f1.frequency.value = this.freq1;
		if (this.f2 && this.f2.frequency.value !== this.freq2) this.f2.frequency.value = this.freq2;
		if (this.f3 && this.f3.frequency.value !== this.freq3) this.f3.frequency.value = this.freq3;
		if (this.f1 && this.f1.Q.value !== this.q1) this.f1.Q.value = this.q1;
		if (this.f2 && this.f2.Q.value !== this.q2) this.f2.Q.value = this.q2;
		if (this.f3 && this.f3.Q.value !== this.q3) this.f3.Q.value = this.q3;
	}

	_getTarget(opt_param) {
		if (opt_param === undefined) {
			return function () { return this.i; }.bind(this);
		} else {
			if (opt_param === 'amp') {
				return function () { return this.a.gain; }.bind(this);
			}
		}
	}

	_construct() {
		this.i = this._synth.context.createBiquadFilter();
		this.i.type = 'lowpass';
		this.i.Q.value = 1;
		this.i.frequency.value = 800;

		this.f1 = this._synth.context.createBiquadFilter();
		this.f2 = this._synth.context.createBiquadFilter();
		this.f3 = this._synth.context.createBiquadFilter();

		this.f1.type = 'bandpass';
		this.f2.type = 'bandpass';
		this.f3.type = 'bandpass';

		this.f1.frequency.value = this.freq1;
		this.f2.frequency.value = this.freq2;
		this.f3.frequency.value = this.freq3;

		this.f1.Q.value = this.q1;
		this.f2.Q.value = this.q2;
		this.f3.Q.value = this.q3;

		this.a = this._synth.context.createGain();

		this.i.connect(this.f1);
		this.i.connect(this.f2);
		this.i.connect(this.f3);

		this.f1.connect(this.a);
		this.f2.connect(this.a);
		this.f3.connect(this.a);
		this._pluged = this.a;
	}

	_destruct(t) {
		disconnect(this.i, this.f1, this.f2, this.f3, this.a);
		this.i = null;
		this.f1 = this.f2 = this.f3 = null;
		this.a = null;
	}

}
