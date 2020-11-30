// 音声ファイル・パッチ


class SoundFilePatch extends SourcePatch {

	constructor(synth, params) {
		super();
		this._synth = synth;
		this._startedNodes = [];

		this._begin        = params.begin        ?? 0;
		this._end          = params.end          ?? 0;
		this._soundFile    = params.soundFile    ?? null;
		this._loop         = params.loop         ?? false;
		this._loopStart    = params.loopStart    ?? 0;
		this._loopEnd      = params.loopEnd      ?? 0;
		this._detune       = params.detune       ?? 0;
		this._playbackRate = params.playbackRate ?? 1;

		if (this._soundFile) {
			this._soundFile.getBuffer((audioBuf) => {
				this._buffer = audioBuf;
			});
		}
		this._g = this._synth.context().createGain();
		this._g.gain.value = params.gain ?? 1;
	}

	_createNode() {
		const s = this._synth.context().createBufferSource();
		if (this._buffer) s.buffer = this._buffer;

		s.loop      = this._loop;
		s.loopStart = this._loopStart;
		s.loopEnd   = (this._buffer) ? this._buffer.duration : this._loopEnd;

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
		switch (key) {
			case 'detune'      : for (const s of this._startedNodes) s.detune.value       = val; break;
			case 'playbackRate': for (const s of this._startedNodes) s.playbackRate.value = val; break;
			case 'gain'        : this._g.gain.value = val; break;
		}
	}

	start(time) {
		const s = this._createNode();
		s.start(time, this._begin, this._end || this._buffer.duration);
	}

	stop(time) {
		for (const s of this._startedNodes) s.stop(time);
	}

}

class SoundFile {

	constructor(synth, url) {
		this._synth = synth;
		this._url = url;
		_fetch(this._url);
	}

	getBuffer() {
		return this._audioData;
	}

	async _fetch() {
		try {
			const res = await fetch(this._url);
			console.log('SoundFile - loaded');
			const buf = await res.arrayBuffer();
			const ad = await this._synth.context().decodeAudioData(buf);
			console.log('SoundFile - decoded');
			this._audioData = ad;
		} catch (e) {
			console.log('SoundFile - error');
		}
	}
}