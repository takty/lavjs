/**~ja
 * 行出力
 * @author Takuto Yanagida
 * @version 2021-02-01
 */
/**~en
 * Line output
 * @author Takuto Yanagida
 * @version 2021-02-01
 */
class Output extends Widget {

	/**~ja
	 * 行出力を作る
	 * @param {number} width 横幅
	 * @param {number=} [height=null] たて幅
	 * @param {boolean=} [nowrap=false] 折り返す？
	 */
	/**~en
	 * Make a line output
	 * @param {number} width Width
	 * @param {number=} [height=null] Height
	 * @param {boolean=} [nowrap=false] Whether to wrap
	 */
	constructor(width, height = null, nowrap = false) {
		super(width, height);

		this._inner = document.createElement('div');
		this._inner.className = '__widget __widget-output-inner';
		if (nowrap) {
			this._inner.style.lineHeight = 1;
		} else {
			this._inner.style.whiteSpace = 'normal';
		}
		this._inner.style.overflow = 'hidden';
		this._base.appendChild(this._inner);
	}

	/**~ja
	 * 現在の値
	 * @param {*=} val 現在の値
	 * @return {string|Output} 現在の値／この出力
	 */
	/**~en
	 * Current value
	 * @param {*=} val Current value
	 * @return {string|Output} String, or this output
	 */
	value(val) {
		if (val === undefined) return this._inner.innerText;
		this._inner.innerText = val.toString();
		return this;
	}

}