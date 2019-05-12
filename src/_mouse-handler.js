/**~ja
 * マウス操作処理
 * @author Takuto Yanagida
 * @version 2019-05-12
 */
/**~en
 * Mouse operation handler
 * @author Takuto Yanagida
 * @version 2019-05-12
 */
class MouseHandler {

	/**~ja
	 * マウス操作処理を作る
	 * @param {Canvas} can キャンバス
	 */
	/**~en
	 * Make a mouse operation handler
	 * @param {Canvas} can Canvas
	 */
	constructor(can) {
		this._canvas = can;
		this._children = [];

		this._posX = 0;
		this._posY = 0;
		this._btnL = false;
		this._btnR = false;
		this._btnM = false;
		this._btns = 0;

		this._onDown = null;
		this._onMove = null;
		this._onUp = null;
		this._onClick = null;
		this._onWheel = null;

		//~ja ウィンドウにイベント・リスナーをセット
		//~en Set event listener in window
		this._onDownWinListener = this._onDownWin.bind(this);
		this._onMoveWinListener = this._onMoveWin.bind(this);
		this._onUpWinListener = this._onUpWin.bind(this);
		this._onBlurWinListener = () => { this._btns = 0; };

		window.addEventListener('mousedown', this._onDownWinListener, true);
		window.addEventListener('dragstart', this._onDownWinListener, true);
		window.addEventListener('mousemove', this._onMoveWinListener, true);
		window.addEventListener('drag', this._onMoveWinListener, true);
		window.addEventListener('mouseup', this._onUpWinListener, false);
		window.addEventListener('dragend', this._onUpWinListener, false);
		window.addEventListener('blur', this._onBlurWinListener);

		//~ja キャンバスにイベント・リスナーをセット
		//~en Set event listener in canvas
		if (window.ontouchstart !== undefined) {  // iOS, Android (& Chrome)
			this._canvas.addEventListener('touchstart', (e) => { this._onDownCan(e); this._onClickCan(e); }, true);
			this._canvas.addEventListener('touchmove', this._onMoveCan.bind(this), true);
			this._canvas.addEventListener('touchend', this._onUpCan.bind(this), false);
		}
		if (window.PointerEvent) {  // IE11 & Chrome
			this._canvas.addEventListener('pointerdown', this._onDownCan.bind(this), true);
			this._canvas.addEventListener('pointermove', this._onMoveCan.bind(this), true);
			this._canvas.addEventListener('pointerup', this._onUpCan.bind(this), false);
		} else {  // Mouse
			this._canvas.addEventListener('mousedown', this._onDownCan.bind(this), true);
			this._canvas.addEventListener('mousemove', this._onMoveCan.bind(this), true);
			this._canvas.addEventListener('mouseup', this._onUpCan.bind(this), false);
		}
		this._canvas.addEventListener('click', this._onClickCan.bind(this));
		this._canvas.addEventListener('wheel', this._onWheelCan.bind(this));

		this._canvas.oncontextmenu = () => {
			//~ja イベントが割り当てられている時はコンテキストメニューをキャンセル
			//~en Cancel context menu when event is assigned
			if (this._mouseUp !== null) return false;
			return true;
		};
	}

	/**~ja
	 * イベント・リスナーを削除する
	 */
	/**~en
	 * Remove event listeners
	 */
	removeWinListener() {
		window.removeEventListener('mousedown', this._onDownWinListener, true);
		window.removeEventListener('dragstart', this._onDownWinListener, true);
		window.removeEventListener('mousemove', this._onMoveWinListener, true);
		window.removeEventListener('drag', this._onMoveWinListener, true);
		window.removeEventListener('mouseup', this._onUpWinListener, false);
		window.removeEventListener('dragend', this._onUpWinListener, false);
		window.removeEventListener('blur', this._onBlurWinListener);
	}

	/**~ja
	 * 子を追加する
	 * @param {MouseHandler} child 子
	 */
	/**~en
	 * Add a child
	 * @param {MouseHandler} child Child
	 */
	addChild(child) {
		this._children.push(child);
	}

