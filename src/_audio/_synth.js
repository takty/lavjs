/**~ja
 * シンセ
 * @version 2020-12-08
 */
/**~en
 * Synth
 * @version 2020-12-08
 */
class Synth {

	constructor() {
		this._context = new AudioContext();
		this._patches = [];
		this._sources = [];
	}

	/**~ja
	 * オーディオ・コンテキストを返す
	 * @return {AudioContext} オーディオ・コンテキスト
	 */
	/**~en
	 * Get the audio context
	 * @return {AudioContext} Audio context
	 */
	context() {
		return this._context;
	}

	/**~ja
	 * 現在の時刻を返す
	 * @return {number} 時刻
	 */
	/**~en
	 * Get the current time
	 * @return {number} Time
	 */
	now() {
		return this._context.currentTime;
	}

	/**~ja
	 * スピーカーを返す
	 * @param {object} params パラメーター
	 * @return {SpeakerPatch} スピーカー・パッチ
	 */
	/**~en
	 * Get the speaker
	 * @param {object} params Parameters
	 * @return {SpeakerPatch} The speaker patch
	 */
	speaker(params = {}) {
		if (!this._speaker) {
			this._speaker = new PATCH.SpeakerPatch(this, params);
			this._patches.push(this._speaker);
		}
		return this._speaker;
	}

	/**~ja
	 * 各種パッチを作る
	 * @param {string} type パッチの種類
	 * @param {object} params パラメーター
	 * @return {?Patch} パッチ
	 */
	/**~en
	 * Make various patches
	 * @param {string} type Type of a patch
	 * @param {object} params Parameters
	 * @return {?Patch} A patch
	 */
	make(type, params = {}) {
		const p = PATCH.Patch.make(this, type, params);
		this._patches.push(p);
		if (p instanceof PATCH.SourcePatch) {
			this._sources.push(p);
		}
		return p;
	}

	/**~ja
	 * パッチを繋げる
	 * @param {Patch[]} ps パッチ
	 */
	/**~en
	 * Connect patches
	 * @param {Patch[]} ps Patches
	 */
	connect(...ps) {
		let lp = null;
		for (let p of ps) {
			p = Array.isArray(p) ? p : [p];
			if (lp) {
				for (const j of lp) {
					for (const i of p) j.getOutput().connect(i.getInput());
				}
			}
			lp = p;
		}
	}

	/**~ja
	 * 再生する
	 * @param {number=} time 時刻
	 */
	/**~en
	 * Play
	 * @param {number=} time Time
	 */
	play(time = this._context.currentTime) {
		for (const p of this._sources) {
			p.play(time);
		}
	}

	/**~ja
	 * 停止する
	 * @param {number=} time 時刻
	 */
	/**~en
	 * Stop
	 * @param {number=} time Time
	 */
	stop(time = this._context.currentTime) {
		for (const p of this._sources) {
			p.stop(time);
		}
	}

}