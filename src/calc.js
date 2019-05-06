/**~ja
 * 計算ライブラリ（CALC）
 *
 * 範囲を決められるランダム関数や、ある範囲の数を別の範囲の数に変えるマッピング、
 * 単純ではない動きを作るのに使うイージング関数が使えるようになるライブラリです。
 *
 * @author Takuto Yanagida
 * @version 2019-05-06
 */
/**~en
 * Calculation library (CALC)
 *
 * A library that allows you to use random functions with bounds,
 * mappings that translate from one range number to another,
 * and easing functions that you use to create non-trivial motions.
 *
 * @author Takuto Yanagida
 * @version 2019-05-06
 */


/**~ja
 * ライブラリ変数
 */
/**~en
 * Library variable
 */
const CALC = (function () {

	'use strict';


	/**~ja
	 * 乱数関数 -----------------------------------------------------------------
	 */
	/**~en
	 * Random number function --------------------------------------------------
	 */


	//=
	//=include _dice.js


	let _dice = new DiceBase();

	/**~ja
	 * ランダム関数にシード値を指定する
	 * 同じシード値では同じランダムの値の組み合わせが作られます。
	 * @param {number} seed シード値
	 */
	/**~en
	 * Specify a seed value for the random function
	 * The same seed value produces the same combination of random values.
	 * @param {number} seed Seed value
	 */
	const setRandomSeed = function (seed) {
		_dice = new Dice(seed);
	};

	/**~ja
	 * ランダム関数をリセットする
	 */
	/**~en
	 * Reset the random function
	 */
	const resetRandomSeed = function () {
		if (_dice instanceof Dice) _r.reset();
	};

	/**~ja
	 * ランダム関数の今の状態を保存する
	 */
	/**~en
	 * Save the current state of the random function
	 */
	const saveRandomState = function () {
		if (_dice instanceof Dice) _r.save();
	};

	/**~ja
	 * ランダム関数の前の状態を復元する
	 */
	/**~en
	 * Restore the previous state of the random function
	 */
	const restoreRandomState = function () {
		if (_dice instanceof Dice) _r.restore();
	};

	/**~ja
	 * minからmaxまでのテキトウな数（乱数）を返す
	 * @param {number} min 最小値
	 * @param {number} max 最大値
	 * @param {function(number): number=} opt_fn イージング関数（オプション）
	 * @return {number} テキトウな数（乱数）
	 */
	/**~en
	 * Return a random number from min to max
	 * @param {number} min Minimum number
	 * @param {number} max Maximum number
	 * @param {function(number): number=} opt_fn Easing function (optional)
	 * @return {number} A random number
	 */
	const random = function (min, max, opt_fn) {
		return _dice.random(min, max, opt_fn);
	};

	/**~ja
	 * 0からn_minまで、あるいはminからmaxまでのテキトウな整数（乱数）を返す
	 * @param {number} n_min　整数nか整数min
	 * @param {number=} opt_max　整数max
	 * @return テキトウな整数（乱数）
	 */
	/**~en
	 * Returns a random number from 0 to n_min or from min to max
	 * @param {number} n_min　An integer or a minimum integer
	 * @param {number=} opt_max　Maximum integer
	 * @return {number} A random integer
	 */
	const rand = function (n_min, opt_max) {
		return _dice.rand(n_min, opt_max);
	};

	/**~ja
	 * パーセントで指定した確率で起こる
	 * @param {number} percent パーセント
	 * @return {boolean} 起こるかどうか
	 */
	/**~en
	 * Occur with probability specified in percent
	 * @param {number} percent Percent
	 * @return {boolean} Whether it occurs
	 */
	const isLikely = function (percent) {
		return _dice.isLikely(percent);
	};


	/**~ja
	 * ユーティリティ関数 ---------------------------------------------------------
	 */
	/**~en
	 * Utility functions -------------------------------------------------------
	 */


	/**~ja
	 * 数をある範囲の中に制限する
	 * @param {number} val 数
	 * @param {number} min 最小値
	 * @param {number} max 最大値
	 * @param {string=} type タイプ
	 * @return {number} 数
	 */
	/**~en
	 * Limit the number to a certain range
	 * @param {number} val A number
	 * @param {number} min Minimum number
	 * @param {number} max Maximum number
	 * @param {string=} type Type
	 * @return {number} A limited number
	 */
	const constrain = function (val, min, max, type) {
		if (type === 'loop') {
			if (val < min) return max;
			if (max < val) return min;
		} else {
			if (val < min) return min;
			if (max < val) return max;
		}
		if (val === undefined || Number.isNaN(val)) return min;
		return val;
	};

	/**~ja
	 * ある範囲の数を別の範囲の数に直して返す
	 * @param {number} val 元の数
	 * @param {number} from1 元の範囲の初め
	 * @param {number} to1 元の範囲の終わり
	 * @param {number} from2 別の範囲の初め
	 * @param {number} to2 別の範囲の終わり
	 * @param {function(number): number=} opt_fn イージング関数（オプション）
	 * @return {number} 数
	 */
	/**~en
	 * Convert one range of numbers to another range of numbers
	 * @param {number} val An original number
	 * @param {number} from1 Beginning of original range
	 * @param {number} to1 End of original range
	 * @param {number} from2 Beginning of another range
	 * @param {number} to2 End of another range
	 * @param {function(number): number=} opt_fn Easing function (optional)
	 * @return {number} A converted number
	 */
	const map = function (val, from1, to1, from2, to2, opt_fn) {
		if (from1 < to1) {
			if (val < from1) val = from1;
			if (val > to1)   val = to1;
		} else {
			if (val > from1) val = from1;
			if (val < to1)   val = to1;
		}
		if (opt_fn === undefined) {
			return (val - from1) * (to2 - from2) / (to1 - from1) + from2;
		}
		return opt_fn((val - from1) / (to1 - from1)) * (to2 - from2) + from2;
	};


	//=
	//=include _easing.js


	/**~ja
	 * ライブラリを作る
	 */
	/**~en
	 * Create a library
	 */


	return {
		Dice,
		setRandomSeed,
		resetRandomSeed,
		saveRandomState,
		restoreRandomState,

		random, rand, isLikely,
		constrain, map,

		linear,
		easeInSine, easeOutSine, easeInOutSine,
		easeInQuad, easeOutQuad, easeInOutQuad,
		easeInCubic, easeOutCubic, easeInOutCubic,
		easeInQuart, easeOutQuart, easeInOutQuart,
		easeInQuint, easeOutQuint, easeInOutQuint,
		easeInExpo, easeOutExpo, easeInOutExpo,
		easeInCirc, easeOutCirc, easeInOutCirc,
	};

}());