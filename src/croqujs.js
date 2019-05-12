/**~ja
 * クロッキー・ライブラリ（CROQUJS）
 *
 * 絵をかくための紙を作るライブラリです。
 * このライブラリは、HTMLについて知っていなくてもJavaScriptから簡単に絵をかけ、
 * マウスの操作に対応できるようにするための準備をするものです。
 * （ここでの紙は、HTML5のCanvas要素のCanvasRenderingContext2Dを拡張したもののことです）
 *
 * @author Takuto Yanagida
 * @version 2019-05-12
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
 * @version 2019-05-12
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


	//~ja クラス定義 --------------------------------------------------------------
	//~en Class definition --------------------------------------------------------


	Paper.mixin = {};

	/**~ja
	 * 横の大きさ
	 * @param {number=} val 横の大きさ
	 * @return {number|Paper} 横の大きさ／この紙
	 */
	/**~en
	 * Width
	 * @param {number=} val Width
	 * @return {number|Paper} Width, or this paper
	 */
	Paper.mixin.width = function (val) {
		if (val === undefined) return this.canvas.width;
		this.canvas.width = val;
		return this;
	};

	/**~ja
	 * たての大きさ
	 * @param {number=} val たての大きさ
	 * @return {number|Paper} たての大きさ／この紙
	 */
	/**~en
	 * Height
	 * @param {number=} val Height
	 * @return {number|Paper} Height, or this paper
	 */
	Paper.mixin.height = function (val) {
		if (val === undefined) return this.canvas.height;
		this.canvas.height = val;
		return this;
	};

	/**~ja
	 * フレーム
	 * @return {number|Paper} フレーム
	 */
	/**~en
	 * Frames
	 * @return {number|Paper} Frames
	 */
	Paper.mixin.frame = function () {
		return this._frame;
	};

	/**~ja
	 * FPS（1秒間のコマ数）
	 * @param {number=} val FPS（1秒間のコマ数）
	 * @return {number|Paper} FPS（1秒間のコマ数）／この紙
	 */
	/**~en
	 * Frames per second
	 * @param {number=} val Frames per second
	 * @return {number|Paper} Frames per second, or this paper
	 */
	Paper.mixin.fps = function (val) {
		if (val === undefined) return this._fps;
		this._fps = val;
		return this;
	};

	/**~ja
	 * フレーム数
	 * @param {number=} val フレーム数
	 * @return {number|Paper} フレーム数／この紙
	 */
	/**~en
	 * Frame length
	 * @param {number=} val Frame length
	 * @return {number|Paper} Frame length, or this paper
	 */
	Paper.mixin.frameLength = function (val) {
		if (val === undefined) return this._frameLength;
		this._frameLength = val;
		return this;
	};

	/**~ja
	 * ホイールクリックでグリッドを表示するか
	 * @param {boolean=} val ホイールクリックでグリッドを表示するか
	 * @return {boolean|Paper} ホイールクリックでグリッドを表示するか／この紙
	 */
	/**~en
	 * Whether to show grid on wheel click
	 * @param {boolean=} val Whether to show grid on wheel click
	 * @return {boolean|Paper} Whether to show grid on wheel click, or this paper
	 */
	Paper.mixin.gridVisible = function (val) {
		if (val === undefined) return this._isGridVisible;
		this._isGridVisible = val;
		return this;
	};

	/**~ja
	 * 紙のサイズを変える
	 * @param {number} width 横の大きさ
	 * @param {number} height たての大きさ
	 */
	/**~en
	 * Set the size of the paper
	 * @param {number} width Width
	 * @param {number} height Height
	 */
	Paper.mixin.setSize = function (width, height) {
		this.canvas.width = width;
		this.canvas.height = height;
	};

	/**~ja
	 * 紙を指定した色でクリアする
	 * @param {string} style スタイル（指定しなければ透明）
	 * @param {number} alpha アルファ
	 */
	/**~en
	 * Clear the paper in the specified color
	 * @param {string} style Style (transparent if not specified)
	 * @param {number} alpha Alpha
	 */
	Paper.mixin.clear = function (style, alpha) {
		this.save();
		this.setTransform(1, 0, 0, 1, 0, 0);
		if (alpha !== undefined) {
			this.globalAlpha = alpha;
		}
		if (style === undefined) {
			this.clearRect(0, 0, this.width(), this.height());  // 透明にする
		} else {
			this.fillStyle = style;
			this.fillRect(0, 0, this.width(), this.height());
		}
		this.restore();
	};

	/**~ja
	 * アニメーションを始める
	 * @param {function} callback 一枚一枚の絵を書く関数
	 * @param {Array} args_array 関数に渡す引数
	 */
	/**~en
	 * Start animation
	 * @param {function} callback Function to draw picture one by one
	 * @param {Array} args_array Arguments to pass to the function
	 */
	Paper.mixin.animate = function (callback, args_array) {
		const startTime = getTime();
		let prevFrame = -1;

		const loop = () => {
			const timeSpan = getTime() - startTime;
			const frame = Math.floor(timeSpan / (1000.0 / this._fps)) % this._frameLength;

			if (frame !== prevFrame) {
				this._frame = frame;
				callback.apply(null, args_array);
				if (this.mouseMiddle() && this._isGridVisible) this.drawGrid();
				prevFrame = frame;
			}
			if (this._isAnimating && this.canvas.parentNode !== null) {
				window.requestAnimationFrame(loop);
			}
		};
		this._isAnimating = true;
		window.requestAnimationFrame(loop);
	};

	/**~ja
	 * アニメーションを止める
	 */
	/**~en
	 * Stop animation
	 */
	Paper.mixin.stop = function () {
		this._isAnimating = false;
	};

	/**~ja
	 * 新しいページを作る
	 * @param {string} pageName ページの名前
	 * @return {Paper} ページ
	 */
	/**~en
	 * Make a new page
	 * @param {string} pageName Page name
	 * @return {Paper} Page
	 */
	Paper.mixin.makePage = function (pageName) {
		if (!this._pages) this._pages = {};
		this._pages[pageName] = new CROQUJS.Paper(this.width(), this.height(), false);
		return this._pages[pageName];
	};

	/**~ja
	 * ページをもらう
	 * @param {string} pageName ページの名前
	 * @return {Paper|boolean} ページ／false
	 */
	/**~en
	 * Get a page
	 * @param {string} pageName Page name
	 * @return {Paper|boolean} Page, or false
	 */
	Paper.mixin.getPage = function (pageName) {
		if (!this._pages) return false;
		return this._pages[pageName];
	};

	/**~ja
	 * 子の紙を追加する
	 * @param {Paper} paper 子の紙
	 */
	/**~en
	 * Add a child paper
	 * @param {Paper} paper Child paper
	 */
	Paper.mixin.addChild = function (paper) {
		if (!this._children) this._children = [];
		this._children.push(paper);
		this._mouseEventHandler.addChild(paper._mouseEventHandler);
	};

	/**~ja
	 * 子の紙を削除する
	 * @param {Paper} paper 子の紙
	 */
	/**~en
	 * Remove a child paper
	 * @param {Paper} paper Child paper
	 */
	Paper.mixin.removeChild = function (paper) {
		if (!this._children) return;
		this._children = this._children.filter(e => (e !== paper));
		this._mouseEventHandler.removeChild(paper._mouseEventHandler);
	};

	/**~ja
	 * 紙にマス目をかく
	 */
	/**~en
	 * Draw grid on the paper
	 */
	Paper.mixin.drawGrid = function () {
		const w = this.width(), h = this.height();
		const wd = Math.floor(w / 10), hd = Math.floor(h / 10);

		this.save();
		this.lineWidth = 1;
		this.strokeStyle = 'White';
		this.globalCompositeOperation = 'xor';

		for (let x = -wd; x < wd; x += 1) {
			this.globalAlpha = (x % 10 === 0) ? 0.75 : 0.5;
			this.beginPath();
			this.moveTo(x * 10, -h);
			this.lineTo(x * 10, h);
			this.stroke();
		}
		for (let y = -hd; y < hd; y += 1) {
			this.globalAlpha = (y % 10 === 0) ? 0.75 : 0.5;
			this.beginPath();
			this.moveTo(-w, y * 10);
			this.lineTo(w, y * 10);
			this.stroke();
		}
		this.restore();
	};

	/**~ja
	 * 紙にかいた絵をファイルに保存する
	 * @param {string=} fileName ファイル名
	 * @param {string=} type ファイルの種類
	 */
	/**~en
	 * Save the picture drawn on the paper to a file
	 * @param {string=} fileName File name
	 * @param {string=} type File type
	 */
	Paper.mixin.saveImage = function (fileName, type) {
		const canvasToBlob = function (canvas, type) {
			const data = atob(canvas.toDataURL(type).split(',')[1]);
			const buf = new Uint8Array(data.length);

			for (let i = 0, I = data.length; i < I; i += 1) {
				buf[i] = data.charCodeAt(i);
			}
			return new Blob([buf], {type: type || 'image/png'});
		};
		const saveBlob = function (blob, fileName) {
			const a = document.createElement('a');
			a.href = window.URL.createObjectURL(blob);
			a.download = fileName;
			a.click();
		};
		saveBlob(canvasToBlob(this.canvas, type), fileName || 'default.png');
	};

	/**~ja
	 * キー・ダウン・イベントに対応する関数をセットする
	 * @param {function(string, KeyEvent)=} handler 関数
	 * @return {function(string, KeyEvent)=} 関数
	 */
	/**~en
	 * Set the function handling key down events
	 * @param {function(string, KeyEvent)=} handler Function
	 * @return {function(string, KeyEvent)=} Function
	 */
	Paper.mixin.onKeyDown = function (handler) {
		if (handler === undefined) return this._keyEventHandler.onKeyDown();
		this._keyEventHandler.onKeyDown(handler);
		return this;
	};

	/**~ja
	 * キー・アップ・イベントに対応する関数をセットする
	 * @param {function(string, KeyEvent)=} handler 関数
	 * @return {function(string, KeyEvent)=} 関数
	 */
	/**~en
	 * Set the function handling key up events
	 * @param {function(string, KeyEvent)=} handler Function
	 * @return {function(string, KeyEvent)=} Function
	 */
	Paper.mixin.onKeyUp = function (handler) {
		if (handler === undefined) return this._keyEventHandler.onKeyUp();
		this._keyEventHandler.onKeyUp(handler);
		return this;
	};

	/**~ja
	 * マウス・ダウン・イベントに対応する関数をセットする
	 * @param {function(number, number, MouseEvent)=} handler 関数
	 * @return {function(number, number, MouseEvent)=} 関数
	 */
	/**~en
	 * Set the function handling the mouse down event
	 * @param {function(number, number, MouseEvent)=} handler Function
	 * @return {function(number, number, MouseEvent)=} Function
	 */
	Paper.mixin.onMouseDown = function (handler) {
		if (handler === undefined) return this._mouseEventHandler.onMouseDown();
		this._mouseEventHandler.onMouseDown(handler);
		return this;
	};

	/**~ja
	 * マウス・ムーブ・イベントに対応する関数をセットする
	 * @param {function(number, number, MouseEvent)=} handler 関数
	 * @return {function(number, number, MouseEvent)=} 関数
	 */
	/**~en
	 * Set the function handling the mouse move event
	 * @param {function(number, number, MouseEvent)=} handler Function
	 * @return {function(number, number, MouseEvent)=} Function
	 */
	Paper.mixin.onMouseMove = function (handler) {
		if (handler === undefined) return this._mouseEventHandler.onMouseMove();
		this._mouseEventHandler.onMouseMove(handler);
		return this;
	};

	/**~ja
	 * マウス・アップ・イベントに対応する関数をセットする
	 * @param {function(number, number, MouseEvent)=} handler 関数
	 * @return {function(number, number, MouseEvent)=} 関数
	 */
	/**~en
	 * Set the function handling the mouse up event
	 * @param {function(number, number, MouseEvent)=} handler Function
	 * @return {function(number, number, MouseEvent)=} Function
	 */
	Paper.mixin.onMouseUp = function (handler) {
		if (handler === undefined) return this._mouseEventHandler.onMouseUp();
		this._mouseEventHandler.onMouseUp(handler);
		return this;
	};

	/**~ja
	 * マウス・クリック・イベントに対応する関数をセットする
	 * @param {function(number, number, MouseEvent)=} handler 関数
	 * @return {function(number, number, MouseEvent)=} 関数
	 */
	/**~en
	 * Set the function handling the mouse click event
	 * @param {function(number, number, MouseEvent)=} handler Function
	 * @return {function(number, number, MouseEvent)=} Function
	 */
	Paper.mixin.onMouseClick = function (handler) {
		if (handler === undefined) return this._mouseEventHandler.onMouseClick();
		this._mouseEventHandler.onMouseClick(handler);
		return this;
	};

	/**~ja
	 * マウス・ホイール・イベントに対応する関数をセットする
	 * @param {function(number, WheelEvent)=} handler 関数
	 * @return {function(number, WheelEvent)=} 関数
	 */
	/**~en
	 * Set the function handling the mouse wheel event
	 * @param {function(number, WheelEvent)=} handler Function
	 * @return {function(number, WheelEvent)=} Function
	 */
	Paper.mixin.onMouseWheel = function (handler) {
		if (handler === undefined) return this._mouseEventHandler.onMouseWheel();
		this._mouseEventHandler.onMouseWheel(handler);
		return this;
	};

	/**~ja
	 * マウスの横の場所を返す
	 * @return {number} マウスの横の場所
	 */
	/**~en
	 * Return x coordinate of the mouse
	 * @return {number} X coordinate of the mouse
	 */
	Paper.mixin.mouseX = function () {
		return this._mouseEventHandler.mouseX();
	};

	/**~ja
	 * マウスのたての場所を返す
	 * @return {number} マウスのたての場所
	 */
	/**~en
	 * Return y coordinate of the mouse
	 * @return {number} Y coordinate of the mouse
	 */
	Paper.mixin.mouseY = function () {
		return this._mouseEventHandler.mouseY();
	};

	/**~ja
	 * マウスの左ボタンが押されているか？
	 * @return {boolean} マウスの左ボタンが押されているか
	 */
	/**~en
	 * Whether the left mouse button is pressed
	 * @return {boolean} Whether the left mouse button is pressed
	 */
	Paper.mixin.mouseLeft = function () {
		return this._mouseEventHandler.mouseLeft();
	};

	/**~ja
	 * マウスの右ボタンが押されているか？
	 * @return {boolean} マウスの右ボタンが押されているか
	 */
	/**~en
	 * Whether the right mouse button is pressed
	 * @return {boolean} Whether the right mouse button is pressed
	 */
	Paper.mixin.mouseRight = function () {
		return this._mouseEventHandler.mouseRight();
	};

	/**~ja
	 * マウスの中ボタンが押されているか？
	 * @return {boolean} マウスの中ボタンが押されているか
	 */
	/**~en
	 * Whether the middle mouse button is pressed
	 * @return {boolean} Whether the middle mouse button is pressed
	 */
	Paper.mixin.mouseMiddle = function () {
		return this._mouseEventHandler.mouseMiddle();
	};


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
