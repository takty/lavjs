/**~ja
 * パッチ・ベース
 * @version 2020-12-04
 */
/**~en
 * Patch base
 * @version 2020-12-04
 */
class Patch {

	static make(synth, type, params) {
		type = KEY_NORM_LIST[type] ?? type;
		params = normalizeParams(params);
		params.type = type;

		switch (type) {
			case 'sine': case 'triangle': case 'sawtooth': case 'square':
			case 'oscillator': return new PATCH.OscillatorPatch(synth, params);
			case 'microphone': return new PATCH.MicrophonePatch(synth, params);
			case 'noise'     : return new PATCH.NoisePatch(synth, params);
			case 'file'      : return new PATCH.SoundFilePatch(synth, params);

			case 'gain'      : return new PATCH.GainPatch(synth, params);
			case 'lowpass': case 'highpass': case 'bandpass': case 'lowshelf': case 'highshelf': case 'peaking': case 'notch': case 'allpass':
			case 'biquad'   : return new PATCH.BiquadFilterPatch(synth, params);
			case 'formant'  : return new PATCH.FormantPatch(synth, params);

			case 'spectrum': case 'waveform':
			case 'scope'   : return new PATCH.ScopePatch(synth, params);
			case 'envelope': return new PATCH.EnvelopePatch(synth, params);
		}
		throw `Cannot make '${type}' patch!`;
	}

	constructor(synth) {
		this._synth = synth;
	}

	connect(target) {
		if (target instanceof Patch) {
			this.getOutput().connect(target.getInput());
		} else if (target instanceof AudioParam) {
			this.getOutput().connect(target);
		}
	}

}