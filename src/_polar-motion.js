/**~ja
 * 極座標モーション
 * @version 2019-05-12
 */
/**~en
 * Polar coordinate motion
 * @version 2019-05-12
 */
class PolarMotion {

	// 極座標モーションを作る
	constructor(speedA = 0, speedR = 0, proportionalAngularSpeed = false) {
		this._speedA = speedA;
		this._speedR = speedR;
		this._propSpeedA = proportionalAngularSpeed;
		this._checkRangeR = null;
	}

	// 角度方向のスピード（<値>）
	speedA(val) {
		if (val === undefined) return this._speedA;
		this._speedA = val;
		return this;
	}

	// 半径方向のスピード（<値>）
	speedR(val) {
		if (val === undefined) return this._speedR;
		this._speedR = val;
		return this;
	}

	// 径方向の範囲をセットする（始まり、終わり、ループする？）
	setRangeR(min, max, isLoop) {
		this._checkRangeR = makeRangeChecker(min, max, isLoop);
	}

	// 角度方向のスピードが半径に比例する？（<true or false>）
	proportionalAngularSpeed(val) {
		if (val === undefined) return this._propSpeedA;
		this._propSpeedA = val;
		return this;
	}

	// スピードに合わせて座標を更新する
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