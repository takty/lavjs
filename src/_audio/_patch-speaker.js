/**~ja
 * スピーカー・パッチ
 * @extends {Patch}
 * @version 2020-12-16
 */
/**~en
 * Speaker patch
 * @extends {Patch}
 * @version 2020-12-16
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
	constructor(synth, { gain = 1 }) {
		super(synth);

		this._g = this._synth.context().createGain();
		this._g.connect(this._synth.context().destination);

		this._g.gain.value = gain;
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


	/**~ja
	 * ゲイン
	 * @param {number=} value ゲイン
	 * @param {number=} time 時刻
	 * @param {string=} type 変更の種類
	 * @return {AudioParam|SpeakerPatch} オーディオ・パラメーター／このパッチ
	 */
	/**~en
	 * Gain
	 * @param {number=} value Gain
	 * @param {number=} time Time
	 * @param {string=} type Type of changing
	 * @return {AudioParam|SpeakerPatch} Audio paramter, or this patch
	 */
	gain(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._g.gain;
		setParam(this._g.gain, value, time, type);
		return this;
	}

}

assignAlias(SpeakerPatch);