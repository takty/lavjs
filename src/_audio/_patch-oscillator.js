/**~ja
 * オシレーター・パッチ
 * @version 2020-12-04
 */
/**~en
 * Oscillator patch
 * @version 2020-12-04
 */
class OscillatorPatch extends SourcePatch {

	constructor(synth, params) {
		super(synth);

		this._o = this._synth.context().createOscillator();
		this._g = this._synth.context().createGain();
		this._o.connect(this._g).connect(this._sw);

		this._o.type            = params.type      ?? 'sine';
		this._o.frequency.value = params.frequency ?? 440;
		this._o.detune.value    = params.detune    ?? 0;
		this._g.gain.value      = params.gain      ?? 1;
		this._o.start();
	}


	// -------------------------------------------------------------------------


	frequency(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._o.frequency;
		setParam(this._o.frequency, value, time, type);
		return this;
	}

	detune(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._o.detune;
		setParam(this._o.detune, value, time, type);
		return this;
	}

	gain(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._g.gain;
		setParam(this._g.gain, value, time, type);
		return this;
	}

}

assignAlias(OscillatorPatch);