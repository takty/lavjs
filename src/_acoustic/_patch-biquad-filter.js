/**~ja
 * 二次フィルター・パッチ
 * @extends {Patch}
 * @version 2020-12-16
 */
/**~en
 * Biquad filter patch
 * @extends {Patch}
 * @version 2020-12-16
 */
class BiquadFilterPatch extends Patch {

	/**~ja
	 * 二次フィルター・パッチを作る
	 * @param {Synth} synth シンセ
	 * @param {object} params パラメーター
	 */
	/**~en
	 * Make a biquad filter patch
	 * @param {Synth} synth Synth
	 * @param {object} params Parameters
	 */
	constructor(synth, { type = 'lowpass', frequency = 1000, Q = 1 }) {
		super(synth);

		this._f = this._synth.context().createBiquadFilter();

		this._f.type            = type;
		this._f.frequency.value = frequency;
		this._f.Q.value         = Q;
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
	 * 種類
	 * @param {string=} value 種類
	 * @return {string|BiquadFilterPatch} 種類／このパッチ
	 */
	/**~en
	 * Type
	 * @param {string=} value Type
	 * @return {string|BiquadFilterPatch} Type, or this patch
	 */
	type(value = null) {
		if (!value) return this._f.type;
		this._f.type = value;
		return this;
	}

	/**~ja
	 * 周波数 [Hz]
	 * @param {number=} value 周波数
	 * @param {number=} time 時刻
	 * @param {string=} type 変更の種類
	 * @return {AudioParam|BiquadFilterPatch} オーディオ・パラメーター／このパッチ
	 */
	/**~en
	 * Frequency [Hz]
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