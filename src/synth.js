/**~ja
 * シンセサイザー・ライブラリー（SYNTH）
 *
 * 音を鳴らすための部品を作るライブラリです。
 *
 * @author Takuto Yanagida
 * @version 2020-11-18
 */


var SYNTH = (function () {

	'use strict';


	//~ja ライブラリ中だけで使用するユーティリティ --------------------------------
	//~en Utilities used only in the library --------------------------------------


	// パラメーター処理
	const par = function (p, name, def) {
		if (!p) return def;
		if (!Array.isArray(name)) return p[name] ? p[name] : def;
		for (let n of name) {
			if (p[n]) return p[n];
		}
		return def;
	};


	//=
	//=include _audio/_synth.js


	//=
	//=include _audio/_scheduler.js


	//=
	//=include _audio/_sequencer.js


	//=
	//=include _audio/_scope.js


	//~ja ライブラリを作る --------------------------------------------------------
	//~en Create a library --------------------------------------------------------


	return { Synth, Scheduler, Sequencer, Scope, noteNumToFreq, AUDIO_CONTEXT };

})();
