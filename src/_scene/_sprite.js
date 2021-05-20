/**~ja
 * スプライト
 * @extends {Element}
 * @version 2021-05-21
 */
/**~en
 * Sprite
 * @extends {Element}
 * @version 2021-05-21
 */
class Sprite extends Element {

	/**~ja
	 * スプライトを作る
	 * @constructor
	 * @param {function(*)} drawingCallback 絵をかく関数
	 * @param {Motion=} motion モーション
	 * @param {Rotation=} rotation 回転
	 */
	/**~en
	 * Make a sprite
	 * @constructor
	 * @param {function(*)} drawingCallback Function to draw picture one by one
	 * @param {Motion=} motion Motion
	 * @param {Rotation=} rotation Rotation
	 */
	constructor(drawingCallback, motion = null, rotation = null) {
		super(motion, rotation);
		this._drawingCallback = drawingCallback;
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
		if (this._firstUpdated) {
			ctx.save();
			this._setTransformation(ctx);
			this._drawingCallback.apply(this, args_array);
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