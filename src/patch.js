/**~ja
 * パッチ・ライブラリー（PATCH）
 *
 * 音を鳴らすための部品を作るライブラリです。
 *
 * @author Takuto Yanagida
 * @version 2020-12-03
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


	/**~ja
	 * 最小値
	 */
	/**~en
	 * Minimum value
	 */
	const DELAY = 0.005;

	function setValueAtTime(param, value, time) {
		cancelAndHoldAtTime(param, time);
		param.setValueAtTime(param.value, time);
		param.setTargetAtTime(value, time, DELAY);
	}

	function cancelAndHoldAtTime(param, time) {
		if (param.cancelAndHoldAtTime) {
			param.cancelAndHoldAtTime(time);
			// param.setValueAtTime(param.value, time);
		} else {
			const val = param.value;
			param.cancelScheduledValues(time);
			param.setValueAtTime(val, time);
		}
	}


	//~ja パッチ -----------------------------------------------------------------
	//~ja Patch --------------------------------------------------------------


	//=
	//=include _audio/_patch-base.js


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


	//~ja ノブ -----------------------------------------------------------------
	//~en Knob ---------------------------------------------------------------


	class Knob {
		on(time) {}
		off(time) {}
	}


	//=
	//=include _audio/_knob-basic.js


	//=
	//=include _audio/_knob-envelope.js


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

		BasicKnob,
		EnvelopeKnob,
	};

})();
