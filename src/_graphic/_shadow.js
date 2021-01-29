/**~ja
 * 影
 * @version 2020-12-17
 */
/**~en
 * Shadow
 * @version 2020-12-17
 */
class Shadow {

	/**~ja
	 * 影を作る
	 * @param {Shadow=} base 元になる影
	 */
	/**~en
	 * Make a shadow
	 * @param {Shadow=} base Original shadow
	 */
	constructor(shadow) {
		this._blur    = shadow ? shadow._blur    : 0;
		this._color   = shadow ? shadow._color   : 0;
		this._offsetX = shadow ? shadow._offsetX : 0;
		this._offsetY = shadow ? shadow._offsetY : 0;
	}

	/**~ja
	 * 設定を配列でもらう
	 * @return {Array} 設定
	 */
	/**~en
	 * Get the setting as an array
	 * @return {Array} Setting
	 */
	get() {
		return [this._blur, this._color, this._offsetX, this._offsetY];
	}

	/**~ja
	 * 設定する
	 * @param {?number} blur ぼかし量
	 * @param {?string} color 色
	 * @param {?number} x 影のずれx
	 * @param {?number} y 影のずれy
	 */
	/**~en
	 * Set
	 * @param {?number} blur Blur amount
	 * @param {?string} color Color
	 * @param {?number} x Shadow offset x
	 * @param {?number} y Shadow offset y
	 */
	set(blur, color, x, y) {
		//~ja 値がセットされているか!=でチェック
		//~en Check if the value is set with !=
		if (blur  != null) this._blur    = blur;
		if (color != null) this._color   = color;
		if (x     != null) this._offsetX = x;
		if (y     != null) this._offsetY = y;
	}

	/**~ja
	 * クリアする
	 */
	/**~en
	 * Clear
	 */
	clear() {
		this._blur    = 0;
		this._color   = 0;
		this._offsetX = 0;
		this._offsetY = 0;
	}

	/**~ja
	 * 影の設定を適用する
	 * @param {Paper|CanvasRenderingContext2D} ctx 紙／キャンバス・コンテキスト
	 */
	/**~en
	 * Assign the shadow settings
	 * @param {Paper|CanvasRenderingContext2D} ctx Paper or canvas context
	 */
	assign(ctx) {
		ctx.shadowBlur    = this._blur;
		ctx.shadowColor   = this._color;
		ctx.shadowOffsetX = this._offsetX;
		ctx.shadowOffsetY = this._offsetY;
	}

}