	/**~ja
	 * 子を削除する
	 * @param {MouseHandler} child 子
	 */
	/**~en
	 * Remove a child
	 * @param {MouseHandler} child Child
	 */
	removeChild(child) {
		this._children = this._children.filter(e => (e !== child));
	}


	//~ja ウインドウから直接ボタンのイベントを受け取る ----------------------------
	//~en Receive button events directly from the window --------------------------


	/**~ja
	 * マウス・ダウン・イベントに対応する（ライブラリ内だけで使用）
	 * @private
	 * @param {MouseEvent} e イベント
	 */
	/**~en
	 * Respond to mouse down events (used only in the library)
	 * @private
	 * @param {MouseEvent} e Event
	 */
	_onDownWin(e) {
		if (e.target !== this._canvas) {
			e.preventDefault();
			return;
		}
		const btnTbl = [1, 4, 2];
		this._btns |= btnTbl[e.button];
		this._setButtonWin(this._btns);
	}

	/**~ja
	 * マウス・ムーブ・イベントに対応する（ライブラリ内だけで使用）
	 * @private
	 * @param {MouseEvent} e イベント
	 */
	/**~en
	 * Respond to mouse move events (used only in the library)
	 * @private
	 * @param {MouseEvent} e Event
	 */
	_onMoveWin(e) {
		if (e.target !== this._canvas && this._btns === 0) {
			e.preventDefault();
			return;
		}
		const whichTbl = [0, 1, 4, 2];
		this._btns = (e.buttons !== undefined) ? e.buttons : whichTbl[e.which] /* Chrome or Opera */;
		this._setButtonWin(this._btns);
	}

	/**~ja
	 * マウス・アップ・イベントに対応する（ライブラリ内だけで使用）
	 * @private
	 * @param {MouseEvent} e イベント
	 */
	/**~en
	 * Respond to mouse up events (used only in the library)
	 * @private
	 * @param {MouseEvent} e Event
	 */
	_onUpWin(e) {
		const btnTbl = [1, 4, 2];
		this._btns &= ~btnTbl[e.button];
		this._setButtonWin(this._btns);
	}

	/**~ja
	 * どのマウス・ボタンが押されたのかを記録する（ライブラリ内だけで使用）
	 * @private
	 * @param {number} buttons ボタン
	 */
	/**~en
	 * Record which mouse button was pressed (used only in the library)
	 * @private
	 * @param {number} buttons Buttons
	 */
	_setButtonWin(buttons) {
		this._btnL = (buttons & 1) ? true : false;
		this._btnR = (buttons & 2) ? true : false;
		this._btnM = (buttons & 4) ? true : false;

		for (let c of this._children) {
			c._mouseButtons = buttons;
			c._setButtonWin(buttons);
		}
	}


	//~ja キャンバスからボタンのイベントを受け取る --------------------------------
	//~en Receive button events from the canvas -----------------------------------


	/**~ja
	 * マウス・ダウン・イベントに対応する（ライブラリ内だけで使用）
	 * @private
	 * @param {MouseEvent} e イベント
	 */
	/**~en
	 * Respond to mouse down events (used only in the library)
	 * @private
	 * @param {MouseEvent} e Event
	 */
	_onDownCan(e) {
		this._setPosition(e);
		this._setButtonCanvas(e, true);
		if (this._onDown !== null) {
			this._onDown(this._posX, this._posY, e);
			e.preventDefault();
		}
		this._canvas.focus();
	}

	/**~ja
	 * マウス・ムーブ・イベントに対応する（ライブラリ内だけで使用）
	 * @private
	 * @param {MouseEvent} e イベント
	 */
	/**~en
	 * Respond to mouse move events (used only in the library)
	 * @private
	 * @param {MouseEvent} e Event
	 */
	_onMoveCan(e) {
		this._setPosition(e);
		if (this._onMove !== null) {
			//~ja ウィンドウ外からカーソルが入った時にボタンを検出する前にイベントが発生する問題を回避するため
			//~en To avoid an event that occurs before the button is detected when the cursor enters from outside the window
			setTimeout(() => { this._onMove(this._posX, this._posY, e) }, 1);
			e.preventDefault();
		}
	}

