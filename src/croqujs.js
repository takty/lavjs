/**~ja
 * クロッキー・ライブラリ（CROQUJS）
 *
 * 絵をかくための紙を作るライブラリです。
 * このライブラリは、HTMLについて知っていなくてもJavaScriptから簡単に絵をかけ、
 * マウスの操作に対応できるようにするための準備をするものです。
 * （ここでの紙は、HTML5のCanvas要素のCanvasRenderingContext2Dを拡張したもののことです）
 *
 * @author Takuto Yanagida
 * @version 2020-04-30
 */
/**~en
 * Croqujs library (CROQUJS)
 *
 * A library to make paper for painting.
 * This library prepares to draw pictures easily from JavaScript
 * without having to know HTML and to be able to handle mouse operations.
 * ('Paper' here is an extension of CanvasRenderingContext2D of HTML5 Canvas element)
 *
 * @author Takuto Yanagida
 * @version 2020-11-20
 */


/**~ja
 * ライブラリ変数
 */
/**~en
 * Library variable
 */
const CROQUJS = (function () {

	'use strict';


	//~ja 共通のCSS
	//~en Common CSS
	const s = document.createElement('style');
	s.innerHTML = '*{margin:0;padding:0}body{white-space:nowrap;display:flex;flex-wrap:wrap;align-items:flex-start;}';
	document.head.appendChild(s);

	//~ja すべてのプログラム（スクリプト）を読み込み終わったらsetup関数を呼び出すように、イベント・リスナーを登録する
	//~en Register event listeners so that the setup function is called when all programs (scripts) have been loaded
	window.addEventListener('load', () => {
		if (typeof setup === 'function') {
			setup();
		}
	}, true);


	//~ja ペーパー（CROQUJS.Paper) ---------------------------------------------
	//~en Paper (CROQUJS.Paper) ------------------------------------------------


	const CANVAS_TO_PAPER = {};


	//=
	//=include _croqujs/_key-handler.js


	//=
	//=include _croqujs/_mouse-handler.js


	//=
	//=include _croqujs/_zoom-handler.js


	//=
	//=include _croqujs/_paper.js


	//~ja ユーティリティ関数 ---------------------------------------------------
	//~en Utility functions ----------------------------------------------------


	/**~ja
	 * 今のミリ秒を得る
	 * @return {number} 今のミリ秒
	 */
	/**~en
	 * Get the current millisecond
	 * @return {number} The current millisecond
	 */
	const getTime = (function () {
		return window.performance.now.bind(window.performance);
	}());

	/**~ja
	 * 例外を除き画面上の要素をすべて削除する
	 * @param {DOMElement} exception 例外の要素
	 */
	/**~en
	 * Delete all elements on the screen except for the specified exception
	 * @param {DOMElement} exception Elements of exception
	 */
	const removeAll = function (...exception) {
		let ex = [];
		if (exception.length === 1 && Array.isArray(exception[0])) {
			ex = exception[0];
		} else {
			ex = exception;
		}
		ex = ex.map((e) => {return (e.domElement === undefined) ? e : e.domElement();});

		const rm = [];
		for (let c of document.body.childNodes) {
			if (ex.indexOf(c) === -1) rm.push(c);
		}
		rm.forEach((e) => {
			if (CANVAS_TO_PAPER[e]) {
				CANVAS_TO_PAPER[e]._mouseEventHandler.removeWinListener();
			}
			document.body.removeChild(e);
		});
	};

	/**~ja
	 * 現在の紙
	 * @param {Paper=} paper 紙
	 * @return {Paper} 現在の紙
	 */
	/**~en
	 * Current paper
	 * @param {Paper=} paper Paper
	 * @return {Paper} Current paper
	 */
	const currentPaper = function (paper) {
		if (paper) CROQUJS._currentPaper = paper;
		return CROQUJS._currentPaper;
	};


	//=
	//=include _croqujs/_loader.js


	//~ja ライブラリを作る -----------------------------------------------------
	//~en Create a library -----------------------------------------------------


	return { Paper, getTime, removeAll, currentPaper, loadScript, loadScriptSync };

}());