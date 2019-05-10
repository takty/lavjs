//
// パス・ライブラリ（PATH）
// 日付: 2019-04-22
// 作者: 柳田拓人（Space-Time Inc.）
//
// 図形のパスを作るためのライブラリです。
//


/**~ja
 * ライブラリ変数
 */
/**~en
 * Library variable
 */
const PATH = (function () {

	'use strict';


	/**~ja
	 * ライブラリ中だけで使用するユーティリティ ---------------------------------------
	 */
	/**~en
	 * Utilities used only in the library --------------------------------------
	 */


	// 最小値
	const E = 0.0000000000001;

	// 角度をラジアンにする
	const rad = function (deg) {
		return deg * Math.PI / 180.0;
	};

	// ラジアンを角度にする
	const deg = function (rad) {
		return rad * 180.0 / Math.PI;
	};

	// 角度を求める
	const degOf = function (x0, y0, x1, y1) {
		let d = (Math.atan2(y1 - y0, x1 - x0) * 180.0 / Math.PI);
		while (d < 0) d += 360;
		while (360 <= d) d -= 360;
		return d;
	};

	// 長さを求める
	const lenOf = function (x0, y0, x1, y1) {
		return Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
	};

	// 長さを求める（始点x、y座標、関数、計算する細かさ、<長さ制限>、<エリアを返す配列>）
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

	// エリアの情報を更新する
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

	// 線分の長さを求める（始点x、y座標、終点x、y座標、計算する細かさ、<長さ制限>、<エリアを返す配列>）
	const _lineLen = function (x0, y0, x1, y1, I, opt_limit = null, opt_retArea = null) {
		return calcSpan(x0, y0, function (t, tp, pt) {
			pt[0] = tp * x0 + t * x1;
			pt[1] = tp * y0 + t * y1;
		}, I, opt_limit, opt_retArea);
	};

	// 二次ベジェ曲線の長さを求める（始点x、y座標、ハンドルx、y座標、終点x、y座標、計算する細かさ、<長さ制限>、<エリアを返す配列>）
	const _quadLen = function (x0, y0, x1, y1, x2, y2, I, opt_limit = null, opt_retArea = null) {
		return calcSpan(x0, y0, function (t, tp, pt) {
			const k0 = tp * tp, k1 = 2 * t * tp, k2 = t * t;
			pt[0] = k0 * x0 + k1 * x1 + k2 * x2;
			pt[1] = k0 * y0 + k1 * y1 + k2 * y2;
		}, I, opt_limit, opt_retArea);
	};

	// 三次ベジェ曲線の長さを求める（始点x、y座標、ハンドル1x、y座標、ハンドル2x、y座標、終点x、y座標、計算する細かさ、<長さ制限>、<エリアを返す配列>）
	const _bezierLen = function (x0, y0, x1, y1, x2, y2, x3, y3, I, opt_limit = null, opt_retArea = null) {
		return calcSpan(x0, y0, function (t, tp, pt) {
			const k0 = tp * tp * tp, k1 = 3 * t * tp * tp;
			const k2 = 3 * t * t * tp, k3 = t * t * t;
			pt[0] = k0 * x0 + k1 * x1 + k2 * x2 + k3 * x3;
			pt[1] = k0 * y0 + k1 * y1 + k2 * y2 + k3 * y3;
		}, I, opt_limit, opt_retArea);
	};

	// 円弧の長さを求める（中心x、y座標、方向、横半径、たて半径、開始角度、終了角度、計算する細かさ、<長さ制限>、<エリアを返す配列>）
	// r0 < r1 なら時計回り、r1 < r0 なら反時計回り
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

	// 線分の中間点の座標を求める
	const _linePoints = function (t, x0, y0, x1, y1) {
		const tp = 1 - t;
		const x1p = tp * x0 + t * x1, y1p = tp * y0 + t * y1;
		return [x1p, y1p];
	};

	// 二次ベジェ曲線の中間点の座標を求める
	const _quadPoints = function (t, x0, y0, x1, y1, x2, y2) {
		const tp = 1 - t;
		const k0 = tp * tp, k1 = 2 * t * tp, k2 = t * t;
		const x1p = tp * x0 + t * x1, y1p = tp * y0 + t * y1;
		const x2p = k0 * x0 + k1 * x1 + k2 * x2, y2p = k0 * y0 + k1 * y1 + k2 * y2;
		return [x1p, y1p, x2p, y2p];
	};

	// 三次ベジェ曲線の中間点の座標を求める
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
	//=include _liner.js


	// -------------------------------------------------------------------------
	// デフォルト・ハンドラー生成関数
	// -------------------------------------------------------------------------




	// デフォルト・ハンドラーを作る（コンテキスト）
	const makeDefaultHandler = function (ctx) {
		return {
			// 線分をかくかペンの場所を変更する（終点x、y座標、終点方向）
			lineOrMoveTo: function (x, y, dir) {
				ctx.lineTo(x, y);
			},
			// 二次ベジェ曲線をかくかペンの場所を変更する（ハンドルx、y座標、終点x、y座標、終点方向）
			quadCurveOrMoveTo: function (x1, y1, x2, y2, dir) {
				ctx.quadraticCurveTo(x1, y1, x2, y2);
			},
			// 三次ベジェ曲線をかくかペンの場所を変更する（ハンドル1x、y座標、ハンドル2x、y座標、終点x、y座標、終点方向）
			bezierCurveOrMoveTo: function (x1, y1, x2, y2, x3, y3, dir) {
				ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
			},
			// 円弧をかくかペンの場所を変更する（中心x、y座標、方向、横半径、たて半径、開始角度、終了角度、反時計回り？、終点方向、終点x、y座標）
			arcOrMoveTo: function (cx, cy, dr, w, h, r0, r1, ac, dir, xx, yy) {
				eclipse(ctx, cx, cy, w, h, dr, r0, r1, ac);
			}
		};
	};




	//=
	//=include _edge.js


	/**~ja
	 * ユーティリティ関数 ---------------------------------------------------------
	 */
	/**~en
	 * Utility functions -------------------------------------------------------
	 */


	// 円や弧をかく関数の引数を整える
	const arrangeArcParams = function (r, deg, step = 1) {
		const ap = {};

		// 半径の引数を整える（負もOKに）
		if (Array.isArray(r)) {
			if (r.length < 2) throw new Error('PATH::arrangeArcParams: 半径rは配列なのに、数が一つしか含まれていません。');
			ap.w = r[0] * step;
			ap.h = r[1] * step;
		} else {
			ap.w = ap.h = r * step;
		}
		if (-E < ap.w && ap.w < E) ap.w = (0 < ap.w) ? E : -E;
		if (-E < ap.h && ap.h < E) ap.h = (0 < ap.h) ? E : -E;

		// 角度の引数を整える
		if (Array.isArray(deg)) {
			if (deg.length < 2) throw new Error('PATH::arrangeArcParams: 角度degは配列なのに、数が一つしか含まれていません。');
			ap.deg0 = deg[0];
			ap.deg1 = deg[1];
		} else {
			ap.deg0 = 0;
			ap.deg1 = deg;
		}
		return ap;
	};

	// 円をかく（コンテキスト、中心x、y座標、横幅、たて幅、向き、開始ラジアン、終了ラジアン、反時計回り？）
	const eclipse = function (ctx, cx, cy, w, h, dr, r0, r1, ac) {
		if (w <= 0 || h <= 0 || ctx.ellipse === undefined) {  // 負の半径もOKに
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


	/**~ja
	 * ライブラリを作る
	 */
	/**~en
	 * Create a library
	 */


	return {
		Liner,
		makeDefaultHandler,

		normalEdge,
		sineEdge,
		squareEdge,
		triangleEdge,
		sawtoothEdge,
		absSineEdge,

		arrangeArcParams,
		eclipse,
	};

}());
