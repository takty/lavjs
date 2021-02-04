/**~ja
 * アナライザー・ライブラリー（ANALYZER）
 *
 * 波形の解析を行うウィジェットを使えるようにするライブラリです。
 *
 * @author Takuto Yanagida
 * @version 2021-02-04
 */
/**~en
 * Analyzer library (ANALYZER)
 *
 * A library that enables to use widgets that analyze waveforms.
 *
 * @author Takuto Yanagida
 * @version 2021-02-04
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


	//=
	//=include _widget/_util.js


	let isBaseStyleAssigned = false;

	/**~ja
	 * ベース・スタイルを登録する
	 */
	/**~en
	 * Register base style
	 */
	const ensureBaseStyle = function () {
		if (isBaseStyleAssigned) return;
		isBaseStyleAssigned = true;
		addStyle('.lavjs-widget-scope', {
			fontSize  : '14px',
			fontFamily: 'Consolas, Menlo, "Courier New", Meiryo, Osaka-Mono, monospace',

			position       : 'relative',
			margin         : '2px',
			padding        : '8px',
			borderRadius   : '1px',
			backgroundColor: 'White',
			boxShadow      : '1px 1px 8px rgba(0, 0, 0, 0.4)',

			display      : 'block',
			verticalAlign: 'middle',
		});
		addStyle('.lavjs-widget-scope-canvas', {
			border: '0',
			fontFamily: 'Consolas, Menlo, "Courier New", Meiryo, Osaka-Mono, monospace',
		});
	};


	//=
	//=include _widget/_scope-base.js


	//=
	//=include _widget/_waveform-scope.js


	//=
	//=include _widget/_spectrum-scope.js


	//~ja ライブラリを作る --------------------------------------------------------
	//~en Create a library --------------------------------------------------------


	return { WaveformScope, SpectrumScope };

})();
