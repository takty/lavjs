/**~ja
 * ノイズ・パッチ
 * @extends {SourcePatch}
 * @version 2021-02-05
 */
/**~en
 * Noise patch
 * @extends {SourcePatch}
 * @version 2021-02-05
 */
class NoisePatch extends SourcePatch {

	/**~ja
	 * ノイズ・パッチを作る
	 * @constructor
	 * @param {Synth} synth シンセ
	 * @param {object} params パラメーター
	 */
	/**~en
	 * Make a noise patch
	 * @constructor
	 * @param {Synth} synth Synth
	 * @param {object} params Parameters
	 */
	constructor(synth, { gain = 1 }) {
		super(synth);

		this._p = this._synth.context().createScriptProcessor(NoisePatch.BUFFER_SIZE, 0, 1);
		this._p.onaudioprocess = (e) => { this._process(e); };
		this._g = this._synth.context().createGain();
		this._p.connect(this._g).connect(this._sw);

		this._g.gain.value = gain;
	}

	/**~ja
	 * オーディオ処理イベントに対応してノイズ・データを作成する（ライブラリ内だけで使用）
	 * @private
	 * @param {AudioProcessingEvent} e イベント
	 */
	/**~en
	 * Respond to audio processing events for making noise data (used only in the library)
	 * @private
	 * @param {AudioProcessingEvent} e Event
	 */
	_process(e) {
		const output = e.outputBuffer.getChannelData(0);
		for (let i = 0; i < NoisePatch.BUFFER_SIZE; i += 1) {
			output[i] = 2 * (Math.random() - 0.5);
		}
	}


	// -------------------------------------------------------------------------


	/**~ja
	 * ゲイン
	 * @param {number=} value ゲイン
	 * @param {number=} time 時刻
	 * @param {string=} type 変更の種類
	 * @return {AudioParam|NoisePatch} オーディオ・パラメーター／このパッチ
	 */
	/**~en
	 * Gain
	 * @param {number=} value Gain
	 * @param {number=} time Time
	 * @param {string=} type Type of changing
	 * @return {AudioParam|NoisePatch} Audio paramter, or this patch
	 */
	gain(value = null, time = this._synth.time(), type = null) {
		if (!value) return this._g.gain;
		setParam(this._g.gain, value, time, type);
		return this;
	}

}

NoisePatch.BUFFER_SIZE = 2048;

assignAlias(NoisePatch);