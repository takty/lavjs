/**~ja
 * ウィジェット共通
 * @author Takuto Yanagida
 * @version 2021-02-04
 */
/**~en
 * Common widget
 * @author Takuto Yanagida
 * @version 2021-02-04
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
		this._base.className = 'lavjs-widget lavjs-widget-base';
		if (width !== null) {
			this._base.style.width = width + 'px';
			this._base.style.minWidth = width + 'px';
		}
		if (height !== null) {
			this._base.style.height = height + 'px';
		}
		document.body.appendChild(this._base);

		this._moving = false;
		this._base.addEventListener('mousedown', e => {
			if (e.button !== 1) return;
			e.preventDefault();
			if (this._base.style.position !== 'absolute') {
				const x = this._base.offsetLeft;
				const y = this._base.offsetTop;
				this._base.style.position = 'absolute';
				this._base.style.left = x + 'px';
				this._base.style.top  = y + 'px';
				this._base.style.zIndex = 9999;
			}
			this._moving = true;
		});
		this._base.addEventListener('mousemove', e => {
			if (!this._moving) return;
			const x = parseInt(this._base.style.left, 10) + e.movementX;
			const y = parseInt(this._base.style.top,  10) + e.movementY;
			this._base.style.left = x + 'px';
			this._base.style.top  = y + 'px';
		});
		this._base.addEventListener('mouseup', e => {
			if (e.button !== 1) return;
			e.preventDefault();
			this._moving = false;
			this._base.style.zIndex = null;
		});
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