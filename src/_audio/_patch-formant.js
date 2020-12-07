/**~ja
 * フォルマント・パッチ
 * @extends {Patch}
 * @version 2020-12-07
 */
/**~en
 * Formant patch
 * @extends {Patch}
 * @version 2020-12-07
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
	constructor(synth, params) {
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

		this._f1.type = 'bandpass';
		this._f2.type = 'bandpass';
		this._f3.type = 'bandpass';
		this._f1.frequency.value = params.frequency1 ?? 700;
		this._f2.frequency.value = params.frequency2 ?? 1200;
		this._f3.frequency.value = params.frequency3 ?? 2900;
		this._f1.Q.value = params.Q1 ?? 32;
		this._f2.Q.value = params.Q2 ?? 32;
		this._f3.Q.value = params.Q3 ?? 32;
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


	frequency1(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._f1.frequency;
		setParam(this._f1.frequency, value, time, type);
		return this;
	}

	Q1(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._f1.Q;
		setParam(this._f1.Q, value, time, type);
		return this;
	}

	frequency2(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._f2.frequency;
		setParam(this._f2.frequency, value, time, type);
		return this;
	}

	Q2(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._f2.Q;
		setParam(this._f2.Q, value, time, type);
		return this;
	}

	frequency3(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._f3.frequency;
		setParam(this._f3.frequency, value, time, type);
		return this;
	}

	Q3(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._f3.Q;
		setParam(this._f3.Q, value, time, type);
		return this;
	}

}

assignAlias(FormantPatch);