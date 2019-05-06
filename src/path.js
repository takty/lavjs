//
// パス・ライブラリ（PATH）
// 日付: 2019-04-22
// 作者: 柳田拓人（Space-Time Inc.）
//
// 図形のパスを作るためのライブラリです。
//


// ライブラリ変数
const PATH = (function () {

	'use strict';




	// -------------------------------------------------------------------------
	// ライブラリ中だけで使用するユーティリティ
	// -------------------------------------------------------------------------




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




	// -------------------------------------------------------------------------
	// ライナー (PATH.Liner)
	// -------------------------------------------------------------------------




	class Liner {

		// ライナーを作る（描画するキャンバス・コンテキスト、<法線方向>）
		constructor(handler, opt_normalDir = Math.PI / -2) {
			this._handler   = handler;
			this._normalDir = opt_normalDir;  // 法線方向
			this._edge      = NORMAL_EDGE;
		}

		// エッジを設定する（エッジを決める関数）
		edge(func) {
			if (func === undefined) return this._edge;
			this._edge = func;
		}


		// -------------------------------- 線分


		// 線分をかく（始点x、y座標、方向、長さ、<長さ制限>、<エリアを返す配列>）
		line(x0, y0, dir, dist, opt_limit = null, opt_retArea = null) {
			const r = rad(dir);
			const x1 = x0 + dist * Math.cos(r), y1 = y0 + dist * Math.sin(r);
			const roughSpan = Math.ceil(Math.abs(dist));
			return this._linePre(x0, y0, x1, y1, dir, roughSpan, opt_limit, opt_retArea);
		}

		// 線分をかく（始点x、y座標、終点x，y座標、<長さ制限>、<エリアを返す配列>）
		lineAbs(x0, y0, x1, y1, opt_limit = null, opt_retArea = null) {
			const dir = degOf(x0, y0, x1, y1);
			const roughSpan = Math.ceil(lenOf(x0, y0, x1, y1));
			return this._linePre(x0, y0, x1, y1, dir, roughSpan, opt_limit, opt_retArea);
		}

		// （ライブラリ内だけで使用）線分をかく準備をする（始点x、y座標、終点x，y座標，終点方向、長さ、<長さ制限>、<エリアを返す配列>）
		_linePre(x0, y0, x1, y1, dirEnd, roughSpan, opt_limit, opt_retArea) {
			const { span, limitedSpan, paramT } = _lineLen(x0, y0, x1, y1, roughSpan, opt_limit, opt_retArea);

			if (opt_limit === null) {
			} else {
				[x1, y1] = _linePoints(paramT, x0, y0, x1, y1);
			}
			if (this._edge) {
				this._lineDraw(dirEnd, x0, y0, rad(dirEnd), x1, y1, span, limitedSpan, this._edge);
			} else {
				this._handler.lineOrMoveTo(x1, y1, dirEnd);
			}
			return limitedSpan;
		}

		// （ライブラリ内だけで使用）線分を実際にかく（終点方向、始点x、y座標、方向、終点x、y座標、長さ、制限長さ、エッジ）
		_lineDraw(dirEnd, x0, y0, r, x1, y1, span, limitedSpan, edge) {
			const nd = this._normalDir;
			const nR = r + nd, nX = Math.cos(nR), nY = Math.sin(nR);

			for (let i = 0, I = Math.ceil(limitedSpan); i <= I; i += 1) {
				const t = i / I, tp = 1 - t;
				const x = tp * x0 + t * x1, y = tp * y0 + t * y1;
				const l = limitedSpan * t;

				const nD = edge(l, span);
				const nXd = nD * nX, nYd = nD * nY;
				this._handler.lineOrMoveTo(x + nXd, y + nYd, dirEnd);
			}
		}


		// -------------------------------- 二次ベジェ曲線


		// 二次ベジェ曲線をかく（始点x、y座標、方向1、長さ1、方向2、長さ2、<長さ制限>、<エリアを返す配列>）
		quadCurve(x0, y0, dir, dist0, deg0, dist1, opt_limit = null, opt_retArea = null) {
			const r0 = rad(dir), r1 = rad(dir + deg0);
			const x1 = x0 + dist0 * Math.cos(r0), y1 = y0 + dist0 * Math.sin(r0);
			const x2 = x1 + dist1 * Math.cos(r1), y2 = y1 + dist1 * Math.sin(r1);
			const roughSpan = Math.ceil(Math.abs(dist0) + Math.abs(dist1));
			return this._quadCurvePre(x0, y0, x1, y1, x2, y2, dir + deg0, roughSpan, opt_limit, opt_retArea);
		}

		// 二次ベジェ曲線をかく（始点x、y座標、制御点x、y座標、終点x、y座標、<長さ制限>、<エリアを返す配列>）
		quadCurveAbs(x0, y0, x1, y1, x2, y2, opt_limit = null, opt_retArea = null) {
			const roughSpan = Math.ceil(lenOf(x0, y0, x1, y1) + lenOf(x1, y1, x2, y2));
			return this._quadCurvePre(x0, y0, x1, y1, x2, y2, null, roughSpan, opt_limit, opt_retArea);
		}

		// （ライブラリ内だけで使用）二次ベジェ曲線をかく準備をする（始点x、y座標、制御点x、y、終点x、y座標、終点方向、長さ、<長さ制限>、<エリアを返す配列>）
		_quadCurvePre(x0, y0, x1, y1, x2, y2, dirEnd, roughSpan, opt_limit, opt_retArea) {
			const { span, limitedSpan, paramT } = _quadLen(x0, y0, x1, y1, x2, y2, roughSpan, opt_limit, opt_retArea);

			if (opt_limit === null) {
				if (dirEnd === null) dirEnd = degOf(x1, y1, x2, y2);
			} else {
				[x1, y1, x2, y2] = _quadPoints(paramT, x0, y0, x1, y1, x2, y2);
				dirEnd = degOf(x1, y1, x2, y2);
			}
			if (this._edge) {
				this._quadCurveDraw(dirEnd, x0, y0, x1, y1, x2, y2, span, limitedSpan, this._edge);
			} else {
				this._handler.quadCurveOrMoveTo(x1, y1, x2, y2, dirEnd);
			}
			return limitedSpan;
		}

		// （ライブラリ内だけで使用）二次ベジェ曲線を実際にかく（終点方向、始点x、y座標、ハンドルx、y座標、終点x、y座標、長さ、制限長さ、エッジ）
		_quadCurveDraw(dirEnd, x0, y0, x1, y1, x2, y2, span, limitedSpan, edge) {
			const nd = this._normalDir;
			let px = x0, py = y0, l = 0;

			for (let i = 1, I = Math.ceil(limitedSpan); i <= I; i += 1) {
				const t = i / I, tp = 1 - t;
				const k0 = tp * tp, k1 = 2 * t * tp, k2 = t * t;
				const x = k0 * x0 + k1 * x1 + k2 * x2;
				const y = k0 * y0 + k1 * y1 + k2 * y2;
				const at = Math.atan2(y - py, x - px);
				const de = (i === I) ? dirEnd : deg(at);
				l += Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));
				px = x;
				py = y;

				const nD = edge(l, span);
				if (0 !== nD) {
					const nXd = nD * Math.cos(at + nd), nYd = nD * Math.sin(at + nd);
					this._handler.lineOrMoveTo(x + nXd, y + nYd, de);
				} else {
					this._handler.lineOrMoveTo(x, y, de);
				}
			}
		}


		// -------------------------------- 三次ベジェ曲線


		// 三次ベジェ曲線をかく（始点x、y座標、方向1、長さ1、方向2、長さ2、方向3、長さ3、<長さ制限>、<エリアを返す配列>）
		bezierCurve(x0, y0, dir, dist0, deg0, dist1, deg1, dist2, opt_limit = null, opt_retArea = null) {
			const r0 = rad(dir), r1 = rad(dir + deg0), r2 = rad(dir + deg0 + deg1);
			const x1 = x0 + dist0 * Math.cos(r0), y1 = y0 + dist0 * Math.sin(r0);
			const x2 = x1 + dist1 * Math.cos(r1), y2 = y1 + dist1 * Math.sin(r1);
			const x3 = x2 + dist2 * Math.cos(r2), y3 = y2 + dist2 * Math.sin(r2);
			const roughSpan = Math.ceil(Math.abs(dist0) + Math.abs(dist1) + Math.abs(dist2));
			return this._bezierCurvePre(x0, y0, x1, y1, x2, y2, x3, y3, dir + deg0 + deg1, roughSpan, opt_limit, opt_retArea);
		}

		// 三次ベジェ曲線をかく（始点x、y座標、制御点1x、y座標、制御点2x、y座標、終点x、y座標、<長さ制限>、<エリアを返す配列>）
		bezierCurveAbs(x0, y0, x1, y1, x2, y2, x3, y3, opt_limit = null, opt_retArea = null) {
			const roughSpan = Math.ceil(lenOf(x0, y0, x1, y1) + lenOf(x1, y1, x2, y2) + lenOf(x2, y2, x3, y3));
			return this._bezierCurvePre(x0, y0, x1, y1, x2, y2, x3, y3, null, roughSpan, opt_limit, opt_retArea);
		}

		// （ライブラリ内だけで使用）三次ベジェ曲線をかく準備をする（始点x、y座標、制御点1x、y、制御点2x、y、終点x、y座標、終点方向、長さ、<長さ制限>、<エリアを返す配列>）
		_bezierCurvePre(x0, y0, x1, y1, x2, y2, x3, y3, dirEnd, roughSpan, opt_limit, opt_retArea) {
			const { span, limitedSpan, paramT } = _bezierLen(x0, y0, x1, y1, x2, y2, x3, y3, roughSpan, opt_limit, opt_retArea);

			if (opt_limit === null) {
				if (dirEnd === null) dirEnd = degOf(x2, y2, x3, y3);
			} else {
				[x1, y1, x2, y2, x3, y3] = _bezierPoints(paramT, x0, y0, x1, y1, x2, y2, x3, y3);
				dirEnd = degOf(x2, y2, x3, y3);
			}
			if (this._edge) {
				this._bezierCurveDraw(dirEnd, x0, y0, x1, y1, x2, y2, x3, y3, span, limitedSpan, this._edge);
			} else {
				this._handler.bezierCurveOrMoveTo(x1, y1, x2, y2, x3, y3, dirEnd);
			}
			return limitedSpan;
		}

		// （ライブラリ内だけで使用）三次ベジェ曲線を実際にかく（終点方向、始点x、y座標、ハンドル1x、y座標、ハンドル2x、y座標、終点x、y座標、長さ、制限長さ、エッジ）
		_bezierCurveDraw(dirEnd, x0, y0, x1, y1, x2, y2, x3, y3, span, limitedSpan, edge) {
			const nd = this._normalDir;
			let px = x0, py = y0, l = 0;

			for (let i = 1, I = Math.ceil(limitedSpan); i <= I; i += 1) {
				const t = i / I, tp = 1 - t;
				const k0 = tp * tp * tp, k1 = 3 * t * tp * tp;
				const k2 = 3 * t * t * tp, k3 = t * t * t;
				const x = k0 * x0 + k1 * x1 + k2 * x2 + k3 * x3;
				const y = k0 * y0 + k1 * y1 + k2 * y2 + k3 * y3;
				const at = Math.atan2(y - py, x - px);
				const de = (i === I) ? dirEnd : deg(at);
				l += Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));
				px = x;
				py = y;

				const nD = edge(l, span);
				if (0 !== nD) {
					const nXd = nD * Math.cos(at + nd), nYd = nD * Math.sin(at + nd);
					this._handler.lineOrMoveTo(x + nXd, y + nYd, de);
				} else {
					this._handler.lineOrMoveTo(x, y, de);
				}
			}
		}


		// -------------------------------- 円弧


		// 円弧をかく（中心x、y座標、方向、横半径、たて半径、開始角度、終了角度、反時計回り？、長さ制限、<エリアを返す配列>）
		arc(cx, cy, dir, w, h, deg0, deg1, anticlockwise = false, opt_limit = null, opt_retArea = null) {
			if (-E < w && w < E) w = (0 < w) ? E : -E;
			if (-E < h && h < E) h = (0 < h) ? E : -E;

			deg0 %= 360;
			deg1 %= 360;
			if (Math.abs(deg0) > 180) deg0 += (deg0 < 0) ? 360 : -360
			if (Math.abs(deg1) > 180) deg1 += (deg1 < 0) ? 360 : -360
			if (anticlockwise) {  // 向きの考慮に必要
				while (deg0 < deg1) deg1 -= 360;
			} else {
				while (deg1 < deg0) deg1 += 360;
			}
			if (deg0 === deg1) {
				if (anticlockwise) deg1 -= 360;
				else deg1 += 360;
			}
			if (dir == null) dir = 0;
			const roughSpan = Math.PI * (w + h);
			return this._arcPre(cx, cy, rad(dir), w, h, rad(deg0), rad(deg1), anticlockwise, roughSpan, opt_limit, opt_retArea);
		}

		// （ライブラリ内だけで使用）円弧をかく準備をする（中心x、y座標、方向ラジアン、横半径、たて半径、開始ラジアン、終了ラジアン、反時計回り？、長さ、<長さ制限>、<エリアを返す配列>）
		_arcPre(cx, cy, dr, w, h, r0, r1, ac, roughSpan, opt_limit, opt_retArea) {
			const { span, limitedSpan, paramT } = _arcLen(cx, cy, dr, w, h, r0, r1, roughSpan, opt_limit, opt_retArea);

			if (opt_limit === null) {
			} else {
				const t = paramT, tp = 1 - t;
				r1 = tp * r0 + t * r1;
			}
			// r1の角度を計算
			const s1 = w * Math.cos(r1), t1 = h * Math.sin(r1);
			const a1 = Math.atan2(-h * h * s1, w * w * t1) + (ac ? 0 : Math.PI);  // 時計回り、反時計回りの接線の傾き
			const dirEnd = deg(dr) + deg(a1);

			if (this._edge) {
				this._arcDraw(dirEnd, cx, cy, dr, w, h, r0, r1, span, limitedSpan, this._edge);
			} else {
				// r1の座標を計算
				const rsin = Math.sin(dr), rcos = Math.cos(dr);
				const sp = s1 * rcos - t1 * rsin, tp = s1 * rsin + t1 * rcos;
				this._handler.arcOrMoveTo(cx, cy, dr, w, h, r0, r1, ac, dirEnd, cx + sp, cy + tp);
			}
			return limitedSpan;
		}

		// （ライブラリ内だけで使用）円弧を実際にかく（終点方向、中心x、y座標、方向、横半径、たて半径、開始角度、終了角度、長さ、制限長さ、エッジ）
		_arcDraw(dirEnd, cx, cy, dr, w, h, r0, r1, span, limitedSpan, edge) {
			const nd = this._normalDir;
			const rsin = Math.sin(dr), rcos = Math.cos(dr);
			let px = w * Math.cos(r0), py = h * Math.sin(r0), l = 0;

			for (let i = 1, I = Math.ceil(limitedSpan); i <= I; i += 1) {
				const t = i / I, tp = 1 - t;
				const r = tp * r0 + t * r1;
				const x = w * Math.cos(r), y = h * Math.sin(r);
				const at = Math.atan2(y - py, x - px);
				const de = (i === I) ? dirEnd : deg(at + dr);
				l += Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));
				px = x; py = y;

				const nD = edge(l, span);
				let nXd = 0, nYd = 0;
				if (0 !== nD) {
					nXd = nD * Math.cos(at + nd);
					nYd = nD * Math.sin(at + nd);
				}
				const xr = cx + (x + nXd) * rcos - (y + nYd) * rsin;
				const yr = cy + (x + nXd) * rsin + (y + nYd) * rcos;
				this._handler.lineOrMoveTo(xr, yr, de);
			}
		}

	}




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




	// -------------------------------------------------------------------------
	// ユーティリティ関数
	// -------------------------------------------------------------------------




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




	// -------------------------------------------------------------------------
	// ライブラリを作る
	// -------------------------------------------------------------------------




	// ライブラリとして返す
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
