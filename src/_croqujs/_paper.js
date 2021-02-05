/**~ja
 * 紙
 * @version 2021-02-05
 */
/**~en
 * Paper
 * @version 2021-02-05
 */
class Paper {

	/**~ja
	 * 紙を作る
	 * @constructor
	 * @param {number} width 横の大きさ
	 * @param {number} height たての大きさ
	 * @param {boolean} [isVisible=true] 画面に表示する？
	 */
	/**~en
	 * Make a paper
	 * @constructor
	 * @param {number} width width
	 * @param {number} height height
	 * @param {boolean} [isVisible=true] Whether to be visible
	 */
	constructor(width, height, isVisible = true) {
		const can = document.createElement('canvas');
		can.setAttribute('width', width || 400);
		can.setAttribute('height', height || 400);
		can.setAttribute('tabindex', 1);

		this._ctx = can.getContext('2d');
		if (!PAPER_IS_AUGMENTED) augmentPaperPrototype(this._ctx);

		//~ja 画面に表示する場合は
		//~en When displaying on the screen
		if (isVisible === true) {
			const style = document.createElement('style');
			style.innerHTML = 'body>canvas{border:0 solid lightgray;display:inline-block;touch-action:none;outline:none;}';
			document.head.appendChild(style);

			can.id = 'canvas';
			document.body.appendChild(can);
			can.focus();
		}
		CANVAS_TO_PAPER[can] = this;
		this._augment(can);
		CROQUJS.currentPaper(this);

		if (typeof STYLE !== 'undefined') STYLE.augment(this);

		// this._initZoomingFunction();
	}

	/**~ja
	 * 紙を強化する（ライブラリ内だけで使用）
	 * @private
	 * @param {DOMElement} can キャンバス要素
	 */
	/**~en
	 * Augment papers (used only in the library)
	 * @private
	 * @param {DOMElement} can Canvas element
	 */
	_augment(can) {
		this._frame = 0;
		this._fps = 60;
		this._frameLength = 60;
		this._totalFrame = 0;
		this._isAnimating = false;
		this._isGridVisible = true;

		this._keyEventHandler = new KeyHandler(can);
		this._mouseEventHandler = new MouseHandler(can);
		this._zoomHandler = new ZoomHandler(this);
		this.addEventListener = can.addEventListener.bind(can);

		can.addEventListener('keydown', (e) => {
			if (e.ctrlKey && String.fromCharCode(e.keyCode) === 'S') this.saveImage();
		}, true);
	}

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
	width(val) {
		if (val === undefined) return this.canvas.width;
		this.canvas.width = val;
		return this;
	}

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
	height(val) {
		if (val === undefined) return this.canvas.height;
		this.canvas.height = val;
		return this;
	}

	/**~ja
	 * 紙のサイズを変える
	 * @param {number} width 横の大きさ
	 * @param {number} height たての大きさ
	 * @return {Paper} この紙
	 */
	/**~en
	 * Set the size of the paper
	 * @param {number} width Width
	 * @param {number} height Height
	 * @return {Paper} This paper
	 */
	setSize(width, height) {
		this.canvas.width = width;
		this.canvas.height = height;
		return this;
	}

	/**~ja
	 * 紙を指定した色でクリアする
	 * @param {string} style スタイル（指定しなければ透明）
	 * @param {number} alpha アルファ
	 * @return {Paper} この紙
	 */
	/**~en
	 * Clear the paper in the specified color
	 * @param {string} style Style (transparent if not specified)
	 * @param {number} alpha Alpha
	 * @return {Paper} This paper
	 */
	clear(style, alpha) {
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
		return this;
	}

	/**~ja
	 * ピクセルの色を取得する
	 * @param {number} x x座標
	 * @param {number} y y座標
	 * @return {number[]} 色（RGBA）を表す配列
	 */
	/**~en
	 * Get pixel color
	 * @param {number} x x coordinate
	 * @param {number} y y coordinate
	 * @return {number[]} Array representing color (RGBA)
	 */
	getPixel(x, y) {
		return this.getImageData(x, y, 1, 1).data;
	}

	/**~ja
	 * ピクセルの色を設定する
	 * @param {number} x x座標
	 * @param {number} y y座標
	 * @param {number[]} rgba 色（RGBA）を表す配列
	 * @return {Paper} この紙
	 */
	/**~en
	 * Set pixel color
	 * @param {number} x x coordinate
	 * @param {number} y y coordinate
	 * @param {number[]} rgba Array representing color (RGB)
	 * @return {Paper} This paper
	 */
	setPixel(x, y, [r = 0, g = 0, b = 0, a = 255]) {
		this.save();
		this.strokeStyle = `rgba(${r},${g},${b},${a})`;
		this.beginPath();
		this.rect(x, y, 1, 1);
		this.stroke();
		this.restore();
		return this;
	}


