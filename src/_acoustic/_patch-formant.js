/**~ja
 * フォルマント・パッチ
 * @extends {Patch}
 * @version 2020-12-16
 */
/**~en
 * Formant patch
 * @extends {Patch}
 * @version 2020-12-16
 */
class FormantPatch extends Patch {

	/**~ja
	 * フォルマント・パッチを作る
	 * @param {Synth} synth シンセ
	 * @param {object} params パラメーター
	 */
	/**~en
	 * Make a formant patch
	 * @param {Synth} synth Synth
	 * @param {object} params Parameters
	 */
	constructor(synth, {
		type1 = 'bandpass',
		type2 = 'bandpass',
		type3 = 'bandpass',
		frequency1 = 700,
		frequency2 = 1200,
		frequency3 = 2900,
		Q1 = 32,
		Q2 = 32,
		Q3 = 32,
	}) {
		super(synth);

		this._i  = this._synth.context().createBiquadFilter();
		this._f1 = this._synth.context().createBiquadFilter();
		this._f2 = this._synth.context().createBiquadFilter();
		this._f3 = this._synth.context().createBiquadFilter();
		this._g  = this._synth.context().createGain();
		this._i.connect(this._f1).connect(this._g);
		this._i.connect(this._f2).connect(this._g);
		this._i.connect(this._f3).connect(this._g);

		this._i.type            = 'lowpass';
		this._i.Q.value         = 1;
		this._i.frequency.value = 800;

		this._f1.type = type1;
		this._f2.type = type2;
		this._f3.type = type3;
		this._f1.frequency.value = frequency1;
		this._f2.frequency.value = frequency2;
		this._f3.frequency.value = frequency3;
		this._f1.Q.value = Q1;
		this._f2.Q.value = Q2;
		this._f3.Q.value = Q3;
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
		return this._i;
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
	 * 第一周波数 [Hz]
	 * @param {number=} value 周波数
	 * @param {number=} time 時刻
	 * @param {string=} type 変更の種類
	 * @return {AudioParam|FormantPatch} オーディオ・パラメーター／このパッチ
	 */
	/**~en
	 * First Frequency [Hz]
	 * @param {number=} value Frequency
	 * @param {number=} time Time
	 * @param {string=} type Type of changing
	 * @return {AudioParam|FormantPatch} Audio paramter, or this patch
	 */
	frequency1(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._f1.frequency;
		setParam(this._f1.frequency, value, time, type);
		return this;
	}

	/**~ja
	 * 第一Q値
	 * @param {number=} value Q値
	 * @param {number=} time 時刻
	 * @param {string=} type 変更の種類
	 * @return {AudioParam|FormantPatch} オーディオ・パラメーター／このパッチ
	 */
	/**~en
	 * First Q value
	 * @param {number=} value Q value
	 * @param {number=} time Time
	 * @param {string=} type Type of changing
	 * @return {AudioParam|FormantPatch} Audio paramter, or this patch
	 */
	Q1(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._f1.Q;
		setParam(this._f1.Q, value, time, type);
		return this;
	}

	/**~ja
	 * 第二周波数 [Hz]
	 * @param {number=} value 周波数
	 * @param {number=} time 時刻
	 * @param {string=} type 変更の種類
	 * @return {AudioParam|FormantPatch} オーディオ・パラメーター／このパッチ
	 */
	/**~en
	 * Second Frequency [Hz]
	 * @param {number=} value Frequency
	 * @param {number=} time Time
	 * @param {string=} type Type of changing
	 * @return {AudioParam|FormantPatch} Audio paramter, or this patch
	 */
	frequency2(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._f2.frequency;
		setParam(this._f2.frequency, value, time, type);
		return this;
	}

	/**~ja
	 * 第二Q値
	 * @param {number=} value Q値
	 * @param {number=} time 時刻
	 * @param {string=} type 変更の種類
	 * @return {AudioParam|FormantPatch} オーディオ・パラメーター／このパッチ
	 */
	/**~en
	 * Second Q value
	 * @param {number=} value Q value
	 * @param {number=} time Time
	 * @param {string=} type Type of changing
	 * @return {AudioParam|FormantPatch} Audio paramter, or this patch
	 */
	Q2(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._f2.Q;
		setParam(this._f2.Q, value, time, type);
		return this;
	}

	/**~ja
	 * 第三周波数 [Hz]
	 * @param {number=} value 周波数
	 * @param {number=} time 時刻
	 * @param {string=} type 変更の種類
	 * @return {AudioParam|FormantPatch} オーディオ・パラメーター／このパッチ
	 */
	/**~en
	 * Third Frequency [Hz]
	 * @param {number=} value Frequency
	 * @param {number=} time Time
	 * @param {string=} type Type of changing
	 * @return {AudioParam|FormantPatch} Audio paramter, or this patch
	 */
	frequency3(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._f3.frequency;
		setParam(this._f3.frequency, value, time, type);
		return this;
	}

	/**~ja
	 * 第三Q値
	 * @param {number=} value Q値
	 * @param {number=} time 時刻
	 * @param {string=} type 変更の種類
	 * @return {AudioParam|FormantPatch} オーディオ・パラメーター／このパッチ
	 */
	/**~en
	 * Third Q value
	 * @param {number=} value Q value
	 * @param {number=} time Time
	 * @param {string=} type Type of changing
	 * @return {AudioParam|FormantPatch} Audio paramter, or this patch
	 */
	Q3(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._f3.Q;
		setParam(this._f3.Q, value, time, type);
		return this;
	}

}

assignAlias(FormantPatch);