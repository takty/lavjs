/**~ja
 * ノイズ・パッチ
 * @version 2020-12-03
 */
/**~en
 * Noise patch
 * @version 2020-12-03
 */
class NoisePatch extends SourcePatch {

	constructor(synth, params) {
		super(synth);

		this._p = this._synth.context().createScriptProcessor(NoisePatch.BUFFER_SIZE, 0, 1);
		this._p.onaudioprocess = (e) => { this._process(e); };
		this._sw = this._synth.context().createGain();
		this._g = this._synth.context().createGain();
		this._p.connect(this._sw).connect(this._g);

		this._sw.gain.value = 0;
		this._g.gain.value  = params.gain ?? 0.5;
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

	set(key, val, time) {
		key = Patch._NORM_LIST[key] ?? key;
		val = Patch._NORM_LIST[val] ?? val;
		time ??= this._synth.now();
		switch (key) {
			case 'gain': this._g.gain.setValueAtTime(val, time); break;
		}
	}

	start(time) {
		time ??= this._synth.now();
		setValueAtTime(this._sw.gain, 1, time);
	}

	stop(time) {
		time ??= this._synth.now();
		setValueAtTime(this._sw.gain, 0, time);
	}

}

NoisePatch.BUFFER_SIZE = 2048;