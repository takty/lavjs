/**~ja
 * スピーカー・パッチ
 * @extends {Patch}
 * @version 2020-12-07
 */
/**~en
 * Speaker patch
 * @extends {Patch}
 * @version 2020-12-07
 */
class SpeakerPatch extends Patch {

	/**~ja
	 * スピーカー・パッチを作る
	 * @param {Synth} synth シンセ
	 * @param {object} params パラメーター
	 */
	/**~en
	 * Make a speaker patch
	 * @param {Synth} synth Synth
	 * @param {object} params Parameters
	 */
	constructor(synth, params) {
		super(synth);

		this._g = this._synth.context().createGain();
		this._g.connect(this._synth.context().destination);

		this._g.gain.value = params.gain ?? 1;
	}

	/**~ja
	 * 入力（オーディオ・ノード）
	 * @return {AudioNode} オーディオ・ノード
	 */
	/**~en
	 * Input (audio node)
	 * @return {AudioNode} Audio node
	 */
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