/**~ja
 * パッチ・ライブラリー（PATCH）
 *
 * 音を鳴らすための部品を作るライブラリです。
 *
 * @author Takuto Yanagida
 * @version 2020-12-04
 */


/**~ja
 * ライブラリ変数
 */
/**~en
 * Library variable
 */
const PATCH = (function () {

	'use strict';


	//~ja ライブラリ中だけで使用するユーティリティ --------------------------------
	//~en Utilities used only in the library --------------------------------------


	// キー文字列正規化リスト
	const KEY_NORM_LIST = {
		osc  : 'oscillator',
		mic  : 'microphone',
		sin  : 'sine',
		tri  : 'triangle',
		saw  : 'sawtooth',
		sq   : 'square',
		const: 'constant',
		line : 'linear',
		exp  : 'exponential',
		lpf  : 'lowpass',
		hpf  : 'highpass',
		bpf  : 'bandpass',
		wave : 'waveform',
		spec : 'spectrum',
		freq : 'frequency',
		freq1: 'frequency1',
		freq2: 'frequency2',
		freq3: 'frequency3',
		env  : 'envelope',
		dur  : 'duration',
		amp  : 'gain',
	};

	function assignAlias(cls) {
		for (const [alias, orig] of Object.entries(KEY_NORM_LIST)) {
			if (cls.prototype[orig]) {
				cls.prototype[alias] = cls.prototype[orig];
			}
		}
	}

	function normalizeParams(params) {
		const ret = {};
		for (const [key, val] of Object.entries(params)) {
			const k = KEY_NORM_LIST[key] ?? key;
			const v = KEY_NORM_LIST[val] ?? val;
			ret[k] = v;
		}
		return ret;
	}

	/**~ja
	 * 最小値
	 */
	/**~en
	 * Minimum value
	 */
	const DELAY = 0.001;

	function cancelAndHoldAtTime(param, time) {
		if (param.cancelAndHoldAtTime) {
			param.cancelAndHoldAtTime(time);
		} else {
			const val = param.value;
			param.cancelScheduledValues(time);
			param.setValueAtTime(val, time);
		}
	}

	function setParam(param, value, time, type) {
		switch (KEY_NORM_LIST[type] ?? type) {
			case 'linear':
				cancelAndHoldAtTime(param, time);
				param.linearRampToValueAtTime(value, time);
				break;
			case 'exponential':
				cancelAndHoldAtTime(param, time);
				param.exponentialRampToValueAtTime(value, time);
				break;
			default:
				cancelAndHoldAtTime(param, time);
				param.setTargetAtTime(value, time, DELAY);
				break;
		}
	}


	//~ja パッチ -----------------------------------------------------------------
	//~ja Patch --------------------------------------------------------------


	//=
	//=include _audio/_patch-base.js


	//=
	//=include _audio/_patch-source.js


	//=
	//=include _audio/_patch-oscillator.js


	//=
	//=include _audio/_patch-microphone.js


	//=
	//=include _audio/_patch-sound-file.js


	//=
	//=include _audio/_patch-noise.js


	//=
	//=include _audio/_patch-gain.js


	//=
	//=include _audio/_patch-biquad-filter.js


	//=
	//=include _audio/_patch-formant.js


	//=
	//=include _audio/_patch-scope.js


	//=
	//=include _audio/_patch-speaker.js


	//=
	//=include _audio/_patch-envelope.js


	//~ja ライブラリを作る --------------------------------------------------------
	//~en Create a library --------------------------------------------------------


	return {
		Patch,
		SourcePatch,

		OscillatorPatch,
		MicrophonePatch,
		SoundFilePatch,
		NoisePatch,

		GainPatch,
		BiquadFilterPatch,
		FormantPatch,

		ScopePatch,
		SpeakerPatch,
		EnvelopePatch,
	};

})();
