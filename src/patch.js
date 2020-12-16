/**~ja
 * パッチ・ライブラリー（PATCH）
 *
 * 音を鳴らすための部品を作るライブラリです。
 *
 * @author Takuto Yanagida
 * @version 2020-12-16
 */
/**~en
 * Patch library (PATCH)
 *
 * A library for making parts for playing sounds.
 *
 * @author Takuto Yanagida
 * @version 2020-12-16
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


	//~ja キー文字列正規化リスト
	//~en Key string normalizing list
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
		sync : 'isSynchronized',
		freq : 'frequency',
		freq1: 'frequency1',
		freq2: 'frequency2',
		freq3: 'frequency3',
		env  : 'envelope',
		dur  : 'duration',
		amp  : 'gain',
	};

	/**~ja
	 * 関数（メソッド）の別名をつける
	 * @param {object} cls クラス
	 */
	/**~en
	 * Give aliases for functions (methods)
	 * @param {object} cls Class
	 */
	function assignAlias(cls) {
		for (const [alias, orig] of Object.entries(KEY_NORM_LIST)) {
			if (cls.prototype[orig]) {
				cls.prototype[alias] = cls.prototype[orig];
			}
		}
	}

	/**~ja
	 * パラメーターのキーを正規化する
	 * @param {object} params パラメーター
	 * @return {object} 正規化されたパラメーター
	 */
	/**~en
	 * Normalize keys of parameters
	 * @param {object} params parameters
	 * @return {object} Normalized parameters
	 */
	function normalizeParams(params) {
		const ret = {};
		for (const [key, val] of Object.entries(params)) {
			const k = KEY_NORM_LIST[key] ?? key;
			const v = KEY_NORM_LIST[val] ?? val;
			ret[k] = v;
		}
		return ret;
	}

	//~ja 最小値
	//~en Minimum value
	const DELAY = 0.001;

	/**~ja
	 * cancelAndHoldAtTimeメソッドの代替
	 * @param {AudioParam} param オーディオ・パラメーター
	 * @param {number} time 時刻 [s]
	 */
	/**~en
	 * Polyfill of cancelAndHoldAtTime method
	 * @param {AudioParam} params Audio parameter
	 * @param {number} time Time [s]
	 */
	function cancelAndHoldAtTime(param, time) {
		if (param.cancelAndHoldAtTime) {
			param.cancelAndHoldAtTime(time);
		} else {
			const val = param.value;
			param.cancelScheduledValues(time);
			param.setValueAtTime(val, time);
		}
	}

	/**~ja
	 * オーディオ・パラメーターに値を設定する
	 * @param {AudioParam} param オーディオ・パラメーター
	 * @param {number} value 値
	 * @param {number} time 時刻 [s]
	 * @param {string} type 種類
	 */
	/**~en
	 * Set a value to the audio parameter
	 * @param {AudioParam} params Audio parameter
	 * @param {number} value Value
	 * @param {number} time Time [s]
	 * @param {string} type Type
	 */
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
	//=include _audio/_patch-noise.js


	//=
	//=include _audio/_patch-microphone.js


	//=
	//=include _audio/_patch-buffer-source.js


	//=
	//=include _audio/_patch-gain.js


	//=
	//=include _audio/_patch-biquad-filter.js


	//=
	//=include _audio/_patch-formant.js


	//=
	//=include _audio/_patch-envelope.js


	//=
	//=include _audio/_patch-scope.js


	//=
	//=include _audio/_patch-speaker.js


	//~ja ライブラリを作る --------------------------------------------------------
	//~en Create a library --------------------------------------------------------


	return {
		Patch,
		SourcePatch,

		OscillatorPatch,
		NoisePatch,
		MicrophonePatch,
		BufferSourcePatch,

		GainPatch,
		BiquadFilterPatch,
		FormantPatch,

		ScopePatch,
		SpeakerPatch,
		EnvelopePatch,

		normalizeParams
	};

})();
