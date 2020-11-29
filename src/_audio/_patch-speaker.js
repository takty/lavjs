//  スピーカー・クラス（PATCH.Speaker）


class Speaker extends Patch {

	constructor(synth) {
		super();
		this._synth = synth;

		this._g = this._synth.context().createGain();
		this._g.connect(this._synth.context().destination);
	}

	getInput(id = null) {
		switch (id) {
			case 'gain': return this._g.gain;
		}
		return this._g;
	}

	getOutput() {
		return null;
	}

	set(key, val) {
		switch (key) {
			case 'gain': this._g.gain.value = val; break;
		}
	}

}