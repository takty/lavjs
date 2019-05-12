/**~ja
 * 直交座標モーション
 * @version 2019-05-12
 */
/**~en
 * Axis coordinate motion
 * @version 2019-05-12
 */
class AxisMotion {

	// 直交座標モーションを作る
	constructor(speedX = 0, speedY = 0) {
		this._speedX = speedX;
		this._speedY = speedY;
		this._checkRangeX = null;
		this._checkRangeY = null;
	};

	// 横方向のスピード（<値>）
	speedX(val) {
		if (val === undefined) return this._speedX;
		this._speedX = val;
		return this;
	}

	// たて方向のスピード（<値>）
	speedY(val) {
		if (val === undefined) return this._speedY;
		this._speedY = val;
		return this;
	}

	// 横方向の範囲をセットする（始まり、終わり、ループする？）
	setRangeX(min, max, isLoop) {
		this._checkRangeX = makeRangeChecker(min, max, isLoop);
	}

	// たて方向の範囲をセットする（始まり、終わり、ループする？）
	setRangeY(min, max, isLoop) {
		this._checkRangeY = makeRangeChecker(min, max, isLoop);
	}

	// スピードに合わせて座標を更新する
	update(x, y, dir, unitTime) {
		x += valueFunction(this._speedX, unitTime);
		y += valueFunction(this._speedY, unitTime);
		if (this._checkRangeX !== null) x = this._checkRangeX(x);
		if (this._checkRangeY !== null) y = this._checkRangeY(y);
		return [x, y, dir];
	}

}