/**~ja
 * アナライザー・ライブラリー（ANALYZER）
 *
 * 波形の解析を行うウィジェットを使えるようにするライブラリです。
 *
 * @author Takuto Yanagida
 * @version 2020-12-16
 */
/**~en
 * Analyzer library (ANALYZER)
 *
 * A library that enables to use widgets that analyze waveforms.
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
const ANALYZER = (function () {

	'use strict';


	//~ja ライブラリ中だけで使用するユーティリティ --------------------------------
	//~en Utilities used only in the library --------------------------------------


	//~ja CSSのスタイルを追加する
	//~en Add CSS styles
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
