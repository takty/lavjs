//  オシレーター・パッチ


class OscillatorPatch extends SourcePatch {

	constructor(synth, params) {
		super();
		this._synth = synth;

		this._o = this._synth.context().createOscillator();
		this._g = this._synth.context().createGain();
		this._o.connect(this._g);

		this._o.type            = params.type      ?? 'sine';
		this._o.frequency.value = params.frequency ?? 440;
		this._o.detune.value    = params.detune    ?? 0;
		this._g.gain.value      = params.gain      ?? 1;
	}

	getInput(key = null) {
		switch (key) {
			case 'frequency': return this._o.frequency;
			case 'detune'   : return this._o.detune;
			case 'gain'     : return this._g.gain;
		}
	}

	getOutput() {
		return this._g;
	}

	set(key, val) {
		switch (key) {
			case 'type'     : this._o.type            = val; break;
			case 'frequency': this._o.frequency.value = val; break;
			case 'detune'   : this._o.detune.value    = val; break;
			case 'gain'     : this._g.gain.value      = val; break;
		}
	}

	start(time) {
		this._o.start(time);
	}

	stop(time) {
		this._o.stop(time);
	}

}