	/**~ja
	 * マウス・アップ・イベントに対応する（ライブラリ内だけで使用）
	 * @private
	 * @param {MouseEvent} e イベント
	 */
	/**~en
	 * Respond to mouse up events (used only in the library)
	 * @private
	 * @param {MouseEvent} e Event
	 */
	_onUpCan(e) {
		this._setPosition(e);
		this._setButtonCanvas(e, false);
		if (this._onUp !== null) {
			this._onUp(this._posX, this._posY, e);
			e.preventDefault();
		}
	}

	/**~ja
	 * クリック・イベントに対応する（ライブラリ内だけで使用）
	 * @private
	 * @param {MouseEvent} e イベント
	 */
	/**~en
	 * Respond to click events (used only in the library)
	 * @private
	 * @param {MouseEvent} e Event
	 */
	_onClickCan(e) {
		this._setPosition(e);
		if (this._onClick !== null) {
			this._onClick(this._posX, this._posY, e);
			e.preventDefault();
		}
	}

	/**~ja
	 * ホイール・イベントに対応する（ライブラリ内だけで使用）
	 * @private
	 * @param {WheelEvent} e イベント
	 */
	/**~en
	 * Respond to wheel events (used only in the library)
	 * @private
	 * @param {WheelEvent} e Event
	 */
	_onWheelCan(e) {
		if (this._onWheel !== null) {
			this._onWheel(0 < e.deltaY ? 1 : -1, e);
			e.preventDefault();
		}
	}

	/**~ja
	 * マウス・イベントの起こった場所（座標）を正しくして記録する（ライブラリ内だけで使用）
	 * @private
	 * @param {MouseEvent} e イベント
	 */
	/**~en
	 * Correctly record where the mouse event happened (coordinates) (used only in the library)
	 * @private
	 * @param {MouseEvent} e Event
	 */
	_setPosition(e) {
		//~ja タッチの時／マウスの時
		//~en When touch, or when mouse
		const ee = (e.clientX === undefined) ? e.changedTouches[0] : e;
		const r = this._canvas.getBoundingClientRect();
		this._posX = ee.clientX - r.left;
		this._posY = ee.clientY - r.top;

		for (let c of this._children) {
			c._posX = this._posX;
			c._posY = this._posY;
		}
	}

	/**~ja
	 * どのマウス・ボタンが押されたのかを記録する（ライブラリ内だけで使用）
	 * @private
	 * @param {MouseEvent} e イベント
	 * @param {boolean} val 状態
	 */
	/**~en
	 * Record which mouse button was pressed (used only in the library)
	 * @private
	 * @param {MouseEvent} e Event
	 * @param {boolean} val State
	 */
	_setButtonCanvas(e, val) {
		//~ja どのボタンかがわからない時（Androidタッチの時）
		//~en When it is not known which button (when touch on Android)
		const which = (e.which === undefined) ? 0 : e.which;

		//~ja タッチ以外の処理は基本的にInputMouseButtonが担当（以下はタッチイベント関連への簡易対応のため）
		//~en Basically, the InputMouseButton is in charge of processing other than touch (the following is for easy correspondence to touch event related)
		switch (which) {
			case 0:
			case 1: this._btnL = val; break;
			case 2: this._btnM = val; break;
			case 3: this._btnR = val; break;
		}
		for (let c of this._children) {
			c._setButtonCanvas(e, val);
		}
	}


	//~ja 公開関数 ----------------------------------------------------------------
	//~en Public functions --------------------------------------------------------


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
	onMouseDown(handler) {
		if (handler === undefined) return this._onDown;
		this._onDown = handler;
	}

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
	onMouseMove(handler) {
		if (handler === undefined) return this._onMove;
		this._onMove = handler;
	}

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
	onMouseUp(handler) {
		if (handler === undefined) return this._onUp;
		this._onUp = handler;
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
		if (handler === undefined) return this._onClick;
		this._onClick = handler;
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
		if (handler === undefined) return this._onWheel;
		this._onWheel = handler;
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
		return this._posX;
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
		return this._posY;
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
		return this._btnL;
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
		return this._btnR;
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
		return this._btnM;
	}

}