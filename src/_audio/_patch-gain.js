/**~ja
 * ゲイン・パッチ
 * @version 2020-12-04
 */
/**~en
 * Gain patch
 * @version 2020-12-04
 */
class GainPatch extends Patch {

	constructor(synth, params) {
		super(synth);

		this._g = this._synth.context().createGain();
		this._g.gain.value = params.gain ?? 1;
	}

	getInput() {
		return this._g;
	}

	getOutput() {
		return this._g;
	}


	// -------------------------------------------------------------------------


	gain(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._g.gain;
		setParam(this._g.gain, value, time, type);
		return this;
	}

}

assignAlias(GainPatch);