/**~ja
 * 基本サイコロ
 * @author Takuto Yanagida
 * @version 2020-05-05
 */
/**~en
 * Dice base
 * @author Takuto Yanagida
 * @version 2020-05-05
 */
class DiceBase {

	/**~ja
	 * サイコロを作る
	 */
	/**~en
	 * Make a dice
	 */
	constructor() {
		this._r = Math.random;
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
	 * @return {number} テキトウな整数（乱数）
	 */
	/**~en
	 * Returns a random number from 0 to n_min or from min to max
	 * @param {number} n_min　An integer or a minimum integer
	 * @param {number=} opt_max　Maximum integer
	 * @return {number} A random integer
	 */
	rand(n_min, opt_max) {
		if (opt_max === undefined) {
			return Math.floor(this._r() * (n_min + 1));
		}
		return Math.floor(this._r() * (opt_max + 1 - n_min) + n_min);
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
		return Math.floor(this._r() * (100 + 1)) <= percent;
	}

}


/**~ja
 * サイコロ
 * @author Takuto Yanagida
 * @version 2019-05-07
 */
/**~en
 * Dice
 * @author Takuto Yanagida
 * @version 2019-05-07
 */
class Dice extends DiceBase {

	/**~ja
	 * サイコロを作る
	 */
	/**~en
	 * Make a dice
	 */
	constructor(seed = Math.random()) {
		super();
		this._seed = 0 | (seed * (seed < 1 ? 1000 : 1));
		this._r = this._createGenerator(this._seed);
	}

	/**~ja
	 * テキトウな数（乱数）を返す関数を作る（Xorshift32）（ライブラリ内だけで使用）
	 * @private
	 * @param {number} seed シード値
	 * @return {function(): number} テキトウな数（乱数）を返す関数
	 */
	/**~en
	 * Create a function that returns a random number (Xorshift32) (used only in the library)
	 * @private
	 * @param {number} seed Seed number
	 * @return {function(): number} Function that returns a random number
	 */
	_createGenerator(seed) {
		let y = seed;
		const fn = () => {
			y = y ^ (y << 13);
			y = y ^ (y >> 17);
			y = y ^ (y << 15);
			return (y + 2147483648) / 4294967295;
		};
		const stack = [];
		fn.save = () => { stack.push(y); };
		fn.restore = () => { y = stack.pop(); };
		return fn;
	}

	/**~ja
	 * リセットする
	 */
	/**~en
	 * Reset
	 */
	reset() {
		this._r = this._createGenerator(this._seed);
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

}