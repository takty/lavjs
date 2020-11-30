// ノイズ・パッチ


class NoisePatch extends SourcePatch {

	constructor(synth, params) {
		super();
		this._synth = synth;

		this._s = this._synth.context().createGain();
		this._g = this._synth.context().createGain();
		this._p = this._synth.context().createScriptProcessor(NoisePatch.BUFFER_SIZE, 0, 1);
		this._p.onaudioprocess = (e) => { this._process(e); };
		this._p.connect(this._s).connect(this._g);

		this._s.gain.value = 0;
		this._g.gain.value = params.gain ?? 0.5;
	}

	_process(e) {
		const output = e.outputBuffer.getChannelData(0);
		for (let i = 0; i < NoisePatch.BUFFER_SIZE; i += 1) {
			output[i] = 2 * (Math.random() - 0.5);
		}
	}

	getInput(key = null) {
		switch (key) {
			case 'gain': return this._g.gain;
		}
	}

	getOutput() {
		return this._g;
	}

	set(key, val) {
		switch (key) {
			case 'gain': this._g.gain.value = val; break;
		}
	}

	start(time) {
		this._s.setValueAtTime(1, time);
	}

	stop(time) {
		this._s.setValueAtTime(0, time);
	}

}

NoisePatch.BUFFER_SIZE = 2048;