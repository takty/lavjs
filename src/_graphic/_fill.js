/**~ja
 * 塗りスタイル（フィル）
 * @extends {StyleBase}
 * @version 2020-04-21
 */
/**~en
 * Filling style (Fill)
 * @extends {StyleBase}
 * @version 2020-04-21
 */
class Fill extends StyleBase {

	/**~ja
	 * ぬりスタイルを作る
	 * @param {Fill=} base 元になるぬりスタイル
	 */
	/**~en
	 * Make a filling style
	 * @param {Fill=} base Original filling style
	 */
	constructor(base) {
		super(base, 'White');
	}

	/**~ja
	 * リセットする
	 * @param {string} color 色
	 * @return {Fill} このぬりスタイル
	 */
	/**~en
	 * Reset
	 * @param {string} color Color
	 * @return {Fill} This filling style
	 */
	reset(color) {
		super.reset(color);
		return this;
	}

	// gradArea = {fromX, fromY, toX, toY, left, top, right, bottom}

	/**~ja
	 * 紙にぬりスタイルを設定する
	 * @param {Paper|CanvasRenderingContext2D} ctx 紙／キャンバス・コンテキスト
	 * @param {Array<number>} gradArea グラデーション範囲
	 */
	/**~en
	 * Set the filling style on the paper
	 * @param {Paper|CanvasRenderingContext2D} ctx Paper or canvas context
	 * @param {Array<number>} gradArea Gradation area
	 */
	assign(ctx, gradArea) {
		ctx.fillStyle = this._makeStyle(ctx, gradArea);
		ctx.globalAlpha *= this._alpha;
		ctx.globalCompositeOperation = this._composition;
		this._shadow.assign(ctx);
		if (this._gradOpt.scale) this._setGradOpt(ctx, this._gradOpt);
	}

	/**~ja
	 * ぬりスタイルを使って形をかく
	 * @param {Paper|CanvasRenderingContext2D} ctx 紙／キャンバス・コンテキスト
	 * @param {Array<number>} gradArea グラデーション範囲
	 */
	/**~en
	 * Draw shape using the filling style
	 * @param {Paper|CanvasRenderingContext2D} ctx Paper or canvas context
	 * @param {Array<number>} gradArea Gradation area
	 */
	draw(ctx, gradArea) {
		ctx.save();
		this.assign(ctx, gradArea);
		ctx.fill();
		ctx.restore();
	}

}