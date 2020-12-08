/**~ja
 * マイク・パッチ
 * @extends {SourcePatch}
 * @version 2020-12-08
 */
/**~en
 * Microphone patch
 * @extends {SourcePatch}
 * @version 2020-12-08
 */
class MicrophonePatch extends SourcePatch {

	/**~ja
	 * マイク・パッチを作る
	 * @param {Synth} synth シンセ
	 * @param {object} params パラメーター
	 */
	/**~en
	 * Make a microphone patch
	 * @param {Synth} synth Synth
	 * @param {object} params Parameters
	 */
	constructor(synth, params) {
		super(synth);

		this._f = this._synth.context().createBiquadFilter();
		this._g = this._synth.context().createGain();
		this._f.connect(this._g).connect(this._sw);

		navigator.getUserMedia({ audio: true, video: false }, (stream) => {
			this._m = this._synth.context().createMediaStreamSource(stream);
			this._m.connect(this._f);
		}, () => {});

		this._f.type            = params.filterType ?? 'notch';
		this._f.Q.value         = params.Q          ?? 12;
		this._f.frequency.value = params.frequency  ?? 0;
		this._g.gain.value      = params.gain       ?? 10;
	}


	// -------------------------------------------------------------------------


	/**~ja
	 * 周波数 [Hz]
	 * @param {number=} value 周波数
	 * @param {number=} time 時刻
	 * @param {string=} type 変更の種類
	 * @return {AudioParam|MicrophonePatch} オーディオ・パラメーター／このパッチ
	 */
	/**~en
	 * Frequency [Hz]
	 * @param {number=} value Frequency
	 * @param {number=} time Time
	 * @param {string=} type Type of changing
	 * @return {AudioParam|MicrophonePatch} Audio paramter, or this patch
	 */
	frequency(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._o.frequency;
		setParam(this._o.frequency, value, time, type);
		return this;
	}

	/**~ja
	 * Q値
	 * @param {number=} value Q値
	 * @param {number=} time 時刻
	 * @param {string=} type 変更の種類
	 * @return {AudioParam|MicrophonePatch} オーディオ・パラメーター／このパッチ
	 */
	/**~en
	 * Q value
	 * @param {number=} value Q value
	 * @param {number=} time Time
	 * @param {string=} type Type of changing
	 * @return {AudioParam|MicrophonePatch} Audio paramter, or this patch
	 */
	Q(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._o.Q;
		setParam(this._o.Q, value, time, type);
		return this;
	}

	/**~ja
	 * ゲイン
	 * @param {number=} value ゲイン
	 * @param {number=} time 時刻
	 * @param {string=} type 変更の種類
	 * @return {AudioParam|MicrophonePatch} オーディオ・パラメーター／このパッチ
	 */
	/**~en
	 * Gain
	 * @param {number=} value Gain
	 * @param {number=} time Time
	 * @param {string=} type Type of changing
	 * @return {AudioParam|MicrophonePatch} Audio paramter, or this patch
	 */
	gain(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._g.gain;
		setParam(this._g.gain, value, time, type);
		return this;
	}

}

assignAlias(MicrophonePatch);