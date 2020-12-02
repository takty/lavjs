/**~ja
 * パッチ・ベース
 * @version 2020-12-02
 */
/**~en
 * Patch base
 * @version 2020-12-02
 */
class Patch {

	static make(synth, params) {
		params = Patch._normalizeParams(params);
		const t = params.type ?? '';

		switch (t) {
			case 'sine': case 'triangle': case 'sawtooth': case 'square':
			case 'oscillator': return new PATCH.OscillatorPatch(synth, params);
			case 'microphone': return new PATCH.MicrophonePatch(synth, params);
			case 'noise'     : return new PATCH.NoisePatch(synth, params);
			case 'file'      : return new PATCH.SoundFilePatch(synth, params);

			case 'lowpass': case 'highpass': case 'bandpass': case 'lowshelf': case 'highshelf': case 'peaking': case 'notch': case 'allpass':
			case 'biquad'   : return new PATCH.BiquadFilterPatch(synth, params);
			case 'formant'  : return new PATCH.FormantPatch(synth, params);

			case 'spectrum': case 'waveform':
			case 'scope'   : return new PATCH.ScopePatch(synth, params);
		}
		throw `Cannot make '${t}' patch!`;
	}

	static _normalizeParams(params) {
		const ret = {};
		for (const [key, val] of Object.entries(params)) {
			const k = Patch._NORM_LIST[key] ?? key;
			const v = Patch._NORM_LIST[val] ?? val;
			ret[k] = v;
		}
		return ret;
	}

	getKnob(key, type, params) {
		type = Patch._NORM_LIST[type] ?? type;
		params = Patch._normalizeParams(params);
		const ap = this.getInput(key);
		switch (type) {
			case 'gain': return GainKnob(ap, params);
			case 'envelope': return EnvelopKnob(ap, params);
		}
	}

}

// キー文字列正規化リスト
Patch._NORM_LIST = {
	osc: 'oscillator',
	mic: 'microphone',
	sin: 'sine',
	tri: 'triangle',
	saw: 'sawtooth',
	sq: 'square',
	const: 'constant',
	exp: 'exponential',
	lpf: 'lowpass',
	hpf: 'highpass',
	bpf: 'bandpass',
	wave: 'waveform',
	spec: 'spectrum',
	freq: 'frequency',
	env: 'envelope',

	amp: 'gain',
};

class SourcePatch extends Patch {

	start(time) {}

	stop(time) {}

}