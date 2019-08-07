/**~ja
 * クロッキー・ライブラリ（CROQUJS）
 *
 * 絵をかくための紙を作るライブラリです。
 * このライブラリは、HTMLについて知っていなくてもJavaScriptから簡単に絵をかけ、
 * マウスの操作に対応できるようにするための準備をするものです。
 * （ここでの紙は、HTML5のCanvas要素のCanvasRenderingContext2Dを拡張したもののことです）
 *
 * @author Takuto Yanagida
 * @version 2019-08-07
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
 * @version 2019-08-07
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
	s.innerHTML = '*{margin:0;padding:0}body{white-space:nowrap;display:flex;flex-wrap:wrap;}';
	document.head.appendChild(s);

	//~ja すべてのプログラム（スクリプト）を読み込み終わったらsetup関数を呼び出すように、イベント・リスナーを登録する
	//~en Register event listeners so that the setup function is called when all programs (scripts) have been loaded
	window.addEventListener('load', () => {
		if (typeof setup === 'function') {
			setup();
		}
	}, true);


	//~ja ペーパー（CROQUJS.Paper) ------------------------------------------------
	//~en Paper (CROQUJS.Paper) ---------------------------------------------------


	const CANVAS_TO_PAPER = {};

	/**~ja
	 * 紙を作る（必ずnewを付けて呼び出すこと！）
	 * @param {number} width 横の大きさ
	 * @param {number} height たての大きさ
	 * @param {boolean} [isVisible=true] 画面に表示する？
	 * @constructor
	 */
	const Paper = function (width, height, isVisible = true) {
		const can = document.createElement('canvas');
		can.setAttribute('width', width || 400);
		can.setAttribute('height', height || 400);
		can.setAttribute('tabindex', 1);
		const ctx = can.getContext('2d');

		//~ja 画面に表示する場合は
		//~en When displaying on the screen
		if (isVisible === true) {
			const style = document.createElement('style');
			style.innerHTML = 'body>canvas{border:0px solid lightgray;display:inline-block;touch-action:none;outline:none;}';
			document.head.appendChild(style);

			can.id = 'canvas';
			document.body.appendChild(can);
			can.focus();
		}
		CANVAS_TO_PAPER[can] = ctx;
		return _augment(ctx);
	};

	/**~ja
	 * 紙の機能を追加する（ライブラリ内だけで使用）
	 * @private
	 * @param {CanvasRenderingContext2D} ctx キャンバス・コンテキスト
	 * @return {CanvasRenderingContext2D} キャンバス・コンテキスト
	 */
	const _augment = function (ctx) {
		ctx._frame = 0;
		ctx._fps = 60;
		ctx._frameLength = 60;
		ctx._isAnimating = false;
		ctx._isGridVisible = true;

		ctx._keyEventHandler = new KeyHandler(ctx.canvas);
		ctx._mouseEventHandler = new MouseHandler(ctx.canvas);
		ctx.addEventListener = ctx.canvas.addEventListener.bind(ctx.canvas);

		Object.keys(Paper.mixin).forEach((p) => {
			const d = Object.getOwnPropertyDescriptor(Paper.mixin, p);
			Object.defineProperty(ctx, p, d);
		});
		ctx.canvas.addEventListener('keydown', (e) => {
			if (e.ctrlKey && String.fromCharCode(e.keyCode) === 'S') ctx.saveImage();
		}, true);
		return ctx;
	};


	//=
	//=include _key-handler.js


	//=
	//=include _mouse-handler.js


	//=
	//=include _paper-mixin.js


	//~ja ユーティリティ関数 ------------------------------------------------------
	//~en Utility functions -------------------------------------------------------


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


	//~ja ライブラリを作る --------------------------------------------------------
	//~en Create a library --------------------------------------------------------


	return { Paper, getTime, removeAll };

}());
