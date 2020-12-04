/**~ja
 * ノイズ・パッチ
 * @version 2020-12-04
 */
/**~en
 * Noise patch
 * @version 2020-12-04
 */
class NoisePatch extends SourcePatch {

	constructor(synth, params) {
		super(synth);

		this._p = this._synth.context().createScriptProcessor(NoisePatch.BUFFER_SIZE, 0, 1);
		this._p.onaudioprocess = (e) => { this._process(e); };
		this._g = this._synth.context().createGain();
		this._p.connect(this._g).connect(this._sw);

		this._g.gain.value = params.gain ?? 1;
	}

	_process(e) {
		const output = e.outputBuffer.getChannelData(0);
		for (let i = 0; i < NoisePatch.BUFFER_SIZE; i += 1) {
			output[i] = 2 * (Math.random() - 0.5);
		}
	}


	// -------------------------------------------------------------------------


	gain(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._g.gain;
		setParam(this._g.gain, value, time, type);
		return this;
	}

}

NoisePatch.BUFFER_SIZE = 2048;

assignAlias(NoisePatch);