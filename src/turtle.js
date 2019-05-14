/**~ja
 * タートル・ライブラリ（TURTLE）
 *
 * カメを動かして、絵をかくためのライブラリです。
 *
 * @author Takuto Yanagida
 * @version 2019-05-11
 */
/**~en
 * Turtle library (TURTLE)
 *
 * A library for moving the turtle and drawing pictures.
 *
 * @author Takuto Yanagida
 * @version 2019-05-11
 */


/**~ja
 * ライブラリ変数
 */
/**~en
 * Library variable
 */
const TURTLE = (function () {

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
	//=include _turtle-base.js


	//=
	//=include _turtle.js


	//~ja ユーティリティ関数 ------------------------------------------------------
	//~en Utility functions -------------------------------------------------------


	/**~ja
	 * タートルを使ってかく関数からスタンプ（高速に絵をかく関数）を作る
	 * @param {number} width スタンプの横幅
	 * @param {number} height スタンプのたて幅
	 * @param {number} cx スタンプの中心x座標
	 * @param {number} cy スタンプの中心y座標
	 * @param {number} scale 拡大率
	 * @param {function} func 関数
	 * @return {function} スタンプの関数
	 */
	/**~en
	 * Create a stamp (a function that draws a picture at high speed) from a function drawn using a turtle
	 * @param {number} width Width of stamp
	 * @param {number} height Height of stamp
	 * @param {number} cx X coordinate of center of stamp
	 * @param {number} cy Y coordinate of center of stamp
	 * @param {number} scale Scaling rate
	 * @param {function} func Function
	 * @return {function} Stamp function
	 */
	const makeStamp = function (width, height, cx, cy, scale, func) {
		let curArgs = null, cacheCtx = null, cacheT = null;

		function isSame(a0, a1) {
			if (a0.length !== a1.length) return false;
			for (let i = 0, I = a0.length; i < I; i += 1) {
				if (a0[i] !== a1[i]) return false;
			}
			return true;
		}
		return function (t, ...var_args) {
			if (!cacheCtx) {
				cacheCtx = new CROQUJS.Paper(width, height, false);
				cacheCtx.translate(cx, cy);
				t.context().addChild(cacheCtx);
				cacheT = new TURTLE.Turtle(cacheCtx);
			}
			if (!curArgs || !isSame(curArgs, var_args)) {
				cacheCtx.clear();
				var_args.unshift(cacheT);  // cacheTを挿入
				func.apply(null, var_args);
				curArgs = var_args.slice(1);  // cacheTを削除
			}
			t.image(cacheCtx, cx, cy, scale);
		};
	};


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
		penDown       : ['pd', 'down'],
		penUp         : ['pu', 'up'],
	};

	//~ja 関数の別名を登録する
	//~en Register function alias
	for (let target of [Turtle, TurtleBase]) {
		for (const [orig, aliases] of Object.entries(aliasMap)) {
			for (let alias of aliases) {
				target.prototype[alias] = target.prototype[orig];
			}
		}
	}

	return { Turtle, TurtleBase, makeStamp };

}());
