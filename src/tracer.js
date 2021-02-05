/**~ja
 * トレーサー・ライブラリ（TRACER）
 *
 * 座標を持ったオブジェクトを移動させるライブラリです。
 *
 * @author Takuto Yanagida
 * @version 2021-02-04
 */
/**~en
 * TraceMotion library (TRACER)
 *
 * A library to move an object with coordinates.
 *
 * @author Takuto Yanagida
 * @version 2021-02-04
 */


/**~ja
 * ライブラリ変数
 */
/**~en
 * Library variable
 */
const TRACER = (function () {

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
	//=include _scene/_tracer.js


	//=
	//=include _scene/_command.js


	//~ja ライブラリを作る --------------------------------------------------------
	//~en Create a library --------------------------------------------------------


	//~ja 関数の別名
	//~en Function alias
	const aliasMap = {
		go            : ['forward', 'fd'],
		back          : ['bk', 'backward'],
		step          : ['unit'],
		turnRight     : ['tr', 'right', 'rt'],
		turnLeft      : ['tl', 'left', 'lt'],
		direction     : ['heading'],
		curveRight    : ['cr'],
		curveLeft     : ['cl'],
		arcRight      : ['ar'],
		arcLeft       : ['al'],
		getDirectionOf: ['towards'],
	};

	//~ja 関数の別名を登録する
	//~en Register function alias
	for (const [orig, as] of Object.entries(aliasMap)) {
		for (const a of as) {
			TraceMotion.prototype[a] = TraceMotion.prototype[orig];
		}
	}

	return { TraceMotion };

}());
