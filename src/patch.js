/**~ja
 * パッチ・ライブラリー（PATCH）
 *
 * 音を鳴らすための部品を作るライブラリです。
 *
 * @author Takuto Yanagida
 * @version 2020-11-29
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


	// パラメーター処理
	const par = function (p, name, def) {
		if (!p) return def;
		if (Array.isArray(name)) {
			for (const n of name) {
				if (p[n]) return p[n];
			}
			return def;
		} else {
			return p[name] ?? def;
		}
	};

	const disconnect = function (...nodes) {
		for (const n of nodes) {
			if (n && n.toString() === '[object GainNode]') {
				n.gain.value = 0;
			}
			if (n) setTimeout(() => { n.disconnect() }, 50);
		}
	};


	//~ja パッチ -----------------------------------------------------------------


	//=
	//=include _audio/_patch-base.js


	//=
	//=include _audio/_patch-oscillator.js


	//=
	//=include _audio/_patch-noise.js


	//=
	//=include _audio/_patch-microphone.js


	//=
	//=include _audio/_patch-sound-file.js


	//=
	//=include _audio/_patch-gain.js


	//=
	//=include _audio/_patch-biquad-filter.js


	//=
	//=include _audio/_patch-formant.js


	//=
	//=include _audio/_patch-scope.js


	//=
	//=include _audio/_patch-envelope.js


	//=
	//=include _audio/_patch-speaker.js


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
		EnvelopePatch,
		BiquadFilterPatch,
		ScopePatch,
		FormantPatch,
		Speaker,

		SoundFile
	};

})();
