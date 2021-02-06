/**~ja
 * スプライト
 * @extends {Element}
 * @version 2021-02-06
 */
/**~en
 * Sprite
 * @extends {Element}
 * @version 2021-02-06
 */
class Sprite extends Element {

	/**~ja
	 * スプライトを作る
	 * - ただし普通は、SPRITE.StageのmakeSprite関数を使う。
	 * @constructor
	 * @param {function(*)} drawFunction 絵をかく関数
	 * @param {Array=} opt_args_array 関数に渡す引数の配列
	 * @param {Motion=} opt_motion モーション
	 */
	/**~en
	 * Make a sprite
	 * - However, normally, use the makeSprite function of SPRITE.Stage.
	 * @constructor
	 * @param {function(*)} drawFunction Function to draw pictures
	 * @param {Array=} opt_args_array Array of arguments to pass to the function
	 * @param {Motion=} opt_motion Motion
	 */
	constructor(drawFunction, opt_args_array, opt_motion) {
		super(opt_motion);

		this._drawFunction = drawFunction;
		this._drawFunctionArgs = opt_args_array;

		this._collisionRadius = 1;
		this._onCollision = null;
	}

	/**~ja
	 * スプライトをかく
	 * @param {Paper|CanvasRenderingContext2D} ctx 紙／キャンバス・コンテキスト
	 * @param {Array=} args_array その他の引数の配列
	 */
	/**~en
	 * Draw a sprite
	 * @param {Paper|CanvasRenderingContext2D} ctx Paper or canvas context
	 * @param {Array=} args_array Array of other arguments
	 */
	draw(ctx, args_array = []) {
		let args = args_array;
		if (this._drawFunctionArgs) {
			args = args_array.concat(this._drawFunctionArgs);
		}
		if (this._firstUpdated) {
			ctx.save();
			this._setTransformation(ctx);
			this._drawFunction(...args);
			ctx.restore();
		}
	}

	/**~ja
	 * 衝突半径
	 * @param {number=} val 半径
	 * @return {number|Sprite} 半径／このスプライト
	 */
	/**~en
	 * Collision radius
	 * @param {number=} val Radius
	 * @return {number|Sprite} Radius, or this sprite
	 */
	collisionRadius(val) {
		if (val === undefined) return this._collisionRadius;
		this._collisionRadius = val;
		return this;
	}

	/**~ja
	 * 衝突イベントに対応する関数をセットする
	 * @param {function(this, Sprite)=} handler 関数
	 * @return {function(this, Sprite)=} 半径／このスプライト
	 */
	/**~en
	 * Set the function handling the collision event
	 * @param {function(this, Sprite)=} handler Function
	 * @return {function(this, Sprite)=|Sprite} Function, or this sprite
	 */
	onCollision(handler) {
		if (handler === undefined) return this._onCollision;
		this._onCollision = handler;
		return this;
	}

}