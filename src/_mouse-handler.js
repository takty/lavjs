// -------------------------------------------------------------------------
// マウス操作関連
// -------------------------------------------------------------------------




class MouseEventHandler {

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

		// ウィンドウにイベント・リスナーをセット
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

		// キャンバスにイベント・リスナーをセット
		if (window.ontouchstart !== undefined) {  // iOS, Android (& Chrome)
			this._canvas.addEventListener('touchstart', (e) => { this._onDownCan(e); this._onClickCan(e); }, true);
			this._canvas.addEventListener('touchmove', this._onMoveCan.bind(this), true);
			this._canvas.addEventListener('touchend', this._onUpCan.bind(this), false);
		}
		if (window.PointerEvent) {  // IE11 & Chrome
			this._canvas.addEventListener('pointerdown', this._onDownCan.bind(this), true);
			this._canvas.addEventListener('pointermove', this._onMoveCan.bind(this), true);
			this._canvas.addEventListener('pointerup', this._onUpCan.bind(this), false);
		} else {  // マウス
			this._canvas.addEventListener('mousedown', this._onDownCan.bind(this), true);
			this._canvas.addEventListener('mousemove', this._onMoveCan.bind(this), true);
			this._canvas.addEventListener('mouseup', this._onUpCan.bind(this), false);
		}
		this._canvas.addEventListener('click', this._onClickCan.bind(this));
		this._canvas.addEventListener('wheel', this._onWheelCan.bind(this));

