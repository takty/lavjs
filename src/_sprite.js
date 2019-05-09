/**~ja
 * スプライト
 * @extends {Element}
 * @version 2019-05-09
 */
/**~en
 * Sprite
 * @extends {Element}
 * @version 2019-05-09
 */
class Sprite extends Element {

	/**~ja
	 * スプライトを作る
	 * - ただし普通は、SPRITE.StageのmakeSprite関数を使う。
	 * @param {function(*)} drawFunction 絵を描く関数
	 * @param {Array=} opt_args_array 関数に渡す引数の配列
	 * @param {Motion=} opt_motion モーション
	 */
	/**~en
	 * Make a sprite
	 * - However, normally, use the makeSprite function of SPRITE.Stage.
	 * @param {function(*)} drawFunction Function to draw pictures
	 * @param {Array=} opt_args_array Array of arguments to pass to the function
	 * @param {Motion=} opt_motion Motion
	 */
	constructor(drawFunction, opt_args_array, opt_motion) {
		super(opt_motion);

		this._drawFunction = drawFunction;
		this._drawFunctionArgs = opt_args_array;
	}

	/**~ja
	 * スプライトを描く
	 * @param {CanvasRenderingContext2D} ctx キャンバス・コンテキスト
	 * @param {Array} args_array その他の引数の配列
	 */
	/**~en
	 * Draw a sprite
	 * @param {CanvasRenderingContext2D} ctx Canvas context
	 * @param {Array} args_array Array of other arguments
	 */
	draw(ctx, args_array) {
		let args = args_array;
		if (this._drawFunctionArgs) {
			args = args_array.concat(this._drawFunctionArgs);
		}
		if (this._fisrtUpdated) {
			ctx.save();
			this._setTransformation(ctx);
			this._drawFunction.apply(this, args);
			ctx.restore();
		}
		this._update();
	}

}