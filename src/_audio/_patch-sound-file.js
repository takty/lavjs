/**~ja
 * 音声ファイル・パッチ
 * @version 2020-12-04
 */
/**~en
 * Sound file patch
 * @version 2020-12-04
 */
class SoundFilePatch extends SourcePatch {

	constructor(synth, params) {
		super(synth);
		this._buffer = null;
		if (params.url) this._fetchData(params.url);

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

	async _fetchData(url) {
		try {
			const res = await fetch(url);
			const buf = await res.arrayBuffer();
			this._buffer = await this._synth.context().decodeAudioData(buf);
		} catch (e) {
			console.error('SoundFilePatch: error');
		}
	}

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

	stop(time = this._synth.now()) {
		if (!this._s) return;
		super.stop(time);
		this._s.stop(time);
	}


	// -------------------------------------------------------------------------


	playbackRate(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._s.playbackRate;
		setParam(this._s.playbackRate, value, time, type);
		this._playbackRate = value;
		return this;
	}

	detune(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._s.detune;
		setParam(this._s.detune, value, time, type);
		this._detune = value;
		return this;
	}

	gain(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._g.gain;
		setParam(this._g.gain, value, time, type);
		return this;
	}

}

assignAlias(SoundFilePatch);