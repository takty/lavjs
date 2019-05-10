// -------------------------------------------------------------------------
// キー操作関連
// -------------------------------------------------------------------------




class KeyEventHandler {

	constructor(can) {
		this._keys = {};
		this._onDown = null;
		this._onUp = null;

		// キー・ダウン・イベントに対応する
		can.addEventListener('keydown', (e) => {
			if (!this._keys[e.keyCode]) {
				if (this._onDown !== null) {
					this._onDown(String.fromCharCode(e.keyCode), e);
					e.preventDefault();
				}
				this._keys[e.keyCode] = true;
			}
		}, true);

		// キー・アップ・イベントに対応する
		can.addEventListener('keyup', (e) => {
			if (this._keys[e.keyCode]) {
				if (this._onUp !== null) {
					this._onUp(String.fromCharCode(e.keyCode), e);
					e.preventDefault();
				}
				this._keys[e.keyCode] = false;
			}
		}, true);
	}


	// --------------------------------　公開関数


	// キー・ダウン・イベントに対応する関数をセットする
	onKeyDown(handler) {
		if (handler === undefined) return this._onDown;
		this._onDown = handler;
	}

	// キー・アップ・イベントに対応する関数をセットする
	onKeyUp(handler) {
		if (handler === undefined) return this._onUp;
		this._onUp = handler;
	}

}