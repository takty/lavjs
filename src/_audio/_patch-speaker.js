/**~ja
 * スピーカー・パッチ
 * @version 2020-12-04
 */
/**~en
 * Speaker patch
 * @version 2020-12-04
 */
class SpeakerPatch extends Patch {

	constructor(synth, params) {
		super(synth);

		this._g = this._synth.context().createGain();
		this._g.connect(this._synth.context().destination);

		this._g.gain.value = params.gain ?? 1;
	}


	getInput() {
		return this._g;
	}


	// -------------------------------------------------------------------------


	gain(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._g.gain;
		setParam(this._g.gain, value, time, type);
		return this;
	}

}

assignAlias(SpeakerPatch);