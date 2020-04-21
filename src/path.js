/**~ja
 * パス・ライブラリ（PATH）
 *
 * 図形のパスを作るためのライブラリです。
 *
 * @author Takuto Yanagida
 * @version 2019-09-03
 */
/**~en
 * Path library (PATH)
 *
 * A library to make the path of the shape.
 *
 * @author Takuto Yanagida
 * @version 2019-09-03
 */


/**~ja
 * ライブラリ変数
 */
/**~en
 * Library variable
 */
const PATH = (function () {

	'use strict';


	//~ja ライブラリ中だけで使用するユーティリティ --------------------------------
	//~en Utilities used only in the library --------------------------------------


	/**~ja
	 * 最小値
	 */
	/**~en
	 * Minimum value
	 */
	const E = 0.0000000000001;

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
	 * 2点間の角度を求める
	 * @param {number} x0 点1のx座標
	 * @param {number} y0 点1のy座標
	 * @param {number} x1 点2のx座標
	 * @param {number} y1 点2のy座標
	 * @return {number} 角度
	 */
	/**~en
	 * Find the angle between two points
	 * @param {number} x0 X coordinate of point 1
	 * @param {number} y0 Y coordinate of point 1
	 * @param {number} x1 X coordinate of point 2
	 * @param {number} y1 Y coordinate of point 2
	 * @return {number} Degree
	 */
	const degOf = function (x0, y0, x1, y1) {
		let d = (Math.atan2(y1 - y0, x1 - x0) * 180.0 / Math.PI);
		while (d < 0) d += 360;
		while (360 <= d) d -= 360;
		return d;
	};

	/**~ja
	 * 2点間の長さを求める
	 * @param {number} x0 点1のx座標
	 * @param {number} y0 点1のy座標
	 * @param {number} x1 点2のx座標
	 * @param {number} y1 点2のy座標
	 * @return {number} 長さ
	 */
	/**~en
	 * Find the length between two points
	 * @param {number} x0 X coordinate of point 1
	 * @param {number} y0 Y coordinate of point 1
	 * @param {number} x1 X coordinate of point 2
	 * @param {number} y1 Y coordinate of point 2
	 * @return {number} Length
	 */
	const lenOf = function (x0, y0, x1, y1) {
		return Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
	};

	/**~ja
	 * 長さを求める
	 * @param {number} x0 始点x座標
	 * @param {number} y0 始点y座標
	 * @param {function(number, number, Array<number>)} func 関数
	 * @param {number} I 計算する細かさ
	 * @param {number=} [opt_limit=null] 長さ制限
	 * @param {dict=} [opt_retArea=null] エリアを返す配列
	 * @return {dict} 長さ
	 */
	/**~en
	 * Determine the length
	 * @param {number} x0 X coordinate of start point
	 * @param {number} y0 Y coordinate of start point
	 * @param {function(number, number, Array<number>)} func Function
	 * @param {number} I Accuracy to calculate
	 * @param {number=} [opt_limit=null] Length limitation
	 * @param {dict=} [opt_retArea=null] An array returning areas
	 * @return {dict} Length of span
	 */
	const calcSpan = function (x0, y0, func, I, opt_limit = null, opt_retArea = null) {
		let px = x0, py = y0, pt = [], span = 0, limitedSpan = false, paramT, checkLimit;

		if (opt_limit !== null) checkLimit = true;

		for (let i = 1; i <= I; i += 1) {
			const t = i / I, tp = 1 - t;
			func(t, tp, pt);
			const x = pt[0], y = pt[1];

			if (opt_retArea !== null) updateArea(opt_retArea, x, y);
			span += Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));
			px = x;
			py = y;

			if (checkLimit && opt_limit <= span) {
				limitedSpan = span;
				paramT = t;
				checkLimit = false;
			}
		}
		if (checkLimit) {
			limitedSpan = span;
			paramT = 1;
		}
		if (limitedSpan === false) limitedSpan = span;
		return { span, limitedSpan, paramT };
	};

	/**~ja
	 * エリアの情報を更新する
	 * @param {dict} area エリア情報
	 * @param {number} x x座標
	 * @param {number} y y座標
	 */
	/**~en
	 * Update area information
	 * @param {dict} area Area information
	 * @param {number} x X coordinate
	 * @param {number} y Y coordinate
	 */
	const updateArea = function (area, x, y) {
		const fX = area.fromX, fY = area.fromY;
		const sqLen = (x - fX) * (x - fX) + (y - fY) * (y - fY);
		if (area.sqLen < sqLen) {
			area.sqLen = sqLen;
			area.toX = x;
			area.toY = y;
		}
		if (x < area.left)   area.left = x;
		if (y < area.top)    area.top = y;
		if (area.right < x)  area.right = x;
		if (area.bottom < y) area.bottom = y;
	};

	/**~ja
	 * 線分の長さを求める
	 * @param {number} x0 始点x座標
	 * @param {number} y0 始点y座標
	 * @param {number} x1 終点x座標
	 * @param {number} y1 終点y座標
	 * @param {number} I 計算する細かさ
	 * @param {number=} [opt_limit=null] 長さ制限
	 * @param {dict=} [opt_retArea=null] エリアを返す配列
	 * @return {dict} 長さ
	 */
	/**~en
	 * Find the length of a line segment
	 * @param {number} x0 X coordinate of start point
	 * @param {number} y0 Y coordinate of start point
	 * @param {number} x1 X coordinate of end point
	 * @param {number} y1 Y coordinate of end point
	 * @param {number} I Accuracy to calculate
	 * @param {number=} [opt_limit=null] Length limitation
	 * @param {dict=} [opt_retArea=null] An array returning areas
	 * @return {dict} Length of span
	 */
	const _lineLen = function (x0, y0, x1, y1, I, opt_limit = null, opt_retArea = null) {
		return calcSpan(x0, y0, function (t, tp, pt) {
			pt[0] = tp * x0 + t * x1;
			pt[1] = tp * y0 + t * y1;
		}, I, opt_limit, opt_retArea);
	};

	/**~ja
	 * 二次ベジェ曲線の長さを求める
	 * @param {number} x0 始点x座標
	 * @param {number} y0 始点y座標
	 * @param {number} x1 ハンドルx座標
	 * @param {number} y1 ハンドルy座標
	 * @param {number} x2 終点x座標
	 * @param {number} y2 終点y座標
	 * @param {number} I 計算する細かさ
	 * @param {number=} [opt_limit=null] 長さ制限
	 * @param {dict=} [opt_retArea=null] エリアを返す配列
	 * @return {dict} 長さ
	 */
	/**~en
	 * Find the length of a quadratic Bezier curve
	 * @param {number} x0 X coordinate of start point
	 * @param {number} y0 Y coordinate of start point
	 * @param {number} x1 X coordinate of handle
	 * @param {number} y1 Y coordinate of handle
	 * @param {number} x2 X coordinate of end point
	 * @param {number} y2 Y coordinate of end point
	 * @param {number} I Accuracy to calculate
	 * @param {number=} [opt_limit=null] Length limitation
	 * @param {dict=} [opt_retArea=null] An array returning areas
	 * @return {dict} Length of span
	 */
	const _quadLen = function (x0, y0, x1, y1, x2, y2, I, opt_limit = null, opt_retArea = null) {
		return calcSpan(x0, y0, function (t, tp, pt) {
			const k0 = tp * tp, k1 = 2 * t * tp, k2 = t * t;
			pt[0] = k0 * x0 + k1 * x1 + k2 * x2;
			pt[1] = k0 * y0 + k1 * y1 + k2 * y2;
		}, I, opt_limit, opt_retArea);
	};

	/**~ja
	 * 三次ベジェ曲線の長さを求める
	 * @param {number} x0 始点x座標
	 * @param {number} y0 始点y座標
	 * @param {number} x1 ハンドル1x座標
	 * @param {number} y1 ハンドル1y座標
	 * @param {number} x2 ハンドル2x座標
	 * @param {number} y2 ハンドル2y座標
	 * @param {number} x3 終点x座標
	 * @param {number} y3 終点y座標
	 * @param {number} I 計算する細かさ
	 * @param {number=} [opt_limit=null] 長さ制限
	 * @param {dict=} [opt_retArea=null] エリアを返す配列
	 * @return {dict} 長さ
	 */
	/**~en
	 * Find the length of a cubic Bézier curve
	 * @param {number} x0 X coordinate of start point
	 * @param {number} y0 Y coordinate of start point
	 * @param {number} x1 X coordinate of handle 1
	 * @param {number} y1 Y coordinate of handle 1
	 * @param {number} x2 X coordinate of handle 2
	 * @param {number} y2 Y coordinate of handle 2
	 * @param {number} x3 X coordinate of end point
	 * @param {number} y3 Y coordinate of end point
	 * @param {number} I Accuracy to calculate
	 * @param {number=} [opt_limit=null] Length limitation
	 * @param {dict=} [opt_retArea=null] An array returning areas
	 * @return {dict} Length of span
	 */
	const _bezierLen = function (x0, y0, x1, y1, x2, y2, x3, y3, I, opt_limit = null, opt_retArea = null) {
		return calcSpan(x0, y0, function (t, tp, pt) {
			const k0 = tp * tp * tp, k1 = 3 * t * tp * tp;
			const k2 = 3 * t * t * tp, k3 = t * t * t;
			pt[0] = k0 * x0 + k1 * x1 + k2 * x2 + k3 * x3;
			pt[1] = k0 * y0 + k1 * y1 + k2 * y2 + k3 * y3;
		}, I, opt_limit, opt_retArea);
	};

	/**~ja
	 * 円弧の長さを求める
	 * - r0 < r1 なら時計回り、r1 < r0 なら反時計回り
	 * @param {number} cx 中心x座標
	 * @param {number} cy 中心y座標
	 * @param {number} dr 方向
	 * @param {number} w 横半径
	 * @param {number} h たて半径
	 * @param {number} r0 開始角度
	 * @param {number} r1 終了角度
	 * @param {number} I 計算する細かさ
	 * @param {number=} [opt_limit=null] 長さ制限
	 * @param {dict=} [opt_retArea=null] エリアを返す配列
	 * @return {dict} 長さ
	 */
	/**~en
	 * Calculate arc length
	 * - Clockwise if r0 < r1, or counterclockwise if r1 < r0
	 * @param {number} cx X coordinate of center
	 * @param {number} cy Y coordinate of center
	 * @param {number} dr Direction
	 * @param {number} w Width
	 * @param {number} h Height
	 * @param {number} r0 Start angle
	 * @param {number} r1 End angle
	 * @param {number} I Accuracy to calculate
	 * @param {number=} [opt_limit=null] Length limitation
	 * @param {dict=} [opt_retArea=null] An array returning areas
	 * @return {dict} Length of span
	 */
	const _arcLen = function (cx, cy, dr, w, h, r0, r1, I, opt_limit = null, opt_retArea = null) {
		const s0 = w * Math.cos(r0), t0 = h * Math.sin(r0);
		const rsin = Math.sin(dr), rcos = Math.cos(dr);
		const x0 = cx + s0 * rcos - t0 * rsin;
		const y0 = cy + s0 * rsin + t0 * rcos;

		return calcSpan(x0, y0, function (t, tp, pt) {
			const r = tp * r0 + t * r1;
			const st = w * Math.cos(r), tt = h * Math.sin(r);
			pt[0] = cx + st * rcos - tt * rsin;
			pt[1] = cy + st * rsin + tt * rcos;
		}, I, opt_limit, opt_retArea);
	};

	/**~ja
	 * 線分の中間点の座標を求める
	 * @private
	 * @param {number} t 媒介変数
	 * @param {number} x0 点1のx座標
	 * @param {number} y0 点1のy座標
	 * @param {number} x1 点2のx座標
	 * @param {number} y1 点2のy座標
	 * @return {Array<number>} 座標
	 */
	/**~en
	 * Find the coordinates of the midpoint of the line segment
	 * @private
	 * @param {number} t Parameter variable
	 * @param {number} x0 X coordinate of point 1
	 * @param {number} y0 Y coordinate of point 1
	 * @param {number} x1 X coordinate of point 2
	 * @param {number} y1 Y coordinate of point 2
	 * @return {Array<number>} Coordinates
	 */
	const _linePoints = function (t, x0, y0, x1, y1) {
		const tp = 1 - t;
		const x1p = tp * x0 + t * x1, y1p = tp * y0 + t * y1;
		return [x1p, y1p];
	};

	/**~ja
	 * 二次ベジェ曲線の中間点の座標を求める
	 * @private
	 * @param {number} t 媒介変数
	 * @param {number} x0 点1のx座標
	 * @param {number} y0 点1のy座標
	 * @param {number} x1 点2のx座標
	 * @param {number} y1 点2のy座標
	 * @param {number} x2 点3のx座標
	 * @param {number} y2 点3のy座標
	 * @return {Array<number>} 座標
	 */
	/**~en
	 * Find the coordinates of the midpoint of the quadratic Bezier curve
	 * @private
	 * @param {number} t Parameter variable
	 * @param {number} x0 X coordinate of point 1
	 * @param {number} y0 Y coordinate of point 1
	 * @param {number} x1 X coordinate of point 2
	 * @param {number} y1 Y coordinate of point 2
	 * @param {number} x2 X coordinate of point 3
	 * @param {number} y2 Y coordinate of point 3
	 * @return {Array<number>} Coordinates
	 */
	const _quadPoints = function (t, x0, y0, x1, y1, x2, y2) {
		const tp = 1 - t;
		const k0 = tp * tp, k1 = 2 * t * tp, k2 = t * t;
		const x1p = tp * x0 + t * x1, y1p = tp * y0 + t * y1;
		const x2p = k0 * x0 + k1 * x1 + k2 * x2, y2p = k0 * y0 + k1 * y1 + k2 * y2;
		return [x1p, y1p, x2p, y2p];
	};

	/**~ja
	 * 三次ベジェ曲線の中間点の座標を求める
	 * @private
	 * @param {number} t 媒介変数
	 * @param {number} x0 点1のx座標
	 * @param {number} y0 点1のy座標
	 * @param {number} x1 点2のx座標
	 * @param {number} y1 点2のy座標
	 * @param {number} x2 点3のx座標
	 * @param {number} y2 点3のy座標
	 * @param {number} x3 点4のx座標
	 * @param {number} y3 点4のy座標
	 * @return {Array<number>} 座標
	 */
	/**~en
	 * Find the coordinates of the midpoint of the cubic Bezier curve
	 * @private
	 * @param {number} t Parameter variable
	 * @param {number} x0 X coordinate of point 1
	 * @param {number} y0 Y coordinate of point 1
	 * @param {number} x1 X coordinate of point 2
	 * @param {number} y1 Y coordinate of point 2
	 * @param {number} x2 X coordinate of point 3
	 * @param {number} y2 Y coordinate of point 3
	 * @param {number} x3 X coordinate of point 4
	 * @param {number} y3 Y coordinate of point 4
	 * @return {Array<number>} Coordinates
	 */
	const _bezierPoints = function (t, x0, y0, x1, y1, x2, y2, x3, y3) {
		const tp = 1 - t;
		const k0 = tp * tp, k1 = 2 * t * tp, k2 = t * t;
		const k3 = tp * tp * tp, k4 = 3 * t * tp * tp;
		const k5 = 3 * t * t * tp, k6 = t * t * t;
		const x1p = tp * x0 + t * x1,                      y1p = tp * y0 + t * y1;
		const x2p = k0 * x0 + k1 * x1 + k2 * x2,           y2p = k0 * y0 + k1 * y1 + k2 * y2;
		const x3p = k3 * x0 + k4 * x1 + k5 * x2 + k6 * x3, y3p = k3 * y0 + k4 * y1 + k5 * y2 + k6 * y3;
		return [x1p, y1p, x2p, y2p, x3p, y3p];
	};


	//=
	//=include _graphic/_liner.js


	//~ja デフォルト・ハンドラー生成関数 ------------------------------------------
	//~en Default handler generation function -------------------------------------


	/**~ja
	 * デフォルト・ハンドラーを作る
	 * @param {CanvasRenderingContext2D} ctx キャンバス・コンテキスト
	 * @return {*} ハンドラー
	 */
	/**~en
	 * Make a default handler
	 * @param {CanvasRenderingContext2D} ctx Canvas context
	 * @return {*} Handler
	 */
	const makeDefaultHandler = function (ctx) {
		return {
			/**~ja
			 * 線分をかくかペンの場所を変更する
			 * @param {number} x 終点x座標
			 * @param {number} y 終点y座標
			 * @param {number} dir 終点方向
			 */
			/**~en
			 * Draw a line or change the location of the pen
			 * @param {number} x X coordinate of end point
			 * @param {number} y Y coordinate of end point
			 * @param {number} dir End direction
			 */
			lineOrMoveTo: function (x, y, dir) {
				ctx.lineTo(x, y);
			},
			/**~ja
			 * 二次ベジェ曲線をかくかペンの場所を変更する
			 * @param {number} x1 ハンドルx座標
			 * @param {number} y1 ハンドルy座標
			 * @param {number} x2 終点x座標
			 * @param {number} y2 終点y座標
			 * @param {number} dir 終点方向
			 */
			/**~en
			 * Draw a quadratic Bezier curve or change the location of the pen
			 * @param {number} x1 X coordinate of handle
			 * @param {number} y1 Y coordinate of handle
			 * @param {number} x2 X coordinate of end point
			 * @param {number} y2 Y coordinate of end point
			 * @param {number} dir End direction
			 */
			quadCurveOrMoveTo: function (x1, y1, x2, y2, dir) {
				ctx.quadraticCurveTo(x1, y1, x2, y2);
			},
			/**~ja
			 * 三次ベジェ曲線をかくかペンの場所を変更する
			 * @param {number} x1 ハンドル1x座標
			 * @param {number} y1 ハンドル1y座標
			 * @param {number} x2 ハンドル2x座標
			 * @param {number} y2 ハンドル2y座標
			 * @param {number} x3 終点x座標
			 * @param {number} y3 終点y座標
			 * @param {number} dir 終点方向
			 */
			/**~en
			 * Draw a cubic Bezier curve or change the location of the pen
			 * @param {number} x1 X coordinate of handle 1
			 * @param {number} y1 Y coordinate of handle 1
			 * @param {number} x2 X coordinate of handle 2
			 * @param {number} y2 Y coordinate of handle 2
			 * @param {number} x3 X coordinate of end point
			 * @param {number} y3 Y coordinate of end point
			 * @param {number} dir End direction
			 */
			bezierCurveOrMoveTo: function (x1, y1, x2, y2, x3, y3, dir) {
				ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
			},
			/**~ja
			 * 円弧をかくかペンの場所を変更する
			 * @param {number} cx 中心x座標
			 * @param {number} cy 中心y座標
			 * @param {number} dr 方向
			 * @param {number} w 横半径
			 * @param {number} h たて半径
			 * @param {number} r0 開始角度
			 * @param {number} r1 終了角度
			 * @param {boolean} ac 反時計回り？
			 * @param {number} dir 終点方向
			 * @param {number} xx 終点x座標
			 * @param {number} yy 終点y座標
			 */
			/**~en
			 * Draw an arc or change the location of the pen
			 * @param {number} cx X coordinate of center
			 * @param {number} cy Y coordinate of center
			 * @param {number} dr Direction
			 * @param {number} w Width
			 * @param {number} h Height
			 * @param {number} r0 Start angle
			 * @param {number} r1 End angle
			 * @param {boolean} ac Whether it is counterclockwise
			 * @param {number} dir End direction
			 * @param {number} xx X coordinate of end point
			 * @param {number} yy Y coordinate of end point
			 */
			arcOrMoveTo: function (cx, cy, dr, w, h, r0, r1, ac, dir, xx, yy) {
				eclipse(ctx, cx, cy, w, h, dr, r0, r1, ac);
			}
		};
	};


	//=
	//=include _graphic/_edge.js


	//~ja ユーティリティ関数 ------------------------------------------------------
	//~en Utility functions -------------------------------------------------------


	/**~ja
	 * 円や弧をかく関数の引数を整える
	 * @param {number|Array<number>} r 半径（配列なら横半径とたて半径）
	 * @param {number|Array<number>} deg 角度（配列なら開始角度と終了角度）
	 * @param {number} [step=1] 係数
	 * @return {dict} 引数
	 */
	/**~en
	 * Arrange the arguments of functions that draw circles and arcs
	 * @param {number|Array<number>} r Radius (horizontal radius and vertical radius if an array given)
	 * @param {number|Array<number>} deg Degree (start and end angles if an array given)
	 * @param {number} [step=1] Factor
	 * @return {dict} Parameters
	 */
	const arrangeArcParams = function (r, deg, step = 1) {
		const ap = {};

		//~ja 半径の引数を整える（負もOKに）
		//~en Arrange the radius argument (negative also OK)
		if (Array.isArray(r)) {
			//@ifdef ja
			if (r.length < 2) throw new Error('PATH::arrangeArcParams: 半径rは配列なのに、数が一つしか含まれていません。');
			//@endif
			//@ifdef en
			if (r.length < 2) throw new Error('PATH::arrangeArcParams: Although the radius r is an array, it contains only one number.');
			//@endif
			ap.w = r[0] * step;
			ap.h = r[1] * step;
		} else {
			ap.w = ap.h = r * step;
		}
		if (-E < ap.w && ap.w < E) ap.w = (0 < ap.w) ? E : -E;
		if (-E < ap.h && ap.h < E) ap.h = (0 < ap.h) ? E : -E;

		//~ja 角度の引数を整える
		//~en Arrange the degree argument
		if (Array.isArray(deg)) {
			//@ifdef ja
			if (deg.length < 2) throw new Error('PATH::arrangeArcParams: 角度degは配列なのに、数が一つしか含まれていません。');
			//@endif
			//@ifdef en
			if (deg.length < 2) throw new Error('PATH::arrangeArcParams: Although the angle deg is an array, it contains only one number.');
			//@endif
			ap.deg0 = deg[0];
			ap.deg1 = deg[1];
		} else {
			ap.deg0 = 0;
			ap.deg1 = deg;
		}
		return ap;
	};

	/**~ja
	 * 円をかく
	 * @param {CanvasRenderingContext2D} ctx キャンバス・コンテキスト
	 * @param {number} cx 中心x座標
	 * @param {number} cy 中心y座標
	 * @param {number} w 横幅
	 * @param {number} h たて幅
	 * @param {number} dr 向き
	 * @param {number} r0 開始ラジアン
	 * @param {number} r1 終了ラジアン
	 * @param {boolean} ac 反時計回り？
	 */
	/**~en
	 * Draw a circle
	 * @param {CanvasRenderingContext2D} ctx Canvas context
	 * @param {number} cx X coordinate of center
	 * @param {number} cy Y coordinate of center
	 * @param {number} w Width
	 * @param {number} h Height
	 * @param {number} dr Direction
	 * @param {number} r0 Start radian
	 * @param {number} r1 End radian
	 * @param {boolean} ac Whether it is counterclockwise
	 */
	const eclipse = function (ctx, cx, cy, w, h, dr, r0, r1, ac) {
		//~ja 負の半径もOKに
		//~en Negative radius is also OK
		if (w <= 0 || h <= 0 || ctx.ellipse === undefined) {
			ctx.save();
			ctx.translate(cx, cy);
			ctx.rotate(dr);
			ctx.scale(w, h);
			ctx.arc(0, 0, 1, r0, r1, ac);
			ctx.restore();
		} else {
			ctx.ellipse(cx, cy, w, h, dr, r0, r1, ac);
		}
	};


	//~ja ライブラリを作る --------------------------------------------------------
	//~en Create a library --------------------------------------------------------


	return {
		Liner,
		makeDefaultHandler,

		normalEdge,
		sineEdge,
		squareEdge,
		triangleEdge,
		sawtoothEdge,
		absSineEdge,
		noiseEdge,
		mixEdge,

		arrangeArcParams,
		eclipse,
	};

}());
