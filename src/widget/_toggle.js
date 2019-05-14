/**~ja
 * トグル
 * @author Takuto Yanagida
 * @version 2019-05-14
 */
/**~en
 * Toggle
 * @author Takuto Yanagida
 * @version 2019-05-14
 */
class Toggle extends Widget {

	/**~ja
	 * トグル・ボタンを作る
	 * @param {string=|Array<string>} [caption_s=''] ボタンの名前
	 * @param {boolean=|Array<boolean>} [state_s=false] 現在の状態
	 */
	/**~en
	 * Make a toggle button
	 * @param {string=|Array<string>} [caption_s=''] Name(s) of button(s)
	 * @param {boolean=|Array<boolean>} [state_s=false] Current state(s)
	 */
	constructor(caption_s = '', state_s = false) {
		super();

		const cs = Array.isArray(caption_s) ? caption_s : [caption_s];
		const ss = Array.isArray(state_s) ? state_s : [state_s];

		this._value = ss.length === 1 ? ss[0] : ss;

		const buttons = [];

		for (let c of cs) {
			const b = document.createElement('a');
			b.className = '__widget __widget-button';
			b.innerText = c;
			b.onmousedown = (ev) => {
				const idx = buttons.indexOf(ev.target);
				ss[idx] = !ss[idx]
				this._value = ss.length === 1 ? ss[0] : ss;
				ev.target.classList.toggle('__widget-button-pushed');
				if (this._onPushed) this._onPushed(ss[idx], idx);
			};
			buttons.push(b);
			this._base.appendChild(b);
		}
		setTimeout(() => {
			for (let i = 0; i < cs.length; i += 1) {
				if (!ss[i]) continue;
				buttons[i].classList.add('__widget-button-pushed');
				if (this._onPushed) this._onPushed(ss[i], i);
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
	 * プッシュ・イベントに対応する関数
	 * @param {function(boolean, number)} handler 関数
	 * @return {function(boolean, number)|Toggle} 関数／このトグル
	 */
	/**~en
	 * Function handling to push events
	 * @param {function(boolean, number)} handler Function
	 * @return {function(boolean, number)|Toggle} Function, or this toggle
	 */
	onPushed(handler) {
		if (handler === undefined) return this._onPushed;
		this._onPushed = handler;
		return this;
	}

}