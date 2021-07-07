/**~ja
 * スイッチ（ラジオ・ボタン）
 * @author Takuto Yanagida
 * @version 2021-05-21
 */
/**~en
 * Switches (Radio buttons)
 * @author Takuto Yanagida
 * @version 2021-05-21
 */
class Switch extends Widget {

	/**~ja
	 * スイッチを作る
	 * @constructor
	 * @param {string|string[]|number=} [label_s_num=''] ボタンの名前／ボタンの数
	 * @param {number=} [value=0] 今押されているボタンの番号
	 * @param {object} [opts={}] オプション
	 * @param {boolean=} [opts.vertical=false] たて向きにする？
	 * @param {boolean=} [opts.sameWidth=false] 同じ幅にする？
	 */
	/**~en
	 * Make a switch
	 * @constructor
	 * @param {string|string[]|number=} [label_s_num=''] Name(s) of button(s), or number of buttons
	 * @param {number=} [value=0] Index of currently selected button
	 * @param {object} [opts={}] Options
	 * @param {boolean=} [opts.vertical=false] Whether to be vertical
	 * @param {boolean=} [opts.sameWidth=false] Whether to be the same width
	 */
	constructor(label_s_num = 2, value = 0, opts = {}) {
		const { vertical = false, sameWidth = false } = opts;
		super();
		this._base.classList.add('lavjs-widget-button-row');
		this._base.style.flexDirection = vertical ? 'column' : 'row';

		let labs = null;
		if (Number.isInteger(label_s_num)) {
			labs = [...Array(label_s_num).keys()];
		} else {
			labs = Array.isArray(label_s_num) ? label_s_num : [label_s_num];
		}
		this._value   = (0 <= value && value < labs.length) ? value : (labs.length - 1);
		this._buttons = [];

		const maxLabLen = Math.max(...labs.map(s => s.length));

		for (const lab of labs) {
			const b = document.createElement('a');
			b.className = 'lavjs-widget lavjs-widget-button';
			b.innerText = '' + lab;
			if (sameWidth) b.style.width = `${maxLabLen}em`;
			b.addEventListener('click', this._handleClickEvent.bind(this));
			this._buttons.push(b);
			this._base.appendChild(b);
		}
		this._buttons[this._value].classList.add('active');
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
		this._value = this._buttons.indexOf(e.target);
		if (this._onClick) this._onClick(this._value);
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
		for (const b of this._buttons) b.classList.remove('active');
		this._buttons[this._value].classList.add('active');
	}

	/**~ja
	 * 現在の値
	 * @param {number} val 現在の値
	 * @return {number|Switch} 現在の値／このスイッチ
	 */
	/**~en
	 * Current value
	 * @param {number} val Current value
	 * @return {number|Switch} Current value, or this switch
	 */
	value(val) {
		if (val === undefined) return this._value;
		const changing = this._value !== val;
		this._value = val;
		if (changing && this._onClick) this._onClick(this._value);
		this._updateState();
		return this;
	}

	/**~ja
	 * クリック・イベントに対応する関数
	 * @param {function(number):void} handler 関数
	 * @param {boolean=} doFirst 最初に一度実行するか
	 * @return {function(number):void|Switch} 関数／このスイッチ
	 */
	/**~en
	 * Function handling to click events
	 * @param {function(number):void} handler Function
	 * @param {boolean=} doFirst Whether to do it once the first time
	 * @return {function(number):void|Switch} Function, or this switch
	 */
	onClick(handler, doFirst = false) {
		if (handler === undefined) return this._onClick;
		this._onClick = handler;
		if (doFirst) {
			setTimeout(() => {
				this._onClick(this._value);
				this._updateState();
			}, 0);
		}
		return this;
	}

}