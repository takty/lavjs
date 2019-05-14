/**~ja
 * 極座標モーション
 * @version 2019-05-14
 */
/**~en
 * Polar coordinate motion
 * @version 2019-05-14
 */
class PolarMotion {

	/**~ja
	 * 極座標モーションを作る
	 * @param {number=} [speedA=0] 角度方向のスピード
	 * @param {number=} [speedR=0] 半径方向のスピード
	 * @param {boolean=} [proportionalAngularSpeed=false] 角度方向のスピードが半径に比例する？
	 */
	/**~en
	 * Make a polar coordinate motion
	 * @param {number=} [speedA=0] Angular speed
	 * @param {number=} [speedR=0] Radius speed
	 * @param {boolean=} [proportionalAngularSpeed=false] Whether angular speed is proportional to radius
	 */
	constructor(speedA = 0, speedR = 0, proportionalAngularSpeed = false) {
		this._speedA = speedA;
		this._speedR = speedR;
		this._propSpeedA = proportionalAngularSpeed;
		this._checkRangeR = null;
	}

	/**~ja
	 * 角度方向のスピード
	 * @param {number=} val 値
	 * @return {number|PolarMotion} 値／このモーション
	 */
	/**~en
	 * Angular speed
	 * @param {number=} val Value
	 * @return {number|PolarMotion} Value, or this motion
	 */
	speedA(val) {
		if (val === undefined) return this._speedA;
		this._speedA = val;
		return this;
	}

	/**~ja
	 * 半径方向のスピード
	 * @param {number=} val 値
	 * @return {number|PolarMotion} 値／このモーション
	 */
	/**~en
	 * Radius speed
	 * @param {number=} val Value
	 * @return {number|PolarMotion} Value, or this motion
	 */
	speedR(val) {
		if (val === undefined) return this._speedR;
		this._speedR = val;
		return this;
	}

	/**~ja
	 * 半径方向の範囲をセットする
	 * @param {number} min 始まり
	 * @param {number} max 終わり
	 * @param {boolean} isLoop ループする？
	 */
	/**~en
	 * Set the radius range
	 * @param {number} min Beginning
	 * @param {number} max End
	 * @param {boolean} isLoop Whether to loop
	 */
	setRangeR(min, max, isLoop) {
		this._checkRangeR = makeRangeChecker(min, max, isLoop);
	}

	/**~ja
	 * 角度方向のスピードが半径に比例する？
	 * @param {boolean} val 値
	 * @return {boolean|PolarMotion} 値／このモーション
	 */
	/**~en
	 * Whether angular speed is proportional to radius
	 * @param {boolean} val Value
	 * @return {boolean|PolarMotion} Value, or this motion
	 */
	proportionalAngularSpeed(val) {
		if (val === undefined) return this._propSpeedA;
		this._propSpeedA = val;
		return this;
	}

	/**~ja
	 * スピードに合わせて座標を更新する
	 * @param {number} x x座標（横の場所）
	 * @param {number} y y座標（たての場所）
	 * @param {number} dir 方向
	 * @param {number} unitTime 単位時間
	 * @return {Array<number>} 座標
	 */
	/**~en
	 * Update coordinates according to the speed
	 * @param {number} x X coordinate
	 * @param {number} y Y coordinate
	 * @param {number} dir Direction
	 * @param {number} unitTime Unit time
	 * @return {Array<number>} Coordinate
	 */
	update(x, y, dir, unitTime) {
		let r = Math.sqrt(x * x + y * y);
		r += valueFunction(this._speedR, unitTime);
		if (this._checkRangeR !== null) r = this._checkRangeR(r);

		let p = Math.atan2(y, x) * 180 / Math.PI;
		p += valueFunction(this._speedA, unitTime) / (this._propSpeedA ? r : 1);
		p = checkDegRange(p);

		const d = p * Math.PI / 180;
		return [r * Math.cos(d), r * Math.sin(d), dir];
	}

}