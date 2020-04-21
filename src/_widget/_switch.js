/**~ja
 * スイッチ
 * @author Takuto Yanagida
 * @version 2019-05-14
 */
/**~en
 * Switch
 * @author Takuto Yanagida
 * @version 2019-05-14
 */
class Switch extends Widget {

	/**~ja
	 * スイッチを作る
	 * @param {number} [num_or_names=3] ボタン数／ボタンの名前配列
	 * @param {number} [cur=0] 現在のボタン
	 */
	/**~en
	 * Make a switch
	 * @param {number} [num_or_names=3] Number of buttons, or an array of button names
	 * @param {number} [cur=0] Index of currently selected button
	 */
	constructor(num_or_names = 3, cur = 0) {
		super();
		if (Array.isArray(num_or_names) && num_or_names.length === 0) num_or_names = ['?'];

		const num = Array.isArray(num_or_names) ? num_or_names.length : num_or_names;
		const names = Array.isArray(num_or_names) ? num_or_names : null;

		this._value = (0 <= cur && cur < num) ? cur : (num - 1);

		let maxCharNum = 0;
		if (names) names.forEach(e => maxCharNum = Math.max(maxCharNum, e.length));

		const buttons = [];

		for (let i = 0; i < num; i += 1) {
			const b = document.createElement('a');
			b.className = '__widget __widget-button';
			b.innerText = (names) ? names[i] : i;
			b.style.width = `calc(${maxCharNum}rem + 16px)`;
			b.onmousedown = (ev) => {
				buttons.forEach(e => e.classList.remove('__widget-button-pushed'));
				this._value = buttons.indexOf(ev.target);
				ev.target.classList.add('__widget-button-pushed');
				if (this._onPushed) this._onPushed(this._value);
			};
			buttons.push(b);
			this._base.appendChild(b);
		}
		setTimeout(() => {
			buttons[this._value].classList.add('__widget-button-pushed');
			if (this._onPushed) this._onPushed(this._value);
		}, 100);
	}

	/**~ja
	 * 現在の値
	 * @param {boolean} val 現在の値
	 * @return {boolean|Toggle} 現在の値／このスイッチ
	 */
	/**~en
	 * Current value
	 * @param {boolean} val Current value
	 * @return {boolean|Toggle} Current value, or this switch
	 */
	value(val) {
		if (val === undefined) return this._value;
		this._value = val;
		return this;
	}

	/**~ja
	 * プッシュ・イベントに対応する関数
	 * @param {function(boolean, number)} handler 関数
	 * @return {function(boolean, number)|Toggle} 関数／このスイッチ
	 */
	/**~en
	 * Function handling to push events
	 * @param {function(boolean, number)} handler Function
	 * @return {function(boolean, number)|Toggle} Function, or this switch
	 */
	onPushed(handler) {
		if (handler === undefined) return this._onPushed;
		this._onPushed = handler;
		return this;
	}

}