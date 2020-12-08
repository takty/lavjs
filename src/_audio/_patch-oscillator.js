/**~ja
 * オシレーター・パッチ
 * @extends {SourcePatch}
 * @version 2020-12-08
 */
/**~en
 * Oscillator patch
 * @extends {SourcePatch}
 * @version 2020-12-08
 */
class OscillatorPatch extends SourcePatch {

	/**~ja
	 * オシレーター・パッチを作る
	 * @param {Synth} synth シンセ
	 * @param {object} params パラメーター
	 */
	/**~en
	 * Make an oscillator patch
	 * @param {Synth} synth Synth
	 * @param {object} params Parameters
	 */
	constructor(synth, params) {
		super(synth);

		this._o = this._synth.context().createOscillator();
		this._g = this._synth.context().createGain();
		this._o.connect(this._g).connect(this._sw);

		this._o.type            = params.type      ?? 'sine';
		this._o.frequency.value = params.frequency ?? 440;
		this._o.detune.value    = params.detune    ?? 0;
		this._g.gain.value      = params.gain      ?? 1;
		this._o.start();
	}


	// -------------------------------------------------------------------------


	/**~ja
	 * 周波数 [Hz]
	 * @param {number=} value 周波数
	 * @param {number=} time 時刻
	 * @param {string=} type 変更の種類
	 * @return {AudioParam|OscillatorPatch} オーディオ・パラメーター／このパッチ
	 */
	/**~en
	 * Frequency [Hz]
	 * @param {number=} value Frequency
	 * @param {number=} time Time
	 * @param {string=} type Type of changing
	 * @return {AudioParam|OscillatorPatch} Audio paramter, or this patch
	 */
	frequency(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._o.frequency;
		setParam(this._o.frequency, value, time, type);
		return this;
	}

	/**~ja
	 * 振動の離調 [セント]
	 * @param {number=} value 離調
	 * @param {number=} time 時刻
	 * @param {string=} type 変更の種類
	 * @return {AudioParam|OscillatorPatch} オーディオ・パラメーター／このパッチ
	 */
	/**~en
	 * Detune [cent]
	 * @param {number=} value Detune
	 * @param {number=} time Time
	 * @param {string=} type Type of changing
	 * @return {AudioParam|OscillatorPatch} Audio paramter, or this patch
	 */
	detune(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._o.detune;
		setParam(this._o.detune, value, time, type);
		return this;
	}

	/**~ja
	 * ゲイン
	 * @param {number=} value ゲイン
	 * @param {number=} time 時刻
	 * @param {string=} type 変更の種類
	 * @return {AudioParam|OscillatorPatch} オーディオ・パラメーター／このパッチ
	 */
	/**~en
	 * Gain
	 * @param {number=} value Gain
	 * @param {number=} time Time
	 * @param {string=} type Type of changing
	 * @return {AudioParam|OscillatorPatch} Audio paramter, or this patch
	 */
	gain(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._g.gain;
		setParam(this._g.gain, value, time, type);
		return this;
	}

}

assignAlias(OscillatorPatch);