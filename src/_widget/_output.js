/**~ja
 * 文字列出力
 * @author Takuto Yanagida
 * @version 2019-05-14
 */
/**~en
 * String output
 * @author Takuto Yanagida
 * @version 2019-05-14
 */
class Output extends Widget {

	/**~ja
	 * 文字列出力を作る
	 * @param {number} width 横幅
	 * @param {number=} [height=null] たて幅
	 * @param {boolean=} [nowrap=false] 折り返す？
	 */
	/**~en
	 * Make an output
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
	 * 文字列
	 * @param {string=} val 文字列
	 * @return {string|Output} 文字列／この文字列出力
	 */
	/**~en
	 * String
	 * @param {string=} val String
	 * @return {string|Output} String, or this output
	 */
	string(val) {
		if (val === undefined) return this._inner.innerText;
		this._inner.innerText = val;
		return this;
	}

}