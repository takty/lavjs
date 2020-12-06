/**~ja
 * アナライザー・ライブラリー（ANALYZER）
 *
 * 波形の解析を行うウィジェットを使えるようにするライブラリです。
 *
 * @author Takuto Yanagida
 * @version 2020-12-06
 */


/**~ja
 * ライブラリ変数
 */
/**~en
 * Library variable
 */
const ANALYZER = (function () {

	'use strict';


	//~ja ライブラリ中だけで使用するユーティリティ --------------------------------
	//~en Utilities used only in the library --------------------------------------


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
	//=include _widget/_scope.js


	//=
	//=include _widget/_waveform-scope.js


	//=
	//=include _widget/_spectrum-scope.js


	//~ja ライブラリを作る --------------------------------------------------------
	//~en Create a library --------------------------------------------------------


	return { WaveformScope, SpectrumScope };

})();
