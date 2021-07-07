/**~ja
 * ゲイン・パッチ
 * @extends {Patch}
 * @version 2021-05-21
 */
/**~en
 * Gain patch
 * @extends {Patch}
 * @version 2021-05-21
 */
class GainPatch extends Patch {

	/**~ja
	 * ゲイン・パッチを作る
	 * @constructor
	 * @param {Synth} synth シンセ
	 * @param {object=} [params={}] パラメーター
	 */
	/**~en
	 * Make a gain patch
	 * @constructor
	 * @param {Synth} synth Synth
	 * @param {object=} [params={}] Parameters
	 */
	constructor(synth, params = {}) {
		super(synth);
		const { gain = 1 } = params;

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
	gain(value = null, time = this._synth.time(), type = null) {
		if (!value) return this._g.gain;
		setParam(this._g.gain, value, time, type);
		return this;
	}

}

assignAlias(GainPatch);