/**~ja
 * モーション・ライブラリ（MOTION）
 *
 * @author Takuto Yanagida
 * @version 2019-05-12
 */
/**~en
 * Motion library (MOTION)
 *
 * @author Takuto Yanagida
 * @version 2019-05-12
 */


/**~ja
 * ライブラリ変数
 */
/**~en
 * Library variable
 */
const MOTION = (function () {

	'use strict';


	//~ja ライブラリ中だけで使用するユーティリティ --------------------------------
	//~en Utilities used only in the library --------------------------------------


	/**~ja
	 * 角度を0～360度の範囲にする
	 * @param {number} deg 角度
	 * @return {number} 角度
	 */
	/**~en
	 * Make an angle between 0 to 360 degrees
	 * @param {number} deg Degree
	 * @return {number} Degree
	 */
	const checkDegRange = function (deg) {
		deg %= 360;
		if (deg < 0) deg += 360;
		return deg;
	};

	/**~ja
	 * 値なら返し、関数なら関数を呼び出す
	 * @param {number|function(): number} vf 値か関数
	 * @param {number=} unitTime 単位時間
	 * @return {number} 値
	 */
	/**~en
	 * If a value is given, return it, and if a function is given, call it
	 * @param {number|function(): number} vf Value or function
	 * @param {number=} unitTime Unit time
	 * @return {number} Value
	 */
	const valueFunction = function (vf, unitTime = 1) {
		if (typeof vf === 'function') {
			return vf(unitTime);
		} else {
			return vf * unitTime;
		}
	};

	/**~ja
	 * 範囲をチェックする関数を作る
	 * @param {number} min 最小値
	 * @param {number} max 最大値
	 * @param {boolean=} isLoop ループする？
	 * @return {function(number): number} 範囲をチェックする関数
	 */
	/**~en
	 * Make a function to check the range
	 * @param {number} min Minimum value
	 * @param {number} max Maximum value
	 * @param {boolean=} isLoop Whether to loop
	 * @return {function(number): number} Function to check the range
	 */
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


	//=
	//=include _scene/_axis-motion.js


	//=
	//=include _scene/_polar-motion.js


	//~ja ライブラリを作る --------------------------------------------------------
	//~en Create a library --------------------------------------------------------


	return { AxisMotion, PolarMotion };

}());