	//~ja アニメーション -------------------------------------------------------
	//~en Animation ------------------------------------------------------------


	/**~ja
	 * アニメーションを始める
	 * @param {function} callback 一枚一枚の絵を書く関数
	 * @param {Array} args_array 関数に渡す引数
	 * @return {Paper} この紙
	 */
	/**~en
	 * Start animation
	 * @param {function} callback Function to draw picture one by one
	 * @param {Array} args_array Arguments to pass to the function
	 * @return {Paper} This paper
	 */
	animate(callback, args_array) {
		const startTime = now();
		let prevFrame = -1;

		const loop = () => {
			const timeSpan = now() - startTime;
			const frame = Math.floor(timeSpan / (1000.0 / this._fps)) % this._frameLength;

			if (frame !== prevFrame) {
				this._frame = frame;
				CROQUJS.currentPaper(this);
				this._zoomHandler.beforeDrawing(this);
				callback(...args_array);
				if (this.mouseMiddle() && this._isGridVisible) this.drawGrid();
				this._zoomHandler.afterDrawing(this);
				prevFrame = frame;
				this._totalFrame += 1;
			}
			if (this._isAnimating && this.canvas.parentNode !== null) {
				window.requestAnimationFrame(loop);
			}
		};
		this._isAnimating = true;
		window.requestAnimationFrame(loop);
		return this;
	}

	/**~ja
	 * アニメーションを止める
	 * @return {Paper} この紙
	 */
	/**~en
	 * Stop animation
	 * @return {Paper} This paper
	 */
	stop() {
		this._isAnimating = false;
		return this;
	}

	/**~ja
	 * フレーム
	 * @return {number} フレーム
	 */
	/**~en
	 * Frames
	 * @return {number} Frames
	 */
	frame() {
		return this._frame;
	}

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
	fps(val) {
		if (val === undefined) return this._fps;
		this._fps = val;
		return this;
	}

	/**~ja
	 * フレーム長
	 * @param {number=} val フレーム長
	 * @return {number|Paper} フレーム長／この紙
	 */
	/**~en
	 * Frame length
	 * @param {number=} val Frame length
	 * @return {number|Paper} Frame length, or this paper
	 */
	frameLength(val) {
		if (val === undefined) return this._frameLength;
		this._frameLength = val;
		return this;
	}

	/**~ja
	 * 全フレーム
	 * @return {number} 全フレーム
	 */
	/**~en
	 * Total frames
	 * @return {number} Total frames
	 */
	totalFrame() {
		return this._totalFrame;
	}


	//~ja ページ ---------------------------------------------------------------
	//~en Page -----------------------------------------------------------------


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
	makePage(pageName) {
		if (!this._pages) this._pages = {};
		this._pages[pageName] = new CROQUJS.Paper(this.width(), this.height(), false);
		return this._pages[pageName];
	}

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
	getPage(pageName) {
		if (!this._pages) return false;
		return this._pages[pageName];
	}


	//~ja 子の紙 ---------------------------------------------------------------
	//~en Child page -----------------------------------------------------------


	/**~ja
	 * 子の紙を追加する
	 * @param {Paper} paper 子の紙
	 */
	/**~en
	 * Add a child paper
	 * @param {Paper} paper Child paper
	 */
	addChild(paper) {
		if (!this._children) this._children = [];
		this._children.push(paper);
		this._mouseEventHandler.addChild(paper._mouseEventHandler);
	}

	/**~ja
	 * 子の紙を削除する
	 * @param {Paper} paper 子の紙
	 */
	/**~en
	 * Remove a child paper
	 * @param {Paper} paper Child paper
	 */
	removeChild(paper) {
		if (!this._children) return;
		this._children = this._children.filter(e => (e !== paper));
		this._mouseEventHandler.removeChild(paper._mouseEventHandler);
	}


	//~ja ユーティリティ -------------------------------------------------------
	//~en Utilities ------------------------------------------------------------


	/**~ja
	 * 定規をもらう
	 * @return {Ruler} 定規
	 */
	/**~en
	 * Get a ruler
	 * @return {Ruler} Ruler
	 */
	getRuler() {
		//@ifdef ja
		if (typeof RULER === 'undefined') throw new Error('Rulerライブラリが必要です。');
		//@endif
		//@ifdef en
		if (typeof RULER === 'undefined') throw new Error('Ruler library is needed.');
		//@endif
		if (!this._ruler) this._ruler = new RULER.Ruler(this);
		return this._ruler;
	}

