/**~ja
 * 音声ファイル・パッチ
 * @version 2020-12-02
 */
/**~en
 * Sound file patch
 * @version 2020-12-02
 */
class SoundFilePatch extends SourcePatch {

	constructor(synth, params) {
		super();
		this._synth = synth;
		this._startedNodes = [];

		this._loop         = params.loop         ?? false;
		this._start        = params.start        ?? 0;
		this._end          = params.end          ?? 0;
		this._detune       = params.detune       ?? 0;
		this._playbackRate = params.playbackRate ?? 1;

		this._buffer = null;
		if (params.url) this._fetch(params.url);

		this._g = this._synth.context().createGain();
		this._g.gain.value = params.gain ?? 1;
	}

	async _fetch(url) {
		try {
			const res = await fetch(url);
			const buf = await res.arrayBuffer();
			const ad = await this._synth.context().decodeAudioData(buf);
			this._buffer = ad;
		} catch (e) {
			console.log('SoundFile - error');
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
			const idx = this._startedNodes.indexOf(s);
			if (idx !== -1) this._startedNodes.splice(idx, 1);
		};
		this._startedNodes.push(s);
		return s;
	}

	getInput(key = null) {
		switch (key) {
			case 'gain': return this._g.gain;
		}
	}

	getOutput(key = null) {
		return this._g;
	}

	set(key, val) {
		key = Patch._NORM_LIST[key] ?? key;
		val = Patch._NORM_LIST[val] ?? val;
		switch (key) {
			case 'url'         : return this._fetch(url);
			case 'loop'        : this._loop = val; break;
			case 'start'       : this._start = val; break;
			case 'end'         : this._end = val; break;
			case 'detune'      : for (const s of this._startedNodes) s.detune.value       = val; break;
			case 'playbackRate': for (const s of this._startedNodes) s.playbackRate.value = val; break;
			case 'gain'        : this._g.gain.value = val; break;
		}
	}

	start(time) {
		const s = this._createNode();
		if (this._loop) {
			s.start(time);
		} else {
			s.start(time, s.loopStart, s.loopEnd);
		}
	}

	stop(time) {
		for (const s of this._startedNodes) s.stop(time);
	}

}