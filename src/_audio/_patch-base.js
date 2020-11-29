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
			case 'oscillator':
				return new PATCH.OscillatorPatch(synth, { type: 'sine', ...params });
			case 'sine':
			case 'triangle':
			case 'sawtooth':
			case 'square':
				return new PATCH.OscillatorPatch(synth, { type: t, ...params });
			case 'microphone':
				return new PATCH.MicrophonePatch(synth, params);
			case 'noise':
				return new PATCH.NoisePatch(synth, params);
			case 'file':
				return new PATCH.SoundFilePatch(synth, params);
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

	_setVal(key, val) {
		if (typeof val === 'number' || typeof val === 'string' || typeof val === 'boolean') {
			if (this[key] === undefined) throw `Parameter name '${key}' is wrong!`;
			this[key] = val;
		} else if (val.output !== undefined) {
			val.plug(this._getTarget(key));
		}
	}

	set(ps_key, undef_val = null) {
		if (undef_val === null) {
			for (const [key, val] of Object.entries(ps_key)) this._setVal(key, val);
		} else {
			this._setVal(ps_key, undef_val);
		}
		this._update();
		return this;
	}

	plug(target, opt_param) {
		this._targets.push(target._getTarget(opt_param));
		return target;
	}

	unplug() {
		this._targets.length = 0;
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