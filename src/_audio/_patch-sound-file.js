/**~ja
 * 音声ファイル・パッチ
 * @extends {SourcePatch}
 * @version 2020-12-08
 */
/**~en
 * Sound file patch
 * @extends {SourcePatch}
 * @version 2020-12-08
 */
class SoundFilePatch extends SourcePatch {

	/**~ja
	 * 音声ファイル・パッチを作る
	 * @param {Synth} synth シンセ
	 * @param {object} params パラメーター
	 */
	/**~en
	 * Make a sound file patch
	 * @param {Synth} synth Synth
	 * @param {object} params Parameters
	 */
	constructor(synth, params) {
		super(synth);
		this._buffer = null;
		if (params.url) this.loadFile(params.url);

		this._loop         = params.loop  ?? false;
		this._start        = params.start ?? 0;
		this._end          = params.end   ?? 0;
		this._detune       = params.detune       ?? 0;
		this._playbackRate = params.playbackRate ?? 1;

		this._s = null;
		this._g = this._synth.context().createGain();
		this._g.connect(this._sw);

		this._g.gain.value = params.gain ?? 1;
	}

	/**~ja
	 * 音声ファイルを読み込む
	 * @param {string} url ファイルのURL
	 */
	/**~en
	 * Load a sound file
	 * @param {string} url File URL
	 */
	async loadFile(url) {
		try {
			const res = await fetch(url);
			const buf = await res.arrayBuffer();
			this._buffer = await this._synth.context().decodeAudioData(buf);
		} catch (e) {
			console.error('SoundFilePatch: error');
		}
	}

	/**~ja
	 * オーディオ・ノードを実際に作る（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Actually create an audio node (used only in the library)
	 * @private
	 */
	_createNode() {
		const s = this._synth.context().createBufferSource();
		if (this._buffer) s.buffer = this._buffer;

		s.loop      = this._loop;
		s.loopStart = this._start;
		s.loopEnd   = (!this._end && this._buffer) ? this._buffer.duration : this._end;

		s.detune.value       = this._detune;
		s.playbackRate.value = this._playbackRate;

		s.connect(this._g);
		s.onended = () => {
			if (!this._s) return;
			this._s.disconnect(this._g);
			this._s = null;
		};
		this._s = s;
	}

	/**~ja
	 * 再生する
	 * @param {number=} time 時刻
	 */
	/**~en
	 * Play
	 * @param {number=} time Time
	 */
	play(time = this._synth.now()) {
		if (this._s) return;
		this._createNode();
		if (this._loop) {
			this._s.start(time);
		} else {
			this._s.start(time, this._start, this._end);
		}
		super.play(time);
	}

	/**~ja
	 * 停止する
	 * @param {number=} time 時刻
	 */
	/**~en
	 * Stop
	 * @param {number=} time Time
	 */
	stop(time = this._synth.now()) {
		if (!this._s) return;
		super.stop(time);
		this._s.stop(time);
	}


	// -------------------------------------------------------------------------


	/**~ja
	 * 再生レート
	 * @param {number=} value 再生レート（スピード）
	 * @param {number=} time 時刻
	 * @param {string=} type 変更の種類
	 * @return {AudioParam|SoundFilePatch} オーディオ・パラメーター／このパッチ
	 */
	/**~en
	 * Playback rate
	 * @param {number=} value Playback rate (speed)
	 * @param {number=} time Time
	 * @param {string=} type Type of changing
	 * @return {AudioParam|SoundFilePatch} Audio paramter, or this patch
	 */
	playbackRate(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._s.playbackRate;
		setParam(this._s.playbackRate, value, time, type);
		this._playbackRate = value;
		return this;
	}

	/**~ja
	 * 振動の離調 [セント]
	 * @param {number=} value 離調
	 * @param {number=} time 時刻
	 * @param {string=} type 変更の種類
	 * @return {AudioParam|SoundFilePatch} オーディオ・パラメーター／このパッチ
	 */
	/**~en
	 * Detune [cent]
	 * @param {number=} value Detune
	 * @param {number=} time Time
	 * @param {string=} type Type of changing
	 * @return {AudioParam|SoundFilePatch} Audio paramter, or this patch
	 */
	detune(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._s.detune;
		setParam(this._s.detune, value, time, type);
		this._detune = value;
		return this;
	}

	/**~ja
	 * ゲイン
	 * @param {number=} value ゲイン
	 * @param {number=} time 時刻
	 * @param {string=} type 変更の種類
	 * @return {AudioParam|SoundFilePatch} オーディオ・パラメーター／このパッチ
	 */
	/**~en
	 * Gain
	 * @param {number=} value Gain
	 * @param {number=} time Time
	 * @param {string=} type Type of changing
	 * @return {AudioParam|SoundFilePatch} Audio paramter, or this patch
	 */
	gain(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._g.gain;
		setParam(this._g.gain, value, time, type);
		return this;
	}

}

assignAlias(SoundFilePatch);