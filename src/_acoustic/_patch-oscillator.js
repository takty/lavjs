/**~ja
 * オシレーター・パッチ
 * @extends {SourcePatch}
 * @version 2021-05-21
 */
/**~en
 * Oscillator patch
 * @extends {SourcePatch}
 * @version 2021-05-21
 */
class OscillatorPatch extends SourcePatch {

	/**~ja
	 * オシレーター・パッチを作る
	 * @constructor
	 * @param {Synth} synth シンセ
	 * @param {object=} [params={}] パラメーター
	 */
	/**~en
	 * Make an oscillator patch
	 * @constructor
	 * @param {Synth} synth Synth
	 * @param {object=} [params={}] Parameters
	 */
	constructor(synth, params) {
		super(synth);
		const { type = 'sine', frequency = 440, detune = 0, gain = 1 } = params;

		this._o = this._synth.context().createOscillator();
		this._g = this._synth.context().createGain();
		this._o.connect(this._g).connect(this._sw);

		this._o.type            = type;
		this._o.frequency.value = frequency;
		this._o.detune.value    = detune;
		this._g.gain.value      = gain;
		this._o.start();
	}


	// -------------------------------------------------------------------------


	/**~ja
	 * 波形の種類
	 * @param {string=} value 波形の種類
	 * @return {string|OscillatorPatch} 波形の種類／このパッチ
	 */
	/**~en
	 * Waveform type
	 * @param {string=} value Waveform type
	 * @return {string|OscillatorPatch} Waveform type, or this patch
	 */
	type(value = null) {
		if (!value) return this._o.type;
		this._o.type = value;
		return this;
	}

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
	frequency(value = null, time = this._synth.time(), type = null) {
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
	detune(value = null, time = this._synth.time(), type = null) {
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
	gain(value = null, time = this._synth.time(), type = null) {
		if (!value) return this._g.gain;
		setParam(this._g.gain, value, time, type);
		return this;
	}

}

assignAlias(OscillatorPatch);