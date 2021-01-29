/**~ja
 * ウィジェット・ライブラリ（WIDGET）
 *
 * 様々なウィジェット（コントロール）を使えるようにするライブラリです。
 *
 * @author Takuto Yanagida
 * @version 2021-01-29
 */
/**~en
 * Widget library (WIDGET)
 *
 * A library that allows you to use various widgets (controls).
 *
 * @author Takuto Yanagida
 * @version 2021-01-29
 */


/**~ja
 * ライブラリ変数
 */
/**~en
 * Library variable
 */
const WIDGET = (function () {

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
		addStyle('.__widget', {
			margin    : '0px',
			padding   : '0px',
			boxSizing : 'border-box',
			fontFamily: 'Consolas, Menlo, "Courier New", "メイリオ", Meiryo, "Osaka－等幅", Osaka-mono, monospace',
		});
		addStyle('.__widget-base', {
			display        : 'inline-flex',
			position       : 'relative',
			margin         : '4px',
			padding        : '8px',
			borderRadius   : '1px',
			backgroundColor: 'White',
			boxShadow      : '1px 1px 8px rgba(0, 0, 0, 0.4)',
		});
		addStyle('.__widget-full', {
			width   : '100%',
			height  : '100%',
			position: 'relative',
		});
		addStyle('.__widget-button-array', {
			gap: '12px',
		});
		addStyle('.__widget-button', {
			flex          : '1 1 1',
			minWidth      : '32px',
			minHeight     : '32px',
			display       : 'flex',
			justifyContent: 'center',
			alignItems    : 'center',
			padding       : '4px 8px',
			overflow      : 'hidden',
			borderRadius  : '8px',
			boxShadow     : '0px 0px 4px rgba(0, 0, 0, 0.25)',
			cursor        : 'pointer',
		});
		addStyle('.__widget-button:last-child', {
			marginRight: '0px',
		});
		addStyle('.__widget-button:hover', {
			boxShadow: '1px 1px 8px rgba(0, 0, 0, 0.4)',
		});
		addStyle('.__widget-button:active', {
			boxShadow: '1px 1px 8px rgba(0, 0, 0, 0.4) inset',
		});
		addStyle('.__widget-button-pushed', {
			boxShadow: '1px 1px 8px rgba(0, 0, 0, 0.4) inset !important',
		});
		addStyle('.__widget-slider-knob', {
			position       : 'absolute',
			width          : '16px',
			height         : '16px',
			margin         : '-8px 0px 0px -8px',
			backgroundColor: 'White',
			borderRadius   : '8px',
			boxShadow      : '1px 1px 8px rgba(0, 0, 0, 0.4)',
			cursor         : '-webkit-grab',
		});
		addStyle('.__widget-thermometer-output', {
			display     : 'block',
			marginBottom: '10px',
			width       : '100%',
			height      : '20px',
			textAlign   : 'right',
			border      : 'none',
		});
		isBaseStyleAssigned = true;
	};


	//=
	//=include _widget/_widget.js


	//=
	//=include _widget/_chat.js


	//=
	//=include _widget/_switch.js


	//=
	//=include _widget/_toggle.js


	//=
	//=include _widget/_output.js


	//=
	//=include _widget/_chart.js


	//=
	//=include _widget/_slider-base.js


	//=
	//=include _widget/_slider.js


	//=
	//=include _widget/_thermometer.js


	//~ja ライブラリを作る --------------------------------------------------------
	//~en Create a library --------------------------------------------------------


	return { Widget, Chat, Switch, Toggle, Output, Chart, Slider, Thermometer };

}());
