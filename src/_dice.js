/**~ja
 * サイコロ
 */
/**~en
 * Dice
 */
class Dice {

	/**~ja
	 * サイコロを作る
	 */
	/**~en
	 * Make a dice
	 */
	constructor() {
		this._r = createGenerator(0 | (Math.random() * 1000));
	}

	/**~ja
	 * リセットする
	 */
	/**~en
	 * Reset
	 */
	reset() {
		this._r.reset();
	}

	/**~ja
	 * 今の状態を保存する
	 */
	/**~en
	 * Save the current state
	 */
	save() {
		this._r.save();
	}

	/**~ja
	 * 前の状態を復元する
	 */
	/**~en
	 * Restore the previous state
	 */
	restore() {
		this._r.restore();
	}

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
	random(min, max, opt_fn) {
		if (opt_fn === undefined) {
			return this._r() * (max - min) + min;
		}
		return opt_fn(this._r()) * (max - min) + min;
	}

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
	rand(n_min, opt_max) {
		if (opt_max === undefined) {
			return Math.floor(this._r() * (n + 1));
		} else {
			return Math.floor(this._r() * (opt_max + 1 - n_min) + n_min);
		}
	}

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
	isLikely(percent) {
		return (this._r() * 10000 % 100) <= percent;
	}

}