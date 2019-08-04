/**~ja
 * 定規ライブラリ（RULER）
 *
 * @author Takuto Yanagida
 * @version 2019-08-04
 */
/**~en
 * Ruler library (RULER)
 *
 * @author Takuto Yanagida
 * @version 2019-08-04
 */


/**~ja
 * ライブラリ変数
 */
/**~en
 * Library variable
 */
const RULER = (function () {

	'use strict';


	//~ja ライブラリ中だけで使用するユーティリティ --------------------------------
	//~en Utilities used only in the library --------------------------------------


	/**~ja
	 * 角度をラジアンにする
	 * @param {number} deg 角度
	 * @return {number} ラジアン
	 */
	/**~en
	 * Convert degree to radian
	 * @param {number} deg Degree
	 * @return {number} Radian
	 */
	const rad = function (deg) {
		return deg * Math.PI / 180.0;
	};

	/**~ja
	 * ラジアンを角度にする
	 * @param {number} rad ラジアン
	 * @return {number} 角度
	 */
	/**~en
	 * Convert radian to degree
	 * @param {number} rad Radian
	 * @return {number} Degree
	 */
	const deg = function (rad) {
		return rad * 180.0 / Math.PI;
	};

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


	//=
	//=include _ruler.js


	//~ja ライブラリを作る --------------------------------------------------------
	//~en Create a library --------------------------------------------------------


	//~ja 関数の別名
	//~en Function alias
	const aliasMap = {
	};

	//~ja 関数の別名を登録する
	//~en Register function alias
	for (const [orig, aliases] of Object.entries(aliasMap)) {
		for (let alias of aliases) {
			Ruler.prototype[alias] = Ruler.prototype[orig];
		}
	}

	return { Ruler };

}());
