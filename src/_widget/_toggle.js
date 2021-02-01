/**~ja
 * トグル
 * @author Takuto Yanagida
 * @version 2021-01-29
 */
/**~en
 * Toggle
 * @author Takuto Yanagida
 * @version 2021-01-29
 */
class Toggle extends Widget {

	/**~ja
	 * トグル・ボタンを作る
	 * @param {string=|Array<string>} [caption_s=''] ボタンの名前
	 * @param {boolean=|Array<boolean>} [state_s=false] 現在の状態
	 * @param {*} [{ horizontal = false }={}] オプション（横向きにする？）
	 */
	/**~en
	 * Make a toggle button
	 * @param {string=|Array<string>} [caption_s=''] Name(s) of button(s)
	 * @param {boolean=|Array<boolean>} [state_s=false] Current state(s)
	 * @param {*} [{ horizontal = false }={}] Options (Whether to be horizontal)
	 */
	constructor(caption_s = '', state_s = false, { horizontal = true } = {}) {
		super();
		this._base.classList.add('__widget-button-array');
		this._base.style.flexDirection = horizontal ? 'row' : 'column';

		const cs = Array.isArray(caption_s) ? caption_s : [caption_s];
		const ss = Array.isArray(state_s)   ? state_s   : [state_s];

		this._value = ss.length === 1 ? ss[0] : ss;

		const buttons = [];

		const listener = (ev) => {
			const idx = buttons.indexOf(ev.target);
			ss[idx] = !ss[idx]
			this._value = ss.length === 1 ? ss[0] : ss;
			ev.target.classList.toggle('__widget-button-pushed');
			if (this._onClick) this._onClick(ss[idx], idx);
		};

		for (let c of cs) {
			const b = document.createElement('a');
			b.className = '__widget __widget-button';
			b.innerText = c;
			b.addEventListener('click', listener);
			buttons.push(b);
			this._base.appendChild(b);
		}
		setTimeout(() => {
			for (let i = 0; i < cs.length; i += 1) {
				if (!ss[i]) continue;
				buttons[i].classList.add('__widget-button-pushed');
				if (this._onClick) this._onClick(ss[i], i);
			}
		}, 100);
	}

	/**~ja
	 * 現在の値
	 * @param {boolean} val 現在の値
	 * @return {boolean|Toggle} 現在の値／このトグル
	 */
	/**~en
	 * Current value
	 * @param {boolean} val Current value
	 * @return {boolean|Toggle} Current value, or this toggle
	 */
	value(val) {
		if (val === undefined) return this._value;
		this._value = val;
		return this;
	}

	/**~ja
	 * クリック・イベントに対応する関数
	 * @param {function(boolean, number)} handler 関数
	 * @return {function(boolean, number)|Toggle} 関数／このトグル
	 */
	/**~en
	 * Function handling to click events
	 * @param {function(boolean, number)} handler Function
	 * @return {function(boolean, number)|Toggle} Function, or this toggle
	 */
	onClick(handler) {
		if (handler === undefined) return this._onClick;
		this._onClick = handler;
		return this;
	}

}