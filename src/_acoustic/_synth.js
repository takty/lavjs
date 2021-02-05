/**~ja
 * シンセ
 * @version 2021-02-05
 */
/**~en
 * Synth
 * @version 2021-02-05
 */
class Synth {

	/**~ja
	 * シンセを作る
	 * @constructor
	 */
	/**~en
	 * Make a synth
	 * @constructor
	 */
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
	time() {
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


	// -------------------------------------------------------------------------


	/**~ja
	 * オシレーター・パッチを作る
	 * @param {object} params パラメーター
	 * @return {OscillatorPatch} パッチ
	 */
	/**~en
	 * Make a oscillator patch
	 * @param {object} params Parameters
	 * @return {OscillatorPatch} A patch
	 */
	makeOscillator(params = {}) {
		params = PATCH.normalizeParams(params);
		const p = new PATCH.OscillatorPatch(this, params);
		return this._addPatch(p);
	}

	/**~ja
	 * ノイズ・パッチを作る
	 * @param {object} params パラメーター
	 * @return {NoisePatch} パッチ
	 */
	/**~en
	 * Make a noise patch
	 * @param {object} params Parameters
	 * @return {NoisePatch} A patch
	 */
	makeNoise(params = {}) {
		params = PATCH.normalizeParams(params);
		const p = new PATCH.NoisePatch(this, params);
		return this._addPatch(p);
	}

	/**~ja
	 * マイクロフォン・パッチを作る
	 * @param {object} params パラメーター
	 * @return {MicrophonePatch} パッチ
	 */
	/**~en
	 * Make a microphone patch
	 * @param {object} params Parameters
	 * @return {MicrophonePatch} A patch
	 */
	makeMicrophone(params = {}) {
		params = PATCH.normalizeParams(params);
		const p = new PATCH.MicrophonePatch(this, params);
		return this._addPatch(p);
	}

	/**~ja
	 * バッファー・ソース・パッチを作る
	 * @param {object} params パラメーター
	 * @return {BufferSourcePatch} パッチ
	 */
	/**~en
	 * Make a buffer source patch
	 * @param {object} params Parameters
	 * @return {BufferSourcePatch} A patch
	 */
	makeBufferSource(params = {}) {
		params = PATCH.normalizeParams(params);
		const p = new PATCH.BufferSourcePatch(this, params);
		return this._addPatch(p);
	}

	/**~ja
	 * ゲイン・パッチを作る
	 * @param {object} params パラメーター
	 * @return {GainPatch} パッチ
	 */
	/**~en
	 * Make a gain patch
	 * @param {object} params Parameters
	 * @return {GainPatch} A patch
	 */
	makeGain(params = {}) {
		params = PATCH.normalizeParams(params);
		const p = new PATCH.GainPatch(this, params);
		return this._addPatch(p);
	}

	/**~ja
	 * 二次フィルター・パッチを作る
	 * @param {object} params パラメーター
	 * @return {BiquadFilterPatch} パッチ
	 */
	/**~en
	 * Make a biquad filter patch
	 * @param {object} params Parameters
	 * @return {BiquadFilterPatch} A patch
	 */
	makeBiquadFilter(params = {}) {
		params = PATCH.normalizeParams(params);
		const p = new PATCH.BiquadFilterPatch(this, params);
		return this._addPatch(p);
	}

	/**~ja
	 * エンベロープ・パッチを作る
	 * @param {object} params パラメーター
	 * @return {EnvelopePatch} パッチ
	 */
	/**~en
	 * Make a envelope patch
	 * @param {object} params Parameters
	 * @return {EnvelopePatch} A patch
	 */
	makeEnvelope(params = {}) {
		params = PATCH.normalizeParams(params);
		const p = new PATCH.EnvelopePatch(this, params);
		return this._addPatch(p);
	}

	/**~ja
	 * スコープ・パッチを作る
	 * @param {object} params パラメーター
	 * @return {ScopePatch} パッチ
	 */
	/**~en
	 * Make a scope patch
	 * @param {object} params Parameters
	 * @return {ScopePatch} A patch
	 */
	makeScope(params = {}) {
		params = PATCH.normalizeParams(params);
		const p = new PATCH.ScopePatch(this, params);
		return this._addPatch(p);
	}

	/**~ja
	 * パッチを追加する（ライブラリ内だけで使用）
	 * @private
	 * @param {Patch} p パッチ
	 * @return {Patch} パッチ
	 */
	/**~en
	 *　Add a patch (used only in the library)
	 * @param {Patch} p Patch
	 * @return {Patch} A patch
	 */
	_addPatch(p) {
		this._patches.push(p);
		if (p instanceof PATCH.SourcePatch) {
			this._sources.push(p);
		}
		return p;
	}


	// -------------------------------------------------------------------------


	/**~ja
	 * パッチを繋げる
	 * @param {Patch[]} ps パッチ
	 * @return {Synth} このシンセ
	 */
	/**~en
	 * Connect patches
	 * @param {Patch[]} ps Patches
	 * @return {Synth} This synth
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
		return this;
	}

	/**~ja
	 * 再生する
	 * @param {number=} time 時刻 [s]
	 * @return {Synth} このシンセ
	 */
	/**~en
	 * Play
	 * @param {number=} time Time [s]
	 * @return {Synth} This synth
	 */
	play(time = this._context.currentTime) {
		for (const p of this._sources) {
			p.play(time);
		}
		return this;
	}

	/**~ja
	 * 停止する
	 * @param {number=} time 時刻 [s]
	 * @return {Synth} このシンセ
	 */
	/**~en
	 * Stop
	 * @param {number=} time Time [s]
	 * @return {Synth} This synth
	 */
	stop(time = this._context.currentTime) {
		for (const p of this._sources) {
			p.stop(time);
		}
		return this;
	}

}

assignAlias(Synth);