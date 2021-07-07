/**~ja
 * 線スタイル（ストローク）
 * @extends {StyleBase}
 * @version 2021-02-05
 */
/**~en
 * Stroke style (Stroke)
 * @extends {StyleBase}
 * @version 2021-02-05
 */
class Stroke extends StyleBase {

	/**~ja
	 * 線スタイルを作る
	 * @constructor
	 * @param {Stroke=} base 元になる線スタイル
	 */
	/**~en
	 * Make a stroke style
	 * @constructor
	 * @param {Stroke=} base Original stroke style
	 */
	constructor(base) {
		super(base, 'Black');

		this._width      = base ? base._width      : 1;
		this._cap        = base ? base._cap        : 'butt';
		this._join       = base ? base._join       : 'bevel';
		this._miterLimit = base ? base._miterLimit : 10;
		this._dash       = base ? base._dash       : null;
		this._dashOffset = base ? base._dashOffset : 0;
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

		this._width      = 1;
		this._cap        = 'butt';
		this._join       = 'bevel';
		this._miterLimit = 10;
		this._dash       = null;
		this._dashOffset = 0;
		return this;
	}

	/**~ja
	 * 線の太さを設定する
	 * @param {number=} width 線の太さ
	 * @return {number|Stroke} 線の太さかこのストローク
	 */
	/**~en
	 * Set the line width
	 * @param {number=} width Line width
	 * @return {number|Stroke} Line width or this stroke
	 */
	width(width) {
		if (width === undefined) return this._width;
		this._width = width;
		return this;
	}

	/**~ja
	 * 線のはしを設定する
	 * @param {string=} cap 線のはし
	 * @return {string|Stroke} 線のはしかこのストローク
	 */
	/**~en
	 * Set the line cap
	 * @param {string=} cap Line cap
	 * @return {string|Stroke} Line cap or this stroke
	 */
	cap(cap) {
		if (cap === undefined) return this._cap;
		this._cap = cap;
		return this;
	}

	/**~ja
	 * 線のつなぎを設定する
	 * @param {string=} join 線のつなぎ
	 * @return {string|Stroke} 線のつなぎかこのストローク
	 */
	/**~en
	 * Set the line join
	 * @param {string=} join Line join
	 * @return {string|Stroke} Line join or this stroke
	 */
	join(join) {
		if (join === undefined) return this._join;
		this._join = join;
		return this;
	}

	/**~ja
	 * 線の角の出っ張りの上限を設定する
	 * @param {number=} miterLimit 線の角の出っ張りの上限
	 * @return {number|Stroke} 線の角の出っ張りの上限かこのストローク
	 */
	/**~en
	 * Set the upper limit of miter
	 * @param {number=} miterLimit Upper limit of miter
	 * @return {number|Stroke} Upper limit of miter or this stroke
	 */
	miterLimit(miterLimit) {
		if (miterLimit === undefined) return this._miterLimit;
		this._miterLimit = miterLimit;
		return this;
	}

	/**~ja
	 * 点線のパターンを設定する
	 * @param {number[]=} dash 点線のパターン
	 * @return {number[]|Stroke} 点線パターンかこのストローク
	 */
	/**~en
	 * Set a dash pattern
	 * @param {number[]=} dash Dash pattern
	 * @return {number[]|Stroke} Dash pattern or this stroke
	 */
	dash(...dash) {
		if (dash === undefined) return this._dash.concat();
		if (Array.isArray(dash[0])) {
			this._dash = [...dash[0]];
		} else {
			this._dash = [...dash];
		}
		return this;
	}

	/**~ja
	 * 点線のパターンのずれを設定する
	 * @param {number=} dashOffset 点線のパターンのずれ
	 * @return {number|Stroke} 点線のパターンのずれかこのストローク
	 */
	/**~en
	 * Set the offset of dash pattern
	 * @param {number=} dashOffset The offset of dash pattern
	 * @return {number|Stroke} The offset of dash pattern or this stroke
	 */
	dashOffset(dashOffset) {
		if (dashOffset === undefined) return this._dashOffset;
		this._dashOffset = dashOffset;
		return this;
	}

	// gradArea = {fromX, fromY, toX, toY, left, top, right, bottom}

	/**~ja
	 * 紙に線スタイルを設定する
	 * @param {Paper|CanvasRenderingContext2D} ctx 紙／キャンバス・コンテキスト
	 * @param {number[]} gradArea グラデーション範囲
	 */
	/**~en
	 * Assign the stroke style in the paper
	 * @param {Paper|CanvasRenderingContext2D} ctx Paper or canvas context
	 * @param {number[]} gradArea Gradation area
	 */
	assign(ctx, gradArea) {
		ctx.strokeStyle = this._makeStyle(ctx, gradArea);
		ctx.globalAlpha *= this._alpha;
		ctx.globalCompositeOperation = this._composition;
		this._shadow.assign(ctx);
		if (this._gradOpt.scale) this._setGradOpt(ctx, this._gradOpt);

		ctx.lineWidth = this._width;
		ctx.lineCap = this._cap;
		ctx.lineJoin = this._join;
		ctx.miterLimit = this._miterLimit;

		ctx.setLineDash(this._dash ? this._dash : []);
		ctx.lineDashOffset = this._dashOffset;
	}

	/**~
	 * 線スタイルを使って線をかく
	 * @param {Paper|CanvasRenderingContext2D} ctx 紙／キャンバス・コンテキスト
	 * @param {number[]} gradArea グラデーション範囲
	 */
	/**~en
	 * Draw lines using the stroke style
	 * @param {Paper|CanvasRenderingContext2D} ctx Paper or canvas context
	 * @param {number[]} gradArea Gradation area
	 */
	draw(ctx, gradArea) {
		ctx.save();
		this.assign(ctx, gradArea);
		ctx.stroke();
		ctx.restore();
	}

}