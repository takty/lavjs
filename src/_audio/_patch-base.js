/**~ja
 * パッチ・ベース
 * @version 2020-11-29
 */
/**~en
 * Patch base
 * @version 2020-11-29
 */
class Patch {

	static create(synth, type, params) {
		const t = NORM[type] ?? type;

		switch (t) {
			case 'sine':
			case 'triangle':
			case 'sawtooth':
			case 'square':
			case 'oscillator': return new PATCH.OscillatorPatch(synth, params);
			case 'microphone': return new PATCH.MicrophonePatch(synth, params);
			case 'noise'     : return new PATCH.NoisePatch(synth, params);
			case 'file'      : return new PATCH.SoundFilePatch(synth, params);

			
			case 'gain':
				return new PATCH.GainPatch(synth, par(params, 'type', 'constant'), params);
			case 'constant':
			case 'line':
			case 'exponential':
				return new PATCH.GainPatch(synth, t, params);
			case 'envelope':
				return new PATCH.EnvelopePatch(synth, params);
			case 'biquad':
				return new PATCH.BiquadFilterPatch(synth, par(params, 'type', 'lowpass'), params);
			case 'lowpass':
			case 'highpass':
			case 'bandpass':
			case 'lowshelf':
			case 'highshelf':
			case 'peaking':
			case 'notch':
			case 'allpass':
				return new PATCH.BiquadFilterPatch(synth, t, params);
			case 'formant':
				return new PATCH.FormantPatch(synth, params);
			case 'scope':
				return new PATCH.ScopePatch(synth, par(params, 'type', 'waveform'), params);
			case 'spectrum':
			case 'waveform':
				return new PATCH.ScopePatch(synth, t, params);
		}
		throw `Cannot make '${type}' patch!`;
	}

}

// キー文字列正規化リスト（ハッシュ作成用）
const NORM_LIST = [
	[['osc'], 'oscillator'],
	[['mic'], 'microphone'],
	[['sin'], 'sine'],
	[['tri'], 'triangle'],
	[['saw'], 'sawtooth'],
	[['sq'], 'square'],
	[['const'], 'constant'],
	[['exp'], 'exponential'],
	[['lpf'], 'lowpass'],
	[['hpf'], 'highpass'],
	[['bpf'], 'bandpass'],
	[['wave'], 'waveform'],
	[['spec'], 'spectrum'],
];

// キー文字列正規化ハッシュ
const NORM = (function () {
	const ret = {};
	for (const [keys, full] of NORM_LIST) {
		ret[full] = full;
		for (const key of keys) ret[key] = full;
	}
	return ret;
})();

class SourcePatch extends Patch {

	start(time) {
	}

	stop(time) {
	}

}