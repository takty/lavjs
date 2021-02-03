/**~ja
 * ウィジェット・ライブラリ（WIDGET）
 *
 * 様々なウィジェット（コントロール）を使えるようにするライブラリです。
 *
 * @author Takuto Yanagida
 * @version 2021-02-03
 */
/**~en
 * Widget library (WIDGET)
 *
 * A library that allows you to use various widgets (controls).
 *
 * @author Takuto Yanagida
 * @version 2021-02-03
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
		isBaseStyleAssigned = true;
		addStyle('.__widget', {
			margin    : '0',
			padding   : '0',
			fontSize  : '14px',
			fontFamily: 'Consolas, Menlo, "Courier New", Meiryo, Osaka-Mono, monospace',
		});
		addStyle('.__widget-base', {
			display        : 'inline-flex',
			position       : 'relative',
			margin         : '2px',
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
		addStyle('.__widget-button-row', {
			gap: '8px',
		});
		addStyle('.__widget-button', {
			flex          : '1 1 1',
			minWidth      : '28px',
			minHeight     : '28px',
			display       : 'grid',
			placeItems    : 'center',
			padding       : '4px 8px',
			overflow      : 'hidden',
			borderRadius  : '3px',
			boxShadow     : '0 1px 6px 1px rgba(0, 0, 0, 0.35)',
			cursor        : 'pointer',
			userSelect    : 'none',
		});
		addStyle('.__widget-button:hover:not(.active)', {
			boxShadow: '0 0 2px 1px rgba(0, 0, 0, 0.25)',
		});
		addStyle('.__widget-button.active', {
			boxShadow: '1px 1px 8px rgba(0, 0, 0, 0.4) inset',
		});
		addStyle('.__widget-chat-message', {
			width    : '100%',
			overflowY: 'scroll',
			flexGrow : '1',
		});
		addStyle('.__widget-chat-input', {
			width    : '100%',
			overflowY: 'scroll',
		});
		addStyle('.__widget-slider-knob', {
			position       : 'absolute',
			width          : '16px',
			height         : '16px',
			margin         : '-8px 0px 0px -8px',
			backgroundColor: 'White',
			borderRadius   : '4px',
			boxShadow      : '0 1px 6px 2px rgba(0, 0, 0, 0.35)',  // There is a slight different from buttons
			cursor         : '-webkit-grab',
		});
		addStyle('.__widget-slider-output', {
			display     : 'block',
			marginBottom: '10px',
			width       : '100%',
			height      : '20px',
			textAlign   : 'right',
			border      : 'none',
			boxShadow   : '0 0 2px rgba(0, 0, 0, 0.25) inset',
		});
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
