/**~ja
 * チャット
 * @author Takuto Yanagida
 * @version 2021-01-20
 */
/**~en
 * Chat
 * @author Takuto Yanagida
 * @version 2021-01-20
 */
class Chat extends Widget {

	/**~ja
	 * チャットUIを作る
	 * @param {number} width 横幅
	 * @param {number=} [height=null] たて幅
	 */
	/**~en
	 * Make a chat UI
	 * @param {number} width Width
	 * @param {number=} [height=null] Height
	 */
	constructor(width, height = null) {
		super(width, height);
		this._base.style.flexDirection = 'column';

		this._message = document.createElement('div');
		this._message.className = '__widget-chat-message';

		this._input = document.createElement('input');
		this._input.className = '__widget-chat-input';
		this._input.disabled = true;

		this._base.appendChild(this._message);
		this._base.appendChild(this._input);
	}

	/**~ja
	 * 入力を有効にする（ライブラリ内だけで使用）
	 * @private
	 * @param {boolean} flag 有効かどうか
	 */
	/**~en
	 *　Set input enabled (used only in the library)
	 * @param {boolean} flag Whether or not enabled
	 */
	_setInputEnabled(flag) {
		if (flag) {
			this._input.disabled = false;
			this._input.focus();
			this._input.value = '';
		} else {
			this._input.value = '';
			this._input.blur();
			this._input.disabled = true;
		}
	}

	/**~ja
	 * 表示する
	 * @param {*=} args 表示する内容
	 * @return {Chat} このチャットUI
	 */
	/**~en
	 * Print
	 * @param {*=} args Contents to be printed
	 * @return {Chat} This output
	 */
	print(...args) {
		const str = args.map(e => e.toString()).join(' ') + '\n';
		const m = document.createElement('div');
		m.innerText = str;
		this._message.appendChild(m);
	}

	/**~ja
	 * 入力させる
	 * @return {string} 入力された文字列
	 */
	/**~en
	 * Input
	 * @return {string} Input string
	 */
	input() {
		this._setInputEnabled(true);
		return new Promise(res => {
			this._input.addEventListener('change', () => {
				res(this._input.value);
				this._setInputEnabled(false);
			}, { once: true });
		});
	}

	/**~ja
	 * 動作を停止する
	 * @param {number} seconds 秒数
	 * @return {Promise}
	 */
	/**~en
	 * Stop operation
	 * @param {number} seconds Second
	 * @return {Promise}
	 */
	sleep(seconds) {
		return new Promise(res => setTimeout(res, seconds * 1000));
	}

}