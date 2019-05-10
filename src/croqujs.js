//
// クロッキー・ライブラリー（CROQUJS）
// 日付: 2019-05-10
// 作者: 柳田拓人（Space-Time Inc.）
//
// 絵をかくための紙を作るライブラリです。
// このライブラリは、HTMLについて知っていなくてもJavaScriptから簡単に絵をかけ、
// マウスの操作に対応できるようにするための準備をするものです。
// （ここでの紙は、HTML5のCanvas要素のCanvasRenderingContext2Dを拡張したもののことです）
//


// ライブラリ変数
const CROQUJS = (function () {

	'use strict';


	// 共通のCSS
	const s = document.createElement('style');
	s.innerHTML = '*{margin:0;padding:0}body{white-space:nowrap;display:flex;flex-wrap:wrap;}';
	document.head.appendChild(s);

	// すべてのプログラム（スクリプト）を読み込み終わったらsetup関数を呼び出すように、イベント・リスナーを登録する
	window.addEventListener('load', () => {
		if (typeof setup === 'function') {  // setupが関数だったら
			setup();
		}
	}, true);




	// -------------------------------------------------------------------------
	// ペーパー（CROQUJS.Paper)
	// -------------------------------------------------------------------------




	const CANVAS_TO_PAPER = {};

	// 紙を作る（横の大きさ、たての大きさ、<画面に表示する？>）
	// ※必ずnewを付けて呼び出すこと！
	const Paper = function (width, height, isVisible = true) {
		const can = document.createElement('canvas');
		can.setAttribute('width', width || 400);
		can.setAttribute('height', height || 400);
		can.setAttribute('tabindex', 1);
		const ctx = can.getContext('2d');

		// 画面に表示する場合は
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

	// （ライブラリ内だけで使用）紙の機能を追加する（キャンバス・コンテキスト）
	const _augment = function (ctx) {
		ctx._frame = 0;
		ctx._fps = 60;
		ctx._frameLength = 60;
		ctx._isAnimating = false;
		ctx._isGridVisible = true;

		ctx._keyEventHandler = new KeyEventHandler(ctx.canvas);
		ctx._mouseEventHandler = new MouseEventHandler(ctx.canvas);
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




	// -------------------------------------------------------------------------
	// クラス定義
	// -------------------------------------------------------------------------




	Paper.mixin = {};

	// 横の大きさ
	Paper.mixin.width = function (val) {
		if (val === undefined) return this.canvas.width;
		this.canvas.width = val;
		return this;
	};

	// たての大きさ
	Paper.mixin.height = function (val) {
		if (val === undefined) return this.canvas.height;
		this.canvas.height = val;
		return this;
	};

	// フレーム
	Paper.mixin.frame = function () {
		return this._frame;
	};

	// FPS（1秒間のコマ数）
	Paper.mixin.fps = function (val) {
		if (val === undefined) return this._fps;
		this._fps = val;
		return this;
	};

	// フレーム数
	Paper.mixin.frameLength = function (val) {
		if (val === undefined) return this._frameLength;
		this._frameLength = val;
		return this;
	};

	// ホイールクリックでグリッドを表示するか
	Paper.mixin.gridVisible = function (val) {
		if (val === undefined) return this._isGridVisible;
		this._isGridVisible = val;
		return this;
	};

	// 紙のサイズを変える（横の大きさ、たての大きさ）
	Paper.mixin.setSize = function (width, height) {
		this.canvas.width = width;
		this.canvas.height = height;
	};

	// 紙を指定した色でクリアする（スタイル（指定しなければ透明）、アルファ）
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

	// アニメーションを始める（一枚一枚の絵を書く関数、関数に渡す引数）
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

	// アニメーションを止める
	Paper.mixin.stop = function () {
		this._isAnimating = false;
	};

	// 新しいページを作る（ページの名前）
	Paper.mixin.makePage = function (pageName) {
		if (!this._pages) this._pages = {};
		this._pages[pageName] = new CROQUJS.Paper(this.width(), this.height(), false);
		return this._pages[pageName];
	};

	// ページをもらう（ページの名前）
	Paper.mixin.getPage = function (pageName) {
		if (!this._pages) return false;
		return this._pages[pageName];
	};

	// 子供の紙を追加する
	Paper.mixin.addChild = function (paper) {
		if (!this._children) this._children = [];
		this._children.push(paper);
		this._mouseEventHandler.addChild(paper._mouseEventHandler);
	};

	// 子供の紙を削除する
	Paper.mixin.removeChild = function (paper) {
		if (!this._children) return false;
		this._children = this._children.filter(e => (e !== paper));
		this._mouseEventHandler.removeChild(paper._mouseEventHandler);
	};

	// 紙にマス目をかく
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

	// 紙にかいた絵をファイルに保存する（ファイル名、ファイルの種類）
	Paper.mixin.saveImage = function (fileName) {
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
		saveBlob(canvasToBlob(this.canvas), fileName || 'default.png');
	};

	// キー・ダウン・イベントに対応する関数をセットする
	Paper.mixin.onKeyDown = function (handler) {
		if (handler === undefined) return this._keyEventHandler.onKeyDown();
		this._keyEventHandler.onKeyDown(handler);
		return this;
	};

	// キー・アップ・イベントに対応する関数をセットする
	Paper.mixin.onKeyUp = function (handler) {
		if (handler === undefined) return this._keyEventHandler.onKeyUp();
		this._keyEventHandler.onKeyUp(handler);
		return this;
	};

	// マウス・ダウン・イベントに対応する関数をセットする
	Paper.mixin.onMouseDown = function (handler) {
		if (handler === undefined) return this._mouseEventHandler.onMouseDown();
		this._mouseEventHandler.onMouseDown(handler);
		return this;
	};

	// マウス・ムーブ・イベントに対応する関数をセットする
	Paper.mixin.onMouseMove = function (handler) {
		if (handler === undefined) return this._mouseEventHandler.onMouseMove();
		this._mouseEventHandler.onMouseMove(handler);
		return this;
	};

	// マウス・アップ・イベントに対応する関数をセットする
	Paper.mixin.onMouseUp = function (handler) {
		if (handler === undefined) return this._mouseEventHandler.onMouseUp();
		this._mouseEventHandler.onMouseUp(handler);
		return this;
	};

	// マウス・クリック・イベントに対応する関数をセットする
	Paper.mixin.onMouseClick = function (handler) {
		if (handler === undefined) return this._mouseEventHandler.onMouseClick();
		this._mouseEventHandler.onMouseClick(handler);
		return this;
	};

	// マウス・ホイール・イベントに対応する関数をセットする
	Paper.mixin.onMouseWheel = function (handler) {
		if (handler === undefined) return this._mouseEventHandler.onMouseWheel();
		this._mouseEventHandler.onMouseWheel(handler);
		return this;
	};

	// マウスの横の場所を返す
	Paper.mixin.mouseX = function () {
		return this._mouseEventHandler.mouseX();
	};

	// マウスのたての場所を返す
	Paper.mixin.mouseY = function () {
		return this._mouseEventHandler.mouseY();
	};

	// マウスの左ボタンが押されているか？
	Paper.mixin.mouseLeft = function () {
		return this._mouseEventHandler.mouseLeft();
	};

	// マウスの右ボタンが押されているか？
	Paper.mixin.mouseRight = function () {
		return this._mouseEventHandler.mouseRight();
	};

	// マウスの中ボタンが押されているか？
	Paper.mixin.mouseMiddle = function () {
		return this._mouseEventHandler.mouseMiddle();
	};




	// -------------------------------------------------------------------------
	// ユーティリティ関数
	// -------------------------------------------------------------------------




	// 今のミリ秒を得る
	const getTime = (function () {
		return window.performance.now.bind(window.performance);
	}());

	// 例外を除き画面上の要素をすべて削除する（例外の要素）
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




	// -------------------------------------------------------------------------
	// ライブラリを作る
	// -------------------------------------------------------------------------




	// ライブラリとして返す
	return { Paper, getTime, removeAll };

}());
