/**~ja
 * ウィジェット共通
 * @author Takuto Yanagida
 * @version 2021-02-01
 */
/**~en
 * Common widget
 * @author Takuto Yanagida
 * @version 2021-02-01
 */
class Widget {

	/**~ja
	 * ウィジェットを作る
	 * @param {number=} [width=null] 横幅
	 * @param {number=} [height=null] たて幅
	 */
	/**~en
	 * Make a widget
	 * @param {number=} [width=null] Width
	 * @param {number=} [height=null] Height
	 */
	constructor(width = null, height = null) {
		ensureBaseStyle();
		this._base = document.createElement('div');
		this._base.className = '__widget __widget-base';
		if (width !== null) {
			this._base.style.width = width + 'px';
		}
		if (height !== null) {
			this._base.style.height = height + 'px';
		}
		document.body.appendChild(this._base);
	}

	/**~ja
	 * DOM要素を返す
	 * @return {domElement} DOM要素
	 */
	/**~en
	 * Return the DOM element
	 * @return {domElement} DOM element
	 */
	domElement() {
		return this._base;
	}

	/**~ja
	 * 横幅をフルにするかどうかをセットする
	 * @param {boolean} flag 横幅をフルにするかどうか
	 */
	/**~en
	 * Set whether to make the width full
	 * @param {boolean} flag Whether to make the width full
	 */
	setFullWidth(flag) {
		this._base.style.flexBasis = flag ? '100%' : 'auto';
	}

	/**~ja
	 * 表示するかどうかをセットする
	 * @param {boolean} flag 表示するかどうか
	 */
	/**~en
	 * Set whether to display
	 * @param {boolean} flag Whether to display
	 */
	setVisible(flag) {
		this._base.style.display = flag ? '' : 'none';
	}

}