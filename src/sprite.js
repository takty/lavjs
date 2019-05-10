/**~ja
 * スプライト・ライブラリ（SPRITE）
 *
 * スプライト（アニメのセル画のようなもの）を作って、
 * 好きな場所に好きな大きさ、向き、透明度で表示するためのライブラリです。
 *
 * @author Takuto Yanagida
 * @version 2019-05-10
 */
/**~en
 * Sprite library (SPRITE)
 *
 * A library to make sprites (like animation cell pictures)
 * and display them in the size, orientation, and transparency you like.
 *
 * @author Takuto Yanagida
 * @version 2019-05-10
 */


/**~ja
 * ライブラリ変数
 */
/**~en
 * Library variable
 */
const SPRITE = (function () {

	'use strict';


	/**~ja
	 * ライブラリ中だけで使用するユーティリティ ---------------------------------------
	 */
	/**~en
	 * Utilities used only in the library --------------------------------------
	 */


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
	 * 値ならそのまま返し、関数なら関数を呼び出す
	 * @param {number|function(): number} vf 値か関数
	 * @return {number} 値
	 */
	/**~en
	 * If a value is given, return it, and if a function is given, call it
	 * @param {number|function(): number} vf Value or function
	 * @return {number} Value
	 */
	const valueFunction = function (vf) {
		if (typeof vf === 'function') {
			return vf();
		} else {
			return vf;
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
	//=include _element.js


	//=
	//=include _sprite.js


	//=
	//=include _stage.js


	/**~ja
	 * ユーティリティ関数 ---------------------------------------------------------
	 */
	/**~en
	 * Utility functions -------------------------------------------------------
	 */


	/**~ja
	 * スプライトの軌跡をプロットする関数を作る
	 * @param {Element} descendant 子孫要素
	 * @param {Stage} ancestorStage 先祖ステージ
	 * @param {CanvasRenderingContext2D} ctx プロットするコンテキスト
	 * @return {function} スプライトの軌跡をプロットする関数
	 */
	/**~en
	 * Make a function to plot sprite trajectory
	 * @param {Element} descendant Descendant element
	 * @param {Stage} ancestorStage Ancestor stage
	 * @param {CanvasRenderingContext2D} ctx Context to plot
	 * @return {function} Function to plot sprite trajectory
	 */
	const makePlotFunction = function (descendant, ancestorStage, ctx) {
		let old = [];
		return function () {
			if (!descendant._fisrtUpdated) return;
			const p = ancestorStage.getPositionOnContext(descendant);
			if (old.length > 0) {
				ctx.beginPath();
				ctx.moveTo(old[0], old[1]);
				ctx.lineTo(p[0], p[1]);
				ctx.stroke();
			}
			old = p;
		};
	};


	/**~ja
	 * ライブラリを作る
	 */
	/**~en
	 * Create a library
	 */


	return { Stage, Sprite, makePlotFunction };

}());
