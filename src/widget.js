//
// ウィジェット・ライブラリー（WIDGET）
// 日付: 2019-04-22
// 作者: 柳田拓人（Space-Time Inc.）
//
// 様々なウィジェット（コントロール）を使えるようにします。
//


// ライブラリ変数
const WIDGET = (function () {

	'use strict';

	const _addStyle = (function () {
		const s = document.createElement('style');
		s.setAttribute('type', 'text/css');
		document.head.appendChild(s);
		const ss = s.sheet;

		return (style) => {
			const styles = style.split('}').filter(e => e.indexOf('{') !== -1).map(e => e + '}');
			for (let s of styles) {
				ss.insertRule(s, ss.cssRules.length);
			}
		};
	})();

	let isBaseStyleAssigned = false;

	const ensureBaseStyle = function () {
		if (isBaseStyleAssigned) return;
		_addStyle(`
			.__widget {
				margin: 0px;
				padding: 0px;
				box-sizing: border-box;
				font-family: Consolas, Menlo, "Courier New", "メイリオ", Meiryo, "Osaka－等幅", Osaka-mono, monospace;
			}
			.__widget-base {
				display: inline-flex;
				position: relative;
				margin: 4px;
				padding: 8px;
				border-radius: 4px;
				background-color: White;
				box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.4);
			}
			.__widget-full {
				width: 100%;
				height: 100%;
				position: relative;
			}
		`);
		_addStyle(`
			.__widget-button {
				flex: 1 1 1;
				min-width: 32px;
				min-height: 32px;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-right: 12px;
				padding: 4px 8px;
				overflow: hidden;
				border-radius: 8px;
				box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
				cursor: pointer;
			}
			.__widget-button:last-child {
				margin-right: 0px;
			}
			.__widget-button:hover {
				box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.4);
			}
			.__widget-button:active {
				box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.4) inset;
			}
			.__widget-button-pushed {
				box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.4) inset !important;
			}
		`);
		_addStyle(`
			.__widget-slider-knob {
				position: absolute;
				width: 16px; height: 16px;
				margin: -8px 0px 0px -8px;
				background-color: White;
				border-radius: 8px;
				box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.4);
				cursor: -webkit-grab;
			}
		`);
		_addStyle(`
			.__widget-thermometer-output {
				display: block;
				margin-bottom: 10px;
				width: 100%;
				height: 20px;
				text-align: right;
				border: none;
			}
		`);
		isBaseStyleAssigned = true;
	};




	//
	//=include widget/_widget.js




	//
	//=include widget/_switch.js




	//
	//=include widget/_toggle.js




	//
	//=include widget/_output.js




	//
	//=include widget/_chart.js




	//
	//=include widget/_sliderBase.js




	//
	//=include widget/_slider.js





	//
	//=include widget/_thermometer.js




	// -------------------------------------------------------------------------
	// ライブラリを作る
	// -------------------------------------------------------------------------




	// ライブラリとして返す
	return { Switch, Toggle, Output, Chart, Slider, Thermometer };

}());
