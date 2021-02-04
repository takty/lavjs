/**~ja
 * チャット
 * @author Takuto Yanagida
 * @version 2021-02-04
 */
/**~en
 * Chat
 * @author Takuto Yanagida
 * @version 2021-02-04
 */
class Chat extends Widget {

	/**~ja
	 * チャットUIを作る
	 * @param {number} width 横幅
	 * @param {number=} [height=null] たて幅
	 * @param {*=} [{ startTag='[', endTag=']' }] オプション（開始タグ、終了タグ）
	 */
	/**~en
	 * Make a chat UI
	 * @param {number} width Width
	 * @param {number=} [height=null] Height
	 * @param {*=} [{ startTag='[', endTag=']' }] Options (Start tag, End tag)
	 */
	constructor(width, height = null, { startTag = '[', endTag = ']' } = {}) {
		super(width, height);
		this._base.style.flexDirection = 'column';

		this._startTag = startTag;
		this._endTag   = endTag;

		this._message = document.createElement('div');
		this._message.className = '__widget-chat-message';

		this._hr = document.createElement('hr');
		this._hr.className = '__widget-chat-hr';

		this._prompt = document.createElement('div');
		this._prompt.className = '__widget-chat-prompt';

		this._input = document.createElement('input');
		this._input.className = '__widget-chat-input';
		this._input.disabled = true;

		this._base.appendChild(this._message);
		this._base.appendChild(this._hr);
		this._base.appendChild(this._prompt);
		this._base.appendChild(this._input);
	}

	/**~ja
	 * 入力を有効にする（ライブラリ内だけで使用）
	 * @private
	 * @param {boolean} flag 有効かどうか
	 */
	/**~en
	 * Set input enabled (used only in the library)
	 * @private
	 * @param {boolean} flag Whether or not enabled
	 */
	_setInputEnabled(flag) {
		if (flag) {
			this._input.value = '';
			this._input.style.display = 'block';
			this._input.disabled = false;
			this._input.focus();
		} else {
			this._input.blur();
			this._input.disabled = true;
			this._input.style.display = 'none';
			this._input.value = '';
			this._prompt.innerText = '';
			this._hr.style.display = 'none';
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
		const str = Chat.escHtml(args.map(e => e.toString()).join(' '));
		const m = document.createElement('div');
		m.innerHTML = str;
		this._message.appendChild(m);
		this._message.scrollTop = this._message.scrollHeight;
	}

	/**~ja
	 * 入力させる
	 * @param {*=} prompt プロンプト
	 * @return {string} 入力された文字列
	 */
	/**~en
	 * Input
	 * @param {*=} prompt Prompt
	 * @return {string} Input string
	 */
	input(...prompt) {
		const str = prompt.map(e => e.toString()).join(' ');
		this._setInputEnabled(true);
		this._setPrompt(str);
		this._hr.style.display = prompt.length ? 'block' : 'none';
		this._message.scrollTop = this._message.scrollHeight;
		return new Promise(res => {
			const handler = (e) => {
				if (e.code !== 'Enter') return;
				res(this._input.value);
				this._setInputEnabled(false);
				this._input.removeEventListener('keydown', handler);
			}
			this._input.addEventListener('keydown', handler);
		});
	}


	/**~ja
	 * プロンプトをセットする（ライブラリ内だけで使用）
	 * @private
	 * @param {string} str 文字列
	 */
	/**~en
	 * Set prompt (used only in the library)
	 * @private
	 * @param {string} str String
	 */
	_setPrompt(str) {
		if (str === '') {
			this._prompt.innerHTML = '';
			return;
		}
		const escRe = str => str.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');

		const sTag = escRe(Chat.escHtml(this._startTag));
		const eTag = escRe(Chat.escHtml(this._endTag));
		const re = new RegExp(`(${sTag})(.*?)(${eTag})`, 'gm');
		str = Chat.escHtml(str);
		str = str.replace(re, (m, a1, a2, a3) => `${a1}<a data-str="${a2}">${a2}</a>${a3}`);
		this._prompt.innerHTML = str;
		const as = this._prompt.getElementsByTagName('a');
		for (const a of as) {
			a.addEventListener('click', e => {
				this._input.value = e.target.dataset.str;
				this._input.focus();
			});
		}
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

Chat.escHtml = str => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(' ', '&ensp;');