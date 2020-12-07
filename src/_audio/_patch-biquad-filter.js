/**~ja
 * フィルター・パッチ
 * @extends {Patch}
 * @version 2020-12-07
 */
/**~en
 * Filter patch
 * @extends {Patch}
 * @version 2020-12-07
 */
class BiquadFilterPatch extends Patch {

	/**~ja
	 * フィルター・パッチを作る
	 * @param {Synth} synth シンセ
	 * @param {object} params パラメーター
	 */
	/**~en
	 * Make a filter patch
	 * @param {Synth} synth Synth
	 * @param {object} params Parameters
	 */
	constructor(synth, params) {
		super(synth);

		this._f = this._synth.context().createBiquadFilter();

		this._f.type            = params.type      ?? 'lowpass';
		this._f.frequency.value = params.frequency ?? 1000;
		this._f.Q.value         = params.Q         ?? 1;
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
		return this._f;
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
		return this._f;
	}


	// -------------------------------------------------------------------------


	/**~ja
	 * 周波数
	 * @param {number=} value 周波数
	 * @param {number=} time 時刻
	 * @param {string=} type 変更の種類
	 * @return {AudioParam|BiquadFilterPatch} オーディオ・パラメーター／このパッチ
	 */
	/**~en
	 * Frequency
	 * @param {number=} value Frequency
	 * @param {number=} time Time
	 * @param {string=} type Type of changing
	 * @return {AudioParam|BiquadFilterPatch} Audio paramter, or this patch
	 */
	frequency(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._f.frequency;
		setParam(this._f.frequency, value, time, type);
		return this;
	}

	/**~ja
	 * Q値
	 * @param {number=} value Q値
	 * @param {number=} time 時刻
	 * @param {string=} type 変更の種類
	 * @return {AudioParam|BiquadFilterPatch} オーディオ・パラメーター／このパッチ
	 */
	/**~en
	 * Q value
	 * @param {number=} value Q value
	 * @param {number=} time Time
	 * @param {string=} type Type of changing
	 * @return {AudioParam|BiquadFilterPatch} Audio paramter, or this patch
	 */
	Q(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._f.Q;
		setParam(this._f.Q, value, time, type);
		return this;
	}

}

assignAlias(BiquadFilterPatch);