		this._canvas.oncontextmenu = () => {
			// イベントが割り当てられている時はコンテキストメニューをキャンセル
			if (this._mouseUp !== null) return false;
			return true;
		};
	}

	removeWinListener() {
		window.removeEventListener('mousedown', this._onDownWinListener, true);
		window.removeEventListener('dragstart', this._onDownWinListener, true);
		window.removeEventListener('mousemove', this._onMoveWinListener, true);
		window.removeEventListener('drag', this._onMoveWinListener, true);
		window.removeEventListener('mouseup', this._onUpWinListener, false);
		window.removeEventListener('dragend', this._onUpWinListener, false);
		window.removeEventListener('blur', this._onBlurWinListener);
	}

	// 子を追加する
	addChild(child) {
		this._children.push(child);
	}

	// 子を削除する
	removeChild(child) {
		this._children = this._children.filter(e => (e !== child));
	}


	// --------------------------------　ウインドウから直接ボタンのイベントを受け取る


	// （ライブラリ内だけで使用）マウス・ダウン・イベントに対応する
	_onDownWin(e) {
		if (e.target !== this._canvas) {
			e.preventDefault();
			return;
		}
		const btnTbl = [1, 4, 2];
		this._btns |= btnTbl[e.button];
		this._setButtonWin(this._btns);
	}

	// （ライブラリ内だけで使用）マウス・ムーブ・イベントに対応する
	_onMoveWin(e) {
		if (e.target !== this._canvas && this._btns === 0) {
			e.preventDefault();
			return;
		}
		const whichTbl = [0, 1, 4, 2];
		this._btns = (e.buttons !== undefined) ? e.buttons : whichTbl[e.which] /* Chrome or Opera */;
		this._setButtonWin(this._btns);
	}

	// （ライブラリ内だけで使用）マウス・アップ・イベントに対応する
	_onUpWin(e) {
		const btnTbl = [1, 4, 2];
		this._btns &= ~btnTbl[e.button];
		this._setButtonWin(this._btns);
	}

	// （ライブラリ内だけで使用）どのマウス・ボタンが押されたのかを記録する
	_setButtonWin(buttons) {
		this._btnL = (buttons & 1) ? true : false;
		this._btnR = (buttons & 2) ? true : false;
		this._btnM = (buttons & 4) ? true : false;

		for (let c of this._children) {
			c._mouseButtons = buttons;
			c._setButtonWin(buttons);
		}
	}


	// --------------------------------　キャンバスからボタンのイベントを受け取る


	// （ライブラリ内だけで使用）マウス・ダウン・イベントに対応する
	_onDownCan(e) {
		this._setPosition(e);
		this._setButtonCanvas(e, true);
		if (this._onDown !== null) {
			this._onDown(this._posX, this._posY, e);
			e.preventDefault();
		}
		this._canvas.focus();
	}

	// （ライブラリ内だけで使用）マウス・ムーブ・イベントに対応する
	_onMoveCan(e) {
		this._setPosition(e);
		if (this._onMove !== null) {
			// ウィンドウ外からカーソルが入った時にボタンを検出する前にイベントが発生する問題を回避するため
			setTimeout(() => { this._onMove(this._posX, this._posY, e) }, 1);
			e.preventDefault();
		}
	}

	// （ライブラリ内だけで使用）マウス・アップ・イベントに対応する
	_onUpCan(e) {
		this._setPosition(e);
		this._setButtonCanvas(e, false);
		if (this._onUp !== null) {
			this._onUp(this._posX, this._posY, e);
			e.preventDefault();
		}
	}

	// （ライブラリ内だけで使用）クリック・イベントに対応する
	_onClickCan(e) {
		this._setPosition(e);
		if (this._onClick !== null) {
			this._onClick(this._posX, this._posY, e);
			e.preventDefault();
		}
	}

	// （ライブラリ内だけで使用）ホイール・イベントに対応する
	_onWheelCan(e) {
		if (this._onWheel !== null) {
			this._onWheel(0 < e.deltaY ? 1 : -1, e);
			e.preventDefault();
		}
	}

	// （ライブラリ内だけで使用）マウス・イベントの起こった場所（座標）を正しくして記録する
	_setPosition(e) {
		const ee = (e.clientX === undefined) ? e.changedTouches[0] /* タッチの時 */ : e /* マウスの時 */;
		const r = this._canvas.getBoundingClientRect();
		this._posX = ee.clientX - r.left;
		this._posY = ee.clientY - r.top;

		for (let c of this._children) {
			c._posX = this._posX;
			c._posY = this._posY;
		}
	}

	// （ライブラリ内だけで使用）どのマウス・ボタンが押されたのかを記録する
	_setButtonCanvas(e, val) {
		const which = (e.which === undefined) ? 0 : e.which;  // どのボタンかがわからない時（Androidタッチの時）

		// タッチ以外の処理は基本的にInputMouseButtonが担当（以下はタッチイベント関連への簡易対応のため）
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


	// --------------------------------　公開関数


	// マウス・ダウン・イベントに対応する関数をセットする
	onMouseDown(handler) {
		if (handler === undefined) return this._onDown;
		this._onDown = handler;
	}

	// マウス・ムーブ・イベントに対応する関数をセットする
	onMouseMove(handler) {
		if (handler === undefined) return this._onMove;
		this._onMove = handler;
	}

	// マウス・アップ・イベントに対応する関数をセットする
	onMouseUp(handler) {
		if (handler === undefined) return this._onUp;
		this._onUp = handler;
	}

	// マウス・クリック・イベントに対応する関数をセットする
	onMouseClick(handler) {
		if (handler === undefined) return this._onClick;
		this._onClick = handler;
	}

	// マウス・ホイール・イベントに対応する関数をセットする
	onMouseWheel(handler) {
		if (handler === undefined) return this._onWheel;
		this._onWheel = handler;
	}

	// マウスの横の場所を返す
	mouseX() {
		return this._posX;
	}

	// マウスのたての場所を返す
	mouseY() {
		return this._posY;
	}

	// マウスの左ボタンが押されているか？
	mouseLeft() {
		return this._btnL;
	}

	// マウスの右ボタンが押されているか？
	mouseRight() {
		return this._btnR;
	}

	// マウスの中ボタンが押されているか？
	mouseMiddle() {
		return this._btnM;
	}

}