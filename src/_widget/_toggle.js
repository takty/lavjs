/**~ja
 * トグル（チェックボックス）
 * @author Takuto Yanagida
 * @version 2021-02-06
 */
/**~en
 * Toggles (Check boxes)
 * @author Takuto Yanagida
 * @version 2021-02-06
 */
class Toggle extends Widget {

	/**~ja
	 * トグル・ボタンを作る
	 * @constructor
	 * @param {string=|Array<string>|number} [label_s_num=''] ボタンの名前／ボタンの数
	 * @param {boolean=|Array<boolean>} [value_s=false] 現在の状態
	 * @param {*=} [{ vertical=false, sameWidth=false }={}] オプション（たて向きにする？、同じ幅にする？）
	 */
	/**~en
	 * Make a toggle button
	 * @constructor
	 * @param {string=|Array<string>|number} [label_s_num=''] Name(s) of button(s), or number of buttons
	 * @param {boolean=|Array<boolean>} [value_s=false] Current state(s)
	 * @param {*=} [{ vertical=false, sameWidth=false }={}] Options (Whether to be vertical, Whether to be the same width)
	 */
	constructor(label_s_num = 1, value_s = false, { vertical = false, sameWidth = false } = {}) {
		super();
		this._base.classList.add('lavjs-widget-button-row');
		this._base.style.flexDirection = vertical ? 'column' : 'row';

		let labs = null;
		if (Number.isInteger(label_s_num)) {
			labs = [...Array(label_s_num).keys()];
		} else {
			labs = Array.isArray(label_s_num) ? label_s_num : [label_s_num];
		}
		this._values  = Array.isArray(value_s) ? value_s : [value_s];
		this._buttons = [];

		const num = (value_s ? Math.max(this._values.length, labs.length) : labs.length);
		this._values.length = labs.length = num;
		const maxLabLen = Math.max(...labs.map(s => s.length));

		for (const lab of labs) {
			const b = document.createElement('a');
			b.className = 'lavjs-widget lavjs-widget-button';
			b.innerText = lab;
			if (sameWidth) b.style.width = `${maxLabLen}em`;
			b.addEventListener('click', this._handleClickEvent.bind(this));
			this._buttons.push(b);
			this._base.appendChild(b);
		}
	}

	/**~ja
	 * クリック・イベントに対応する（ライブラリ内だけで使用）
	 * @private
	 * @param {MouseEvent} e マウス・イベント
	 */
	/**~en
	 * Handle mouse events (used only in the library)
	 * @private
	 * @param {MouseEvent} e Mouse event
	 */
	_handleClickEvent(e) {
		if (e.button !== 0) return;
		const i = this._buttons.indexOf(e.target);
		this._values[i] = !this._values[i]
		if (this._onClick) this._onClick(this._values[i], i);
		this._updateState();
	}

	/**~ja
	 * ボタンの状態を更新する（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Update button states (used only in the library)
	 * @private
	 */
	_updateState() {
		this._values.forEach((s, i) => {
			this._buttons[i].classList[s ? 'add' : 'remove']('active');
		});
	}

	/**~ja
	 * 現在の値
	 * @param {boolean[]} vals 現在の値
	 * @return {boolean|boolean[]|Toggle} 現在の値／このトグル
	 */
	/**~en
	 * Current value
	 * @param {boolean[]} vals Current value
	 * @return {boolean|boolean[]|Toggle} Current value, or this toggle
	 */
	value(...vals) {
		if (vals.length === 0) {
			return this._values.length === 1 ? this._values[0] : this._values.concat();
		}
		if (vals.length === 1 && Array.isArray(vals[0])) vals = vals[0];
		for (let i = 0, I = Math.min(vals.length, this._values.length); i < I; i += 1) {
			const changing = this._values[i] !== vals[i];
			this._values[i] = vals[i];
			if (changing && this._onClick) this._onClick(this._values[i], i);
		}
		this._updateState();
		return this;
	}

	/**~ja
	 * クリック・イベントに対応する関数
	 * @param {function(boolean, number)} handler 関数
	 * @param {boolean=} doFirst 最初に一度実行するか
	 * @return {function(boolean, number)|Toggle} 関数／このトグル
	 */
	/**~en
	 * Function handling to click events
	 * @param {function(boolean, number)} handler Function
	 * @param {boolean=} doFirst Whether to do it once the first time
	 * @return {function(boolean, number)|Toggle} Function, or this toggle
	 */
	onClick(handler, doFirst = false) {
		if (handler === undefined) return this._onClick;
		this._onClick = handler;
		if (doFirst) {
			setTimeout(() => {
				this._values.forEach((s, i) => this._onClick(s, i));
				this._updateState();
			}, 0);
		}
		return this;
	}

}