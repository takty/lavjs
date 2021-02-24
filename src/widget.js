/**~ja
 * ウィジェット・ライブラリ（WIDGET）
 *
 * 様々なウィジェット（コントロール）を使えるようにするライブラリです。
 *
 * @author Takuto Yanagida
 * @version 2021-02-24
 */
/**~en
 * Widget library (WIDGET)
 *
 * A library that allows you to use various widgets (controls).
 *
 * @author Takuto Yanagida
 * @version 2021-02-24
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
		addStyle('.lavjs-widget', {
			margin    : '0',
			padding   : '0',
			fontSize  : '14px',
			fontFamily: 'Consolas, Menlo, "Courier New", Meiryo, Osaka-Mono, monospace',
		});
		addStyle('.lavjs-widget-base', {
			display        : 'inline-flex',
			position       : 'relative',
			margin         : '2px',
			padding        : '8px',
			borderRadius   : '1px',
			backgroundColor: 'White',
			boxShadow      : '1px 1px 8px rgba(0, 0, 0, 0.4)',
		});
		addStyle('.lavjs-widget-full', {
			width   : '100%',
			height  : '100%',
			position: 'relative',
		});
		addStyle('.lavjs-widget-button-row', {
			gap: '8px',
		});
		addStyle('.lavjs-widget-button', {
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
		addStyle('.lavjs-widget-button:hover:not(.active)', {
			boxShadow: '0 0 2px 1px rgba(0, 0, 0, 0.25)',
		});
		addStyle('.lavjs-widget-button.active', {
			boxShadow: '1px 1px 8px rgba(0, 0, 0, 0.4) inset',
		});
		addStyle('.lavjs-widget-chat-message', {
			width    : '100%',
			overflowY: 'auto',
			flexGrow : '1',
			height   : '1.25em',
			minHeight: '1.25em',
		});
		addStyle('.lavjs-widget-chat-message > div', {
			minHeight: '1.25em',
		});
		addStyle('.lavjs-widget-chat-prompt:not(:empty)', {
			marginTop : '0.5rem',
			whiteSpace: 'normal',
			overflowY : 'auto',
			minHeight : '1.25em',
		});
		addStyle('.lavjs-widget-chat-prompt a', {
			textDecoration : 'underline',
			cursor         : 'pointer',
			color          : '#12f',
			backgroundColor: '#12f1',
		});
		addStyle('.lavjs-widget-chat-hr', {
			marginTop   : '0.5rem',
			marginBottom: '0',
			width       : '100%',
			height      : '2px',
			borderTop   : '1px solid #bbb',
		});
		addStyle('.lavjs-widget-chat-message', {
			width    : '100%',
			overflowY: 'auto',
			flexGrow : '1',
		});
		addStyle('.lavjs-widget-chat-input', {
			width       : '100%',
			overflowY   : 'scroll',
			height      : '2em',
			minHeight   : '2em',
			marginTop   : '0.5rem',
			borderRadius: '6px',
			border      : '1px solid #bbb',
			boxShadow   : '0 1px 2px rgba(0, 0, 0, 0.25) inset',
		});
		addStyle('.lavjs-widget-slider-knob', {
			position       : 'absolute',
			width          : '16px',
			height         : '16px',
			margin         : '-8px 0px 0px -8px',
			backgroundColor: 'White',
			borderRadius   : '4px',
			boxShadow      : '0 1px 6px 2px rgba(0, 0, 0, 0.35)',  // There is a slight different from buttons
			cursor         : '-webkit-grab',
		});
		addStyle('.lavjs-widget-slider-output', {
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
