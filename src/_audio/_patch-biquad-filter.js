// ================================================ フィルター・パッチ


class BiquadFilterPatch extends Patch {

	constructor(synth, type, params) {
		this._synth = synth;
		this._targets = [];
		this._pluged = null;

		this.type = par(params, 'type', type);
		this.freq = par(params, 'freq', 1000);
		this.q = par(params, 'q', 1);
	}

	_update() {
		if (this.f && this.f.type !== this.type) this.f.type = this.type;
		if (this.f && this.f.frequency.value !== this.freq) this.f.frequency.value = this.freq;
		if (this.f && this.f.Q.value !== this.q) this.f.Q.value = this.q;
	}

	_getTarget(opt_param) {
		if (opt_param === undefined) {
			return function () { return this.f; }.bind(this);
		}
	}

	_construct() {
		this.f = this._synth.context.createBiquadFilter();
		this.f.type = this.type;
		this.f.frequency.value = this.freq;
		this.f.Q.value = this.q;
		this._pluged = this.f;
	}

	_destruct() {
		disconnect(this.f);
		this.f = null;
	}

}
