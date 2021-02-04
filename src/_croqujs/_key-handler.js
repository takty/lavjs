/**~ja
 * キー操作処理
 * @author Takuto Yanagida
 * @version 2021-02-04
 */
/**~en
 * Key operation handler
 * @author Takuto Yanagida
 * @version 2021-02-04
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

		//~ja キー・ダウン（キーが押された）イベントに対応する
		//~en Handle key down events
		can.addEventListener('keydown', (e) => {
			if (!this._keys[e.key]) {
				if (this._onDown !== null) {
					this._onDown(e.key, e);
					e.preventDefault();
				}
				this._keys[e.key] = true;
			}
		}, true);

		//~ja キー・アップ（キーが離された）イベントに対応する
		//~en Handle key up events
		can.addEventListener('keyup', (e) => {
			if (this._keys[e.key]) {
				if (this._onUp !== null) {
					this._onUp(e.key, e);
					e.preventDefault();
				}
				this._keys[e.key] = false;
			}
		}, true);
	}


	//~ja 公開関数 ----------------------------------------------------------------
	//~en Public functions --------------------------------------------------------


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
		if (handler === undefined) return this._onDown;
		this._onDown = handler;
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
		return this._keys['ArrowLeft'];
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
		return this._keys['ArrowUp'];
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
		return this._keys['ArrowRight'];
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
		return this._keys['ArrowDown'];
	}

}