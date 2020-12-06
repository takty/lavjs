/**~ja
 * シンセサイザー・ライブラリー（SYNTH）
 *
 * 音を鳴らすための部品を作るライブラリです。
 *
 * @author Takuto Yanagida
 * @version 2020-12-06
 */


var SYNTH = (function () {

	'use strict';


	//~ja ライブラリ中だけで使用するユーティリティ --------------------------------
	//~en Utilities used only in the library --------------------------------------


	// キー文字列正規化リスト
	const KEY_NORM_LIST = {
		sr   : 'swingRatio',
		inst : 'instrument',
		tempo: 'bpm',
		amp  : 'gain',
	};

	function normalizeParams(params) {
		const ret = {};
		for (const [key, val] of Object.entries(params)) {
			const k = KEY_NORM_LIST[key] ?? key;
			const v = KEY_NORM_LIST[val] ?? val;
			ret[k] = v;
		}
		return ret;
	}

	// ノート番号を周波数に変換する
	const noteNumToFreq = function (num) {
		return 440 * Math.pow(2, (num - 69) / 12);
	};

	//（ライブラリの中だけで使う関数）CSSのスタイルを追加する（セレクター、スタイル）
	const addCSS = (function () {
		const s = document.createElement('style');
		s.setAttribute('type', 'text/css');
		document.head.appendChild(s);
		return (selector, style) => {
			s.sheet.insertRule(`${selector}{${style}}`, 0);
		};
	})();


	//=
	//=include _audio/_synth.js


	//=
	//=include _audio/_scheduler.js


	//=
	//=include _audio/_sequencer.js


	//=
	//=include _audio/_scope.js


	//=
	//=include _audio/_waveform-scope.js


	//=
	//=include _audio/_spectrum-scope.js


	//~ja ライブラリを作る --------------------------------------------------------
	//~en Create a library --------------------------------------------------------


	return { Synth, Scheduler, Sequencer, WaveformScope, SpectrumScope, noteNumToFreq };

})();
