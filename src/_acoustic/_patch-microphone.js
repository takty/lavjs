/**~ja
 * マイクロフォン・パッチ
 * @extends {SourcePatch}
 * @version 2021-05-21
 */
/**~en
 * Microphone patch
 * @extends {SourcePatch}
 * @version 2021-05-21
 */
class MicrophonePatch extends SourcePatch {

	/**~ja
	 * マイクロフォン・パッチを作る
	 * @constructor
	 * @param {Synth} synth シンセ
	 * @param {object=} [params={}] パラメーター
	 */
	/**~en
	 * Make a microphone patch
	 * @constructor
	 * @param {Synth} synth Synth
	 * @param {object=} [params={}] Parameters
	 */
	constructor(synth, params = {}) {
		super(synth);
		const { type = 'notch', Q = 12, frequency = 0, gain = 10 } = params;

		this._f = this._synth.context().createBiquadFilter();
		this._g = this._synth.context().createGain();
		this._f.connect(this._g).connect(this._sw);

		navigator.getUserMedia({ audio: true, video: false }, (stream) => {
			this._m = this._synth.context().createMediaStreamSource(stream);
			this._m.connect(this._f);
		}, () => {});

		this._f.type            = type;
		this._f.Q.value         = Q;
		this._f.frequency.value = frequency;
		this._g.gain.value      = gain;
	}


	// -------------------------------------------------------------------------


	/**~ja
	 * フィルターの種類
	 * @param {string=} value フィルターの種類
	 * @return {string|MicrophonePatch} フィルターの種類／このパッチ
	 */
	/**~en
	 * Filter type
	 * @param {string=} value Filter type
	 * @return {string|MicrophonePatch} Filter type, or this patch
	 */
	type(value = null) {
		if (!value) return this._f.type;
		this._f.type = value;
		return this;
	}

	/**~ja
	 * フィルターの周波数 [Hz]
	 * @param {number=} value フィルターの周波数
	 * @param {number=} time 時刻
	 * @param {string=} type 変更の種類
	 * @return {AudioParam|MicrophonePatch} オーディオ・パラメーター／このパッチ
	 */
	/**~en
	 * Filter frequency [Hz]
	 * @param {number=} value Filter frequency
	 * @param {number=} time Time
	 * @param {string=} type Type of changing
	 * @return {AudioParam|MicrophonePatch} Audio paramter, or this patch
	 */
	frequency(value = null, time = this._synth.time(), type = null) {
		if (!value) return this._o.frequency;
		setParam(this._o.frequency, value, time, type);
		return this;
	}

	/**~ja
	 * フィルターのQ値
	 * @param {number=} value フィルターのQ値
	 * @param {number=} time 時刻
	 * @param {string=} type 変更の種類
	 * @return {AudioParam|MicrophonePatch} オーディオ・パラメーター／このパッチ
	 */
	/**~en
	 * Filter Q value
	 * @param {number=} value Filter Q value
	 * @param {number=} time Time
	 * @param {string=} type Type of changing
	 * @return {AudioParam|MicrophonePatch} Audio paramter, or this patch
	 */
	Q(value = null, time = this._synth.time(), type = null) {
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
	gain(value = null, time = this._synth.time(), type = null) {
		if (!value) return this._g.gain;
		setParam(this._g.gain, value, time, type);
		return this;
	}

}

assignAlias(MicrophonePatch);