	/**~ja
	 * 紙にかいた絵をファイルに保存する
	 * @param {string=} fileName ファイル名
	 * @param {string=} type ファイルの種類
	 * @return {Paper} この紙
	 */
	/**~en
	 * Save the picture drawn on the paper to a file
	 * @param {string=} fileName File name
	 * @param {string=} type File type
	 * @return {Paper} This paper
	 */
	saveImage(fileName, type) {
		const canvasToBlob = function (canvas, type) {
			const data = atob(canvas.toDataURL(type).split(',')[1]);
			const buf = new Uint8Array(data.length);

			for (let i = 0, I = data.length; i < I; i += 1) {
				buf[i] = data.charCodeAt(i);
			}
			return new Blob([buf], { type: type || 'image/png' });
		};
		const saveBlob = function (blob, fileName) {
			const a = document.createElement('a');
			a.href = window.URL.createObjectURL(blob);
			a.download = fileName;
			a.click();
		};
		saveBlob(canvasToBlob(this.canvas, type), fileName || 'default.png');
		return this;
	}


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
	gridVisible(val) {
		if (val === undefined) return this._isGridVisible;
		this._isGridVisible = val;
		return this;
	}

	/**~ja
	 * 紙にマス目をかく
	 */
	/**~en
	 * Draw grid on the paper
	 */
	drawGrid() {
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
	}

	/**~ja
	 * ホイール回転でズームするか
	 * @param {boolean=} val ホイール回転でズームするか
	 * @return {boolean|Paper} ホイール回転でズームするか／この紙
	 */
	/**~en
	 * Whether to magnify on wheel rotation
	 * @param {boolean=} val Whether to magnify on wheel rotation
	 * @return {boolean|Paper} Whether to magnify on wheel rotation, or this paper
	 */
	zoomEnabled(val) {
		if (val === undefined) return this._zoomHandler.enabled();
		this._zoomHandler.enabled(val);
		return this;
	}


	//~ja キーボード -----------------------------------------------------------
	//~en Keyboard -------------------------------------------------------------


	/**~ja
	 * キー・ダウン（キーが押された）イベントに対応する関数をセットする
	 * @param {function(string, KeyEvent)=} handler 関数
	 * @return {function(string, KeyEvent)=} 関数
	 */
	/**~en
	 * Set the function handling key down events
	 * @param {function(string, KeyEvent)=} handler Function
	 * @return {function(string, KeyEvent)=} Function
	 */
	onKeyDown(handler) {
		if (handler === undefined) return this._keyEventHandler.onKeyDown();
		this._keyEventHandler.onKeyDown(handler);
		return this;
	}

	/**~ja
	 * キー・アップ（キーが離された）イベントに対応する関数をセットする
	 * @param {function(string, KeyEvent)=} handler 関数
	 * @return {function(string, KeyEvent)=} 関数
	 */
	/**~en
	 * Set the function handling key up events
	 * @param {function(string, KeyEvent)=} handler Function
	 * @return {function(string, KeyEvent)=} Function
	 */
	onKeyUp(handler) {
		if (handler === undefined) return this._keyEventHandler.onKeyUp();
		this._keyEventHandler.onKeyUp(handler);
		return this;
	}

	/**~ja
	 * カーソル・キーの左が押されているか？
	 * @return {boolean} カーソル・キーの左が押されているか
	 */
	/**~en
	 * Whether the left arrow key is pressed
	 * @return {boolean} Whether the left arrow key is pressed
	 */
	keyArrowLeft() {
		return this._keyEventHandler.keyArrowLeft();
	}

	/**~ja
	 * カーソル・キーの上が押されているか？
	 * @return {boolean} カーソル・キーの上が押されているか
	 */
	/**~en
	 * Whether the up arrow key is pressed
	 * @return {boolean} Whether the up arrow key is pressed
	 */
	keyArrowUp() {
		return this._keyEventHandler.keyArrowUp();
	}

	/**~ja
	 * カーソル・キーの右が押されているか？
	 * @return {boolean} カーソル・キーの右が押されているか
	 */
	/**~en
	 * Whether the right arrow key is pressed
	 * @return {boolean} Whether the right arrow key is pressed
	 */
	keyArrowRight() {
		return this._keyEventHandler.keyArrowRight();
	}

	/**~ja
	 * カーソル・キーの下が押されているか？
	 * @return {boolean} カーソル・キーの下が押されているか
	 */
	/**~en
	 * Whether the down arrow key is pressed
	 * @return {boolean} Whether the down arrow key is pressed
	 */
	keyArrowDown() {
		return this._keyEventHandler.keyArrowDown();
	}


	//~ja マウス ---------------------------------------------------------------
	//~en Mouse ----------------------------------------------------------------


