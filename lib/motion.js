//
// モーション・ライブラリ（MOTION）
// 日付: 2019-01-05
// 作者: 柳田拓人（Space-Time Inc.）
//


// ライブラリ変数
const MOTION = (function () {

	'use strict';


	// ================================ ライブラリ中だけで使用するユーティリティ


	// 角度を0～360度の範囲にする
	const checkDegRange = function (deg) {
		deg %= 360;
		if (deg < 0) deg += 360;
		return deg;
	};

	// 関数なら呼び出し、値なら返す
	const valueFunction = function (vf, unitTime = 1) {
		if (typeof vf === 'function') {
			return vf(unitTime);
		} else {
			return vf * unitTime;
		}
	};

	// 範囲をチェックする関数を作る
	const makeRangeChecker = function (min, max, isLoop) {
		if (isLoop) {
			return function (v) {
				if (v < min) return max;
				if (max < v) return min;
				return v;
			}
		} else {
			return function (v) {
				if (v < min) return min;
				if (max < v) return max;
				return v;
			}
		}
	};


	// ================================ 直交座標モーション (MOTION.AxisMotion)


	class AxisMotion {

		// 直交座標モーションを作る
		constructor(speedX = 0, speedY = 0) {
			this._speedX      = speedX;
			this._speedY      = speedY;
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


	// ================================ 極座標モーション (MOTION.PolarMotion)


	class PolarMotion {

		// 極座標モーションを作る
		constructor(speedA = 0, speedR = 0, proportionalAngularSpeed = false) {
			this._speedA      = speedA;
			this._speedR      = speedR;
			this._propSpeedA  = proportionalAngularSpeed;
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


	// ================================ ライブラリを作る


	// ライブラリとして返す
	return { AxisMotion, PolarMotion };

}());
