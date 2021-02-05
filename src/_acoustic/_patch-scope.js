/**~ja
 * スコープ・パッチ
 * @extends {Patch}
 * @version 2021-01-29
 */
/**~en
 * Scope patch
 * @extends {Patch}
 * @version 2021-01-29
 */
class ScopePatch extends Patch {

	/**~ja
	 * スコープ・パッチを作る
	 * @constructor
	 * @param {Synth} synth シンセ
	 * @param {object} params パラメーター
	 */
	/**~en
	 * Make a scope patch
	 * @constructor
	 * @param {Synth} synth Synth
	 * @param {object} params Parameters
	 */
	constructor(synth, { widget = null, isSynchronized = true, smoothingTimeConstant = 0.9 }) {
		super(synth);

		this._g = this._synth.context().createGain();
		const a = this._createAnalyser(widget);
		this._g.connect(a);

		widget.setSynchronized(isSynchronized);
		a.smoothingTimeConstant = smoothingTimeConstant;
	}

	/**~ja
	 * アナライザーを作る（ライブラリ内だけで使用）
	 * @param {object} widget ウィジェット
	 * @private
	 */
	/**~en
	 * Create an analyser (used only in the library)
	 * @param {object} widget Widget
	 * @private
	 */
	_createAnalyser(widget) {
		for (const wap of ScopePatch._WIDGET_ANALYSER_PAIRS) {
			if (wap[0] === widget) {
				return wap[1];
			}
		}
		const a = this._synth.context().createAnalyser();
		ScopePatch._WIDGET_ANALYSER_PAIRS.push([widget, a]);
		widget.setDataSource(new DataSource(a));
		return a;
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
	 * スムージング時間定数
	 * @param {number=} value 定数
	 * @return {number|ScopePatch} 定数／このパッチ
	 */
	/**~en
	 * Smoothing time constant
	 * @param {number=} value Constant
	 * @return {number|ScopePatch} Constant, or this patch
	 */
	smoothingTimeConstant(value = null) {
		if (!value) return this._a.smoothingTimeConstant;
		this._a.smoothingTimeConstant = value;
		return this;
	}

}
ScopePatch._WIDGET_ANALYSER_PAIRS = [];

assignAlias(ScopePatch);

/**~ja
 * データ・ソース（ライブラリ内だけで使用）
 * @private
 * @version 2020-12-08
 */
/**~en
 * Data source (used only in the library)
 * @private
 * @version 2020-12-08
 */
class DataSource {

	constructor(a) {
		this._a = a;
	}

	size() {
		return this._a.fftSize;
	}

	sampleRate() {
		return this._a.context.sampleRate;
	}

	getTimeDomainData(ret) {
		this._a.getByteTimeDomainData(ret);
	}

	getFrequencyData(ret) {
		this._a.getByteFrequencyData(ret);
	}

	minDecibels() {
		return this._a.minDecibels;
	}

	maxDecibels() {
		return this._a.maxDecibels;
	}

}