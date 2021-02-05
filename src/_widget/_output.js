/**~ja
 * 行出力
 * @author Takuto Yanagida
 * @version 2021-02-02
 */
/**~en
 * Line output
 * @author Takuto Yanagida
 * @version 2021-02-02
 */
class Output extends Widget {

	/**~ja
	 * 行出力を作る
	 * @constructor
	 * @param {number} width 横幅
	 * @param {number=} [height=null] たて幅
	 * @param {*=} [{ nowrap=false }] オプション（折り返す？）
	 */
	/**~en
	 * Make a line output
	 * @constructor
	 * @param {number} width Width
	 * @param {number=} [height=null] Height
	 * @param {*=} [{ nowrap=false }] Options (Whether to wrap)
	 */
	constructor(width, height = null, { nowrap = false } = {}) {
		super(width, height);
		this._inner = document.createElement('div');
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
	 * @param {*=} vals 現在の値
	 * @return {string|Output} 現在の値／この出力
	 */
	/**~en
	 * Current value
	 * @param {*=} vals Current value
	 * @return {string|Output} String, or this output
	 */
	value(...vals) {
		if (vals.length === 0) return this._inner.innerText;
		const str = vals.map(e => e.toString()).join(' ');
		this._inner.innerText = str;
		return this;
	}

}