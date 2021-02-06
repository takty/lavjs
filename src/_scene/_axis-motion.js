/**~ja
 * 直交座標モーション
 * @version 2021-02-06
 */
/**~en
 * Axis coordinate motion
 * @version 2021-02-06
 */
class AxisMotion {

	/**~ja
	 * 直交座標モーションを作る
	 * @constructor
	 * @param {number=} [speedX=0] 横方向のスピード
	 * @param {number=} [speedY=0] たて方向のスピード
	 */
	/**~en
	 * Make an axis coordinate motion
	 * @constructor
	 * @param {number=} [speedX=0] Horizontal speed
	 * @param {number=} [speedY=0] Vertical speed
	 */
	constructor(speedX = 0, speedY = 0) {
		this._speedX = speedX;
		this._speedY = speedY;
		this._checkRangeX = null;
		this._checkRangeY = null;
	}

	/**~ja
	 * 横方向のスピード
	 * @param {number=} val 値
	 * @return {number|AxisMotion} 値／このモーション
	 */
	/**~en
	 * Horizontal speed
	 * @param {number=} val Value
	 * @return {number|AxisMotion} Value, or this motion
	 */
	speedX(val) {
		if (val === undefined) return this._speedX;
		this._speedX = val;
		return this;
	}

	/**~ja
	 * たて方向のスピード
	 * @param {number=} val 値
	 * @return {number|AxisMotion} 値／このモーション
	 */
	/**~en
	 * Vertical speed
	 * @param {number=} val Value
	 * @return {number|AxisMotion} Value, or this motion
	 */
	speedY(val) {
		if (val === undefined) return this._speedY;
		this._speedY = val;
		return this;
	}

	/**~ja
	 * 横方向の範囲をセットする
	 * @param {number} min 始まり
	 * @param {number} max 終わり
	 * @param {boolean} isLoop ループする？
	 */
	/**~en
	 * Set the horizontal range
	 * @param {number} min Beginning
	 * @param {number} max End
	 * @param {boolean} isLoop Whether to loop
	 */
	setRangeX(min, max, isLoop) {
		this._checkRangeX = makeRangeChecker(min, max, isLoop);
	}

	/**~ja
	 * たて方向の範囲をセットする
	 * @param {number} min 始まり
	 * @param {number} max 終わり
	 * @param {boolean} isLoop ループする？
	 */
	/**~en
	 * Set the vertical range
	 * @param {number} min Beginning
	 * @param {number} max End
	 * @param {boolean} isLoop Whether to loop
	 */
	setRangeY(min, max, isLoop) {
		this._checkRangeY = makeRangeChecker(min, max, isLoop);
	}

	/**~ja
	 * スピードに合わせて座標を更新する
	 * @param {number} unitTime 単位時間
	 * @param {number} x x座標（横の場所）
	 * @param {number} y y座標（たての場所）
	 * @param {number} dir 方向
	 * @return {number[]} 座標
	 */
	/**~en
	 * Update coordinates according to the speed
	 * @param {number} unitTime Unit time
	 * @param {number} x X coordinate
	 * @param {number} y Y coordinate
	 * @param {number} dir Direction
	 * @return {number[]} Coordinate
	 */
	update(unitTime, x, y, dir) {
		x += valueFunction(this._speedX, unitTime);
		y += valueFunction(this._speedY, unitTime);
		if (this._checkRangeX !== null) x = this._checkRangeX(x);
		if (this._checkRangeY !== null) y = this._checkRangeY(y);
		return [x, y, dir];
	}

}