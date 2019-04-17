//
// パス・ライブラリ（PATH）
// 日付: 2019-03-25
// 作者: 柳田拓人（Space-Time Inc.）
//
// 図形のパスを作るためのライブラリです。
//


// ライブラリ変数
const PATH = (function () {

	'use strict';


	// ================================ ライブラリ中だけで使用するユーティリティ


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

	// 長さを求める（始点x座標、y座標、関数、計算する細かさ、<長さ制限>、<長さ制限があるときに終了tなどを返す配列>、<エリアを返す配列>）
	const calcSpan = function (x0, y0, func, I, opt_limit, opt_retParam, opt_retArea) {
		let px = x0, py = y0, span = 0, pt = [], checkLimit;

		if (opt_limit !== undefined && opt_retParam !== undefined) checkLimit = true;

		for (let i = 1; i <= I; i += 1) {
			const t = i / I, tp = 1 - t;
			func(t, tp, pt);
			const x = pt[0], y = pt[1];

			if (opt_retArea !== undefined) updateArea(opt_retArea, x, y);
			span += Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));
			px = x;
			py = y;

			if (checkLimit && opt_limit <= span) {
				opt_retParam.limitedSpan = span;
				opt_retParam.t = t;
				checkLimit = false;
			}
		}
		if (checkLimit) {
			opt_retParam.limitedSpan = span;
			opt_retParam.t = 1;
		}
		return span;
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

	// 直線の長さを求める（始点x座標、y座標、終点x座標、y座標、計算する細かさ、<長さ制限>、<長さ制限があるときに終了tなどを返す配列>、<エリアを返す配列>）
	const _lineLen = function (x0, y0, x1, y1, I, opt_limit, opt_retParam, opt_retArea) {
		return calcSpan(x0, y0, function (t, tp, pt) {
			pt[0] = tp * x0 + t * x1;
			pt[1] = tp * y0 + t * y1;
		}, I, opt_limit, opt_retParam, opt_retArea);
	};

	// 二次曲線の長さを求める（始点x座標、y座標、ハンドルx座標、y座標、終点x座標、y座標、計算する細かさ、<長さ制限>、<長さ制限があるときに終了tなどを返す配列>、<エリアを返す配列>）
	const _quadCurveLen = function (x0, y0, x1, y1, x2, y2, I, opt_limit, opt_retParam, opt_retArea) {
		return calcSpan(x0, y0, function (t, tp, pt) {
			const k0 = tp * tp, k1 = 2 * t * tp, k2 = t * t;
			pt[0] = k0 * x0 + k1 * x1 + k2 * x2;
			pt[1] = k0 * y0 + k1 * y1 + k2 * y2;
		}, I, opt_limit, opt_retParam, opt_retArea);
	};

	// ベジェ曲線の長さを求める（始点x座標、y座標、ハンドル1x座標、y座標、ハンドル2x座標、y座標、終点x座標、y座標、計算する細かさ、<長さ制限>、<長さ制限があるときに終了tなどを返す配列>、<エリアを返す配列>）
	const _bezierCurveLen = function (x0, y0, x1, y1, x2, y2, x3, y3, I, opt_limit, opt_retParam, opt_retArea) {
		return calcSpan(x0, y0, function (t, tp, pt) {
			const k0 = tp * tp * tp, k1 = 3 * t * tp * tp;
			const k2 = 3 * t * t * tp, k3 = t * t * t;
			pt[0] = k0 * x0 + k1 * x1 + k2 * x2 + k3 * x3;
			pt[1] = k0 * y0 + k1 * y1 + k2 * y2 + k3 * y3;
		}, I, opt_limit, opt_retParam, opt_retArea);
	};

	// 弧の長さを求める（中心x座標、y座標、方向、横半径、たて半径、開始角度、終了角度、計算する細かさ、<長さ制限>、<長さ制限があるときに終了tなどを返す配列>、<エリアを返す配列>）
	// r0 < r1 なら時計回り、r1 < r0 なら反時計回り
	const _arcLen = function (cx, cy, dr, w, h, r0, r1, I, opt_limit, opt_retParam, opt_retArea) {
		const s0 = w * Math.cos(r0), t0 = h * Math.sin(r0);
		const rsin = Math.sin(dr), rcos = Math.cos(dr);
		const x0 = cx + s0 * rcos - t0 * rsin;
		const y0 = cy + s0 * rsin + t0 * rcos;
		return calcSpan(x0, y0, function (t, tp, pt) {
			const r = tp * r0 + t * r1;
			const st = w * Math.cos(r), tt = h * Math.sin(r);
			pt[0] = cx + st * rcos - tt * rsin;
			pt[1] = cy + st * rsin + tt * rcos;
		}, I, opt_limit, opt_retParam, opt_retArea);
	};


	// ================================ ライナー (PATH.Liner)


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

		// 直線をかく（始点x座標、y座標、方向、長さ、長さ制限、<エリアを返す配列>）
		line(x0, y0, dir, dist, opt_limit = null, opt_retArea) {
			const r = rad(dir);
			const x1 = x0 + dist * Math.cos(r), y1 = y0 + dist * Math.sin(r);
			const roughSpan = Math.ceil(Math.abs(dist));
			const p = {};
			const span = _lineLen(x0, y0, x1, y1, roughSpan, opt_limit, p, opt_retArea);

			if (opt_limit !== null) {
				const t = p.t, tp = 1 - t;
				const x1p = tp * x0 + t * x1, y1p = tp * y0 + t * y1;
				return this._lineDraw(dir, x0, y0, r, x1p, y1p, span, p.limitedSpan);
			} else {
				return this._lineDraw(dir, x0, y0, r, x1, y1, span, span);
			}
		}

		// （ライブラリ内だけで使用）直線を実際にかく（終点角度、始点x座標、y座標、方向、終点x座標、y座標、長さ、制限長さ）
		_lineDraw(dirEnd, x0, y0, r, x1, y1, span, limitedSpan) {
			const edge = this._edge;
			if (edge) {
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
			} else {
				this._handler.lineOrMoveTo(x1, y1, dirEnd);
			}
			return limitedSpan;
		}

		// 二次曲線をかく（始点x座標、y座標、方向1、長さ1、方向2、長さ2、長さ制限、<エリアを返す配列>）
		quadCurve(x0, y0, dir, dist0, deg0, dist1, opt_limit = null, opt_retArea) {
			const r0 = rad(dir), r1 = rad(dir + deg0);
			const x1 = x0 + dist0 * Math.cos(r0), y1 = y0 + dist0 * Math.sin(r0);
			const x2 = x1 + dist1 * Math.cos(r1), y2 = y1 + dist1 * Math.sin(r1);
			const roughSpan = Math.ceil(Math.abs(dist0) + Math.abs(dist1));
			const p = {};
			const span = _quadCurveLen(x0, y0, x1, y1, x2, y2, roughSpan, opt_limit, p, opt_retArea);

			if (opt_limit !== null) {
				const t = p.t, tp = 1 - t;
				const k0 = tp * tp, k1 = 2 * t * tp, k2 = t * t;
				const x1p = tp * x0 + t * x1, y1p = tp * y0 + t * y1;
				const x2p = k0 * x0 + k1 * x1 + k2 * x2, y2p = k0 * y0 + k1 * y1 + k2 * y2;
				const dirEnd = deg(Math.atan2(y2p - y1p, x2p - x1p));
				return this._quadCurveDraw(dirEnd, x0, y0, x1p, y1p, x2p, y2p, span, p.limitedSpan);
			} else {
				return this._quadCurveDraw(dir + deg0, x0, y0, x1, y1, x2, y2, span, span);
			}
		}

		// （ライブラリ内だけで使用）二次曲線を実際にかく（終点角度、始点x座標、y座標、ハンドルx座標、y座標、終点x座標、y座標、長さ、制限長さ）
		_quadCurveDraw(dirEnd, x0, y0, x1, y1, x2, y2, span, limitedSpan) {
			const edge = this._edge;
			if (edge) {
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
			} else {
				this._handler.quadCurveOrMoveTo(x1, y1, x2, y2, dirEnd);
			}
			return limitedSpan;
		}

		// ベジェ曲線をかく（始点x座標、y座標、方向1、長さ1、方向2、長さ2、方向3、長さ3、長さ制限、<エリアを返す配列>）
		bezierCurve(x0, y0, dir, dist0, deg0, dist1, deg1, dist2, opt_limit = null, opt_retArea) {
			const r0 = rad(dir), r1 = rad(dir + deg0), r2 = rad(dir + deg0 + deg1);
			const x1 = x0 + dist0 * Math.cos(r0), y1 = y0 + dist0 * Math.sin(r0);
			const x2 = x1 + dist1 * Math.cos(r1), y2 = y1 + dist1 * Math.sin(r1);
			const x3 = x2 + dist2 * Math.cos(r2), y3 = y2 + dist2 * Math.sin(r2);
			const roughSpan = Math.ceil(Math.abs(dist0) + Math.abs(dist1) + Math.abs(dist2));
			const p = {};
			const span = _bezierCurveLen(x0, y0, x1, y1, x2, y2, x3, y3, roughSpan, opt_limit, p, opt_retArea);

			if (opt_limit !== null) {
				const t = p.t, tp = 1 - t;
				const k0 = tp * tp, k1 = 2 * t * tp, k2 = t * t;
				const k3 = tp * tp * tp, k4 = 3 * t * tp * tp;
				const k5 = 3 * t * t * tp, k6 = t * t * t;
				const x1p = tp * x0 + t * x1, y1p = tp * y0 + t * y1;
				const x2p = k0 * x0 + k1 * x1 + k2 * x2, y2p = k0 * y0 + k1 * y1 + k2 * y2;
				const x3p = k3 * x0 + k4 * x1 + k5 * x2 + k6 * x3, y3p = k3 * y0 + k4 * y1 + k5 * y2 + k6 * y3;
				const dirEnd = deg(Math.atan2(y3p - y2p, x3p - x2p));
				return this._bezierCurveDraw(dirEnd, x0, y0, x1p, y1p, x2p, y2p, x3p, y3p, span, p.limitedSpan);
			} else {
				return this._bezierCurveDraw(dir + deg0 + deg1, x0, y0, x1, y1, x2, y2, x3, y3, span, span);
			}
		}

		// （ライブラリ内だけで使用）ベジェ曲線を実際にかく（終点角度、始点x座標、y座標、ハンドル1x座標、y座標、ハンドル2x座標、y座標、終点x座標、y座標、長さ、制限長さ）
		_bezierCurveDraw(dirEnd, x0, y0, x1, y1, x2, y2, x3, y3, span, limitedSpan) {
			const edge = this._edge;
			if (edge) {
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
			} else {
				this._handler.bezierCurveOrMoveTo(x1, y1, x2, y2, x3, y3, dirEnd);
			}
			return limitedSpan;
		}

		// 弧をかく（中心x座標、y座標、方向、横半径、たて半径、開始角度、終了角度、反時計回り？、長さ制限、<エリアを返す配列>）
		arc(cx, cy, dir, w, h, deg0, deg1, anticlockwise = false, opt_limit = null, opt_retArea) {
			const ac = anticlockwise;

			// 負もOKに
			if (-E < w && w < E) w = (0 < w) ? E : -E;
			if (-E < h && h < E) h = (0 < h) ? E : -E;

			deg0 %= 360;
			deg1 %= 360;
			if (Math.abs(deg0) > 180) deg0 += (deg0 < 0) ? 360 : -360
			if (Math.abs(deg1) > 180) deg1 += (deg1 < 0) ? 360 : -360
			if (ac) {  // 向きの考慮に必要
				while (deg0 < deg1) deg1 -= 360;
			} else {
				while (deg1 < deg0) deg1 += 360;
			}
			if (deg0 === deg1) {
				if (ac) deg1 -= 360;
				else deg1 += 360;
			}
			const dr = rad((dir == null) ? 0 : dir), r0 = rad(deg0);
			let r1 = rad(deg1);
			const roughSpan = Math.PI * (w + h);
			const p = {};
			const span = _arcLen(cx, cy, dr, w, h, r0, r1, roughSpan, opt_limit, p, opt_retArea);
			let limitedSpan;

			if (opt_limit !== null) {
				limitedSpan = p.limitedSpan;
				const t = p.t, tp = 1 - t;
				r1 = tp * r0 + t * r1;
			} else {
				limitedSpan = span;
			}
			// r1の座標と角度を計算する。
			const s1 = w * Math.cos(r1), t1 = h * Math.sin(r1);
			const a1 = Math.atan2(-h * h * s1, w * w * t1) + (ac ? 0 : Math.PI);  // 時計回り、反時計回りの接線の傾き
			const dirEnd = deg(dr) + deg(a1);

			this._arcDraw(dirEnd, cx, cy, dr, w, h, r0, r1, ac, span, limitedSpan);
			return limitedSpan;
		}

		// （ライブラリ内だけで使用）弧を実際にかく（終点角度、中心x座標、y座標、方向、横半径、たて半径、開始角度、終了角度、反時計回り？、長さ、制限長さ）
		_arcDraw(dirEnd, cx, cy, dr, w, h, r0, r1, ac, span, limitedSpan) {
			const edge = this._edge;
			if (edge) {
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
			} else {
				// r1の座標を計算する。
				const s1 = w * Math.cos(r1), t1 = h * Math.sin(r1);
				const rsin = Math.sin(dr), rcos = Math.cos(dr);
				const sp = s1 * rcos - t1 * rsin, tp = s1 * rsin + t1 * rcos;
				this._handler.arcOrMoveTo(cx, cy, dr, w, h, r0, r1, ac, dirEnd, cx + sp, cy + tp);
			}
		}

	}


	// ================================ デフォルト・ハンドラー生成関数


	// デフォルト・ハンドラーを作る（コンテキスト）
	const makeDefaultHandler = function (ctx) {
		return {
			// 線をかくかペンの場所を変更する（終点x座標、y座標、終点方向）
			lineOrMoveTo: function (x, y, dir) {
				ctx.lineTo(x, y);
			},
			// 二次曲線をかくかペンの場所を変更する（ハンドルx座標、y座標、終点x座標、y座標、終点方向）
			quadCurveOrMoveTo: function (x1, y1, x2, y2, dir) {
				ctx.quadraticCurveTo(x1, y1, x2, y2);
			},
			// ベジェ曲線をかくかペンの場所を変更する（ハンドル1x座標、y座標、ハンドル2x座標、y座標、終点x座標、y座標、終点方向）
			bezierCurveOrMoveTo: function (x1, y1, x2, y2, x3, y3, dir) {
				ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
			},
			// 弧をかくかペンの場所を変更する（中心x座標、y座標、方向、横半径、たて半径、開始角度、終了角度、反時計回り？、終点方向、終点x座標、y座標）
			arcOrMoveTo: function (cx, cy, dr, w, h, r0, r1, ac, dir, xx, yy) {
				eclipse(ctx, cx, cy, w, h, dr, r0, r1, ac);
			}
		};
	};


	// ================================ エッジ生成関数


	const NORMAL_EDGE = null;

	// 直線のエッジを作る
	const normalEdge = function () {
		return NORMAL_EDGE;
	};

	// サイン波のエッジを作る（<長さ>、<振幅>、<オプション>）
	const sineEdge = function (length = 10, amplitude = 10, opt = {}) {
		return makeEdge(length, amplitude, opt, function (p) {
			return Math.sin(p * Math.PI * 2);
		}, -0.25, 0.25);
	};

	// 矩形波のエッジを作る（<長さ>、<振幅>、<オプション>）
	const squareEdge = function (length = 10, amplitude = 10, opt = {}) {
		return makeEdge(length, amplitude, opt, function (p) {
			if (p < 0.01) return p / 0.01;
			if (p < 0.49) return 1;
			if (p < 0.51) return -(p - 0.5) / 0.01;
			if (p < 0.99) return -1;
			return (p - 1) / 0.01;
		}, -0.01, 0.01);
	};

	// 三角波のエッジを作る（<長さ>、<振幅>、<オプション>）
	const triangleEdge = function (length = 10, amplitude = 10, opt = {}) {
		return makeEdge(length, amplitude, opt, function (p) {
			if (p < 0.25) return p / 0.25;
			if (p < 0.75) return -(p - 0.5) / 0.25;
			return (p - 1) / 0.25;
		}, -0.25, 0.25);
	};

	// のこぎり波のエッジを作る（<長さ>、<振幅>、<オプション>）
	const sawtoothEdge = function (length = 10, amplitude = 10, opt = {}) {
		return makeEdge(length, amplitude, opt, function (p) {
			if (p < 0.49) return p / 0.49;
			if (p < 0.51) return -(p - 0.5) / 0.01;
			return (p - 1) / 0.49;
		}, -0.49, 0.49);
	};

	// サインの絶対値の波形のエッジを作る（<長さ>、<振幅>、<オプション>）
	const absSineEdge = function (length = 10, amplitude = 10, opt = {}) {
		return makeEdge(length, amplitude, opt, function (p) {
			return Math.abs(Math.sin(p * Math.PI + Math.PI / 6)) * 2 - 1;
		}, -1 / 6, 1 / 3);
	};

	// （ライブラリ内だけで使用）エッジを作る（長さ、振幅、オプション、関数（原点を通り振幅±1）、最小値フェーズ、最大値フェーズ）
	const makeEdge = function (length, amplitude, opt, func, minPhase, maxPhase) {
		let amp = 0.5 * amplitude;
		let phase = minPhase, off = 1, rev = 1;

		if (opt.centering) {
			phase = 0;
			off = 0;
		}
		if (opt.reverse) {
			phase = maxPhase;
			rev = -1;
		}
		if (opt.flip) {
			amp *= -1;
		}
		return function (x, max) {
			const l = max / Math.max(1, (~~(max / length)));
			let p = x % l / l + phase;
			if (p < 0) p += 1;
			return (func(p) * rev + off) * amp;
		};
	};


	// ================================ ユーティリティ関数


	// 円や弧をかく関数の引数を整える
	const arrangeArcParams = function (r, deg, step) {
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

	// 円をかく（コンテキスト、中心x座標、y座標、横幅、たて幅、向き、開始ラジアン、終了ラジアン、反時計回り？）
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


	// ================================ ライブラリを作る


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
