/**~ja
 * キー操作処理
 * @author Takuto Yanagida
 * @version 2021-01-06
 */
/**~en
 * Key operation handler
 * @author Takuto Yanagida
 * @version 2021-01-06
 */
class KeyHandler {

	/**~ja
	 * キー操作処理を作る
	 * @param {Canvas} can キャンバス
	 */
	/**~en
	 * Make a key operation handler
	 * @param {Canvas} can Canvas
	 */
	constructor(can) {
		this._keys = {};
		this._onDown = null;
		this._onUp = null;

		//~ja キー・ダウン・イベントに対応する
		//~en Handle key down events
		can.addEventListener('keydown', (e) => {
			if (!this._keys[e.keyCode]) {
				if (this._onDown !== null) {
					this._onDown(String.fromCharCode(e.keyCode), e);
					e.preventDefault();
				}
				this._keys[e.keyCode] = true;
			}
		}, true);

		//~ja キー・アップ・イベントに対応する
		//~en Handle key up events
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


	//~ja 公開関数 ----------------------------------------------------------------
	//~en Public functions --------------------------------------------------------


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
	onKeyDown(handler) {
		if (handler === undefined) return this._onDown;
		this._onDown = handler;
	}

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
	onKeyUp(handler) {
		if (handler === undefined) return this._onUp;
		this._onUp = handler;
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
		return this._keys[37];
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
		return this._keys[38];
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
		return this._keys[39];
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
		return this._keys[40];
	}

}