	/**~ja
	 * マウス・ダウン（ボタンが押された）イベントに対応する関数をセットする
	 * @param {function(number, number, MouseEvent)=} handler 関数
	 * @return {function(number, number, MouseEvent)=} 関数
	 */
	/**~en
	 * Set the function handling the mouse down event
	 * @param {function(number, number, MouseEvent)=} handler Function
	 * @return {function(number, number, MouseEvent)=} Function
	 */
	onMouseDown(handler) {
		if (handler === undefined) return this._mouseEventHandler.onMouseDown();
		this._mouseEventHandler.onMouseDown(handler);
		return this;
	}

	/**~ja
	 * マウス・ムーブ（ポインターが移動した）イベントに対応する関数をセットする
	 * @param {function(number, number, MouseEvent)=} handler 関数
	 * @return {function(number, number, MouseEvent)=} 関数
	 */
	/**~en
	 * Set the function handling the mouse move event
	 * @param {function(number, number, MouseEvent)=} handler Function
	 * @return {function(number, number, MouseEvent)=} Function
	 */
	onMouseMove(handler) {
		if (handler === undefined) return this._mouseEventHandler.onMouseMove();
		this._mouseEventHandler.onMouseMove(handler);
		return this;
	}

	/**~ja
	 * マウス・アップ（ボタンが離された）イベントに対応する関数をセットする
	 * @param {function(number, number, MouseEvent)=} handler 関数
	 * @return {function(number, number, MouseEvent)=} 関数
	 */
	/**~en
	 * Set the function handling the mouse up event
	 * @param {function(number, number, MouseEvent)=} handler Function
	 * @return {function(number, number, MouseEvent)=} Function
	 */
	onMouseUp(handler) {
		if (handler === undefined) return this._mouseEventHandler.onMouseUp();
		this._mouseEventHandler.onMouseUp(handler);
		return this;
	}

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
	onMouseClick(handler) {
		if (handler === undefined) return this._mouseEventHandler.onMouseClick();
		this._mouseEventHandler.onMouseClick(handler);
		return this;
	}

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
	onMouseWheel(handler) {
		if (handler === undefined) return this._mouseEventHandler.onMouseWheel();
		this._mouseEventHandler.onMouseWheel(handler);
		return this;
	}

	/**~ja
	 * マウスの横の場所を返す
	 * @return {number} マウスの横の場所
	 */
	/**~en
	 * Return x coordinate of the mouse
	 * @return {number} X coordinate of the mouse
	 */
	mouseX() {
		return this._mouseEventHandler.mouseX();
	}

	/**~ja
	 * マウスのたての場所を返す
	 * @return {number} マウスのたての場所
	 */
	/**~en
	 * Return y coordinate of the mouse
	 * @return {number} Y coordinate of the mouse
	 */
	mouseY() {
		return this._mouseEventHandler.mouseY();
	}

	/**~ja
	 * マウスの左ボタンが押されているか？
	 * @return {boolean} マウスの左ボタンが押されているか
	 */
	/**~en
	 * Whether the left mouse button is pressed
	 * @return {boolean} Whether the left mouse button is pressed
	 */
	mouseLeft() {
		return this._mouseEventHandler.mouseLeft();
	}

	/**~ja
	 * マウスの右ボタンが押されているか？
	 * @return {boolean} マウスの右ボタンが押されているか
	 */
	/**~en
	 * Whether the right mouse button is pressed
	 * @return {boolean} Whether the right mouse button is pressed
	 */
	mouseRight() {
		return this._mouseEventHandler.mouseRight();
	}

	/**~ja
	 * マウスの中ボタンが押されているか？
	 * @return {boolean} マウスの中ボタンが押されているか
	 */
	/**~en
	 * Whether the middle mouse button is pressed
	 * @return {boolean} Whether the middle mouse button is pressed
	 */
	mouseMiddle() {
		return this._mouseEventHandler.mouseMiddle();
	}

};

let PAPER_IS_AUGMENTED = false;

function augmentPaperPrototype(ctx) {
	PAPER_IS_AUGMENTED = true;
	const org = Object.getPrototypeOf(ctx);
	for (const name in ctx) {
		if (typeof ctx[name] === 'function') {
			Paper.prototype[name] = function (...args) { return this._ctx[name](...args); }
		} else {
			const d = Object.getOwnPropertyDescriptor(org, name);
			const nd = { configurable: d.configurable, enumerable: d.enumerable }
			if (d.get) nd['get'] = function () { return this._ctx[name]; };
			if (d.set) nd['set'] = function (v) { this._ctx[name] = v; };
			Object.defineProperty(Paper.prototype, name, nd);
		}
	}
}