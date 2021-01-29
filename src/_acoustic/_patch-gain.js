/**~ja
 * ゲイン・パッチ
 * @extends {Patch}
 * @version 2020-12-16
 */
/**~en
 * Gain patch
 * @extends {Patch}
 * @version 2020-12-16
 */
class GainPatch extends Patch {

	/**~ja
	 * ゲイン・パッチを作る
	 * @param {Synth} synth シンセ
	 * @param {object} params パラメーター
	 */
	/**~en
	 * Make a gain patch
	 * @param {Synth} synth Synth
	 * @param {object} params Parameters
	 */
	constructor(synth, { gain = 1 }) {
		super(synth);

		this._g = this._synth.context().createGain();
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

	/**~ja
	 * 出力（オーディオ・ノード）
	 * @return {AudioNode} オーディオ・ノード
	 */
	/**~en
	 * Output (audio node)
	 * @return {AudioNode} Audio node
	 */
	getOutput() {
		return this._g;
	}


	// -------------------------------------------------------------------------


	/**~ja
	 * ゲイン
	 * @param {number=} value ゲイン
	 * @param {number=} time 時刻
	 * @param {string=} type 変更の種類
	 * @return {AudioParam|GainPatch} オーディオ・パラメーター／このパッチ
	 */
	/**~en
	 * Gain
	 * @param {number=} value Gain
	 * @param {number=} time Time
	 * @param {string=} type Type of changing
	 * @return {AudioParam|GainPatch} Audio paramter, or this patch
	 */
	gain(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._g.gain;
		setParam(this._g.gain, value, time, type);
		return this;
	}

}

assignAlias(GainPatch);