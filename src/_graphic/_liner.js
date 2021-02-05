/**~ja
 * ライナー
 * @version 2019-09-03
 */
/**~en
 * Liner
 * @version 2019-09-03
 */
class Liner {

	/**~ja
	 * ライナーを作る
	 * @constructor
	 * @param {*} handler 描画ハンドラー
	 * @param {number=} [opt_normalDir=Math.PI / -2] 法線方向
	 */
	/**~en
	 * Make a liner
	 * @constructor
	 * @param {*} handler Drawing handler
	 * @param {number=} [opt_normalDir=Math.PI / -2] Normal direction
	 */
	constructor(handler, opt_normalDir = Math.PI / -2) {
		this._handler   = handler;
		this._normalDir = opt_normalDir;
		this._edge      = NORMAL_EDGE;
	}

	/**~ja
	 * エッジ
	 * @param {function=} func エッジを決める関数
	 * @return {function|Liner} エッジ／このライナー
	 */
	/**~en
	 * Edge
	 * @param {function=} func Function to determine the edge
	 * @return {function|Liner} Edge, or this liner
	 */
	edge(func, ...fs) {
		if (func === undefined) return this._edge;
		this._edge = fs.length ? PATH.mixEdge(func, ...fs) : func;
	}


	//~ja 線分 --------------------------------------------------------------------
	//~en Line --------------------------------------------------------------------


	/**~ja
	 * 線分をかく
	 * @param {*} x0 始点 x座標
	 * @param {*} y0 始点 y座標
	 * @param {*} dir 方向
	 * @param {*} dist 長さ
	 * @param {*} [opt_limit=null] 長さ制限
	 * @param {*} [opt_retArea=null] エリアを返す配列
	 * @return
	 */
	line(x0, y0, dir, dist, opt_limit = null, opt_retArea = null) {
		const r = rad(dir);
		const x1 = x0 + dist * Math.cos(r), y1 = y0 + dist * Math.sin(r);
		const roughSpan = Math.ceil(Math.abs(dist));
		return this._linePre(x0, y0, x1, y1, dir, roughSpan, opt_limit, opt_retArea);
	}

	/**~ja
	 * 線分をかく（始点x、y座標、終点x，y座標、<長さ制限>、<エリアを返す配列>）
	 * @param {*} x0
	 * @param {*} y0
	 * @param {*} x1
	 * @param {*} y1
	 * @param {*} [opt_limit=null]
	 * @param {*} [opt_retArea=null]
	 * @return
	 */
	lineAbs(x0, y0, x1, y1, opt_limit = null, opt_retArea = null) {
		const dir = degOf(x0, y0, x1, y1);
		const roughSpan = Math.ceil(lenOf(x0, y0, x1, y1));
		return this._linePre(x0, y0, x1, y1, dir, roughSpan, opt_limit, opt_retArea);
	}

	/**~ja
	 * 線分をかく準備をする（始点x、y座標、終点x，y座標，終点方向、長さ、<長さ制限>、<エリアを返す配列>）（ライブラリ内だけで使用）
	 * @private
	 * @param {*} x0
	 * @param {*} y0
	 * @param {*} x1
	 * @param {*} y1
	 * @param {*} dirEnd
	 * @param {*} roughSpan
	 * @param {*} opt_limit
	 * @param {*} opt_retArea
	 * @return
	 */
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

	/**~ja
	 * 線分を実際にかく（終点方向、始点x、y座標、方向、終点x、y座標、長さ、制限長さ、エッジ）（ライブラリ内だけで使用）
	 * @private
	 * @param {*} dirEnd
	 * @param {*} x0
	 * @param {*} y0
	 * @param {*} r
	 * @param {*} x1
	 * @param {*} y1
	 * @param {*} span
	 * @param {*} limitedSpan
	 * @param {*} edge
	 */
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


	//~ja 二次ベジェ曲線 ----------------------------------------------------------
	//~en Quadratic Bezier curve --------------------------------------------------


	/**~ja
	 * 二次ベジェ曲線をかく（始点x、y座標、方向1、長さ1、方向2、長さ2、<長さ制限>、<エリアを返す配列>）
	 * @param {*} x0
	 * @param {*} y0
	 * @param {*} dir
	 * @param {*} dist0
	 * @param {*} deg0
	 * @param {*} dist1
	 * @param {*} [opt_limit=null]
	 * @param {*} [opt_retArea=null]
	 * @return
	 */
	quadCurve(x0, y0, dir, dist0, deg0, dist1, opt_limit = null, opt_retArea = null) {
		const r0 = rad(dir), r1 = rad(dir + deg0);
		const x1 = x0 + dist0 * Math.cos(r0), y1 = y0 + dist0 * Math.sin(r0);
		const x2 = x1 + dist1 * Math.cos(r1), y2 = y1 + dist1 * Math.sin(r1);
		const roughSpan = Math.ceil(Math.abs(dist0) + Math.abs(dist1));
		return this._quadCurvePre(x0, y0, x1, y1, x2, y2, dir + deg0, roughSpan, opt_limit, opt_retArea);
	}

	/**~ja
	 * 二次ベジェ曲線をかく（始点x、y座標、制御点x、y座標、終点x、y座標、<長さ制限>、<エリアを返す配列>）
	 * @param {*} x0
	 * @param {*} y0
	 * @param {*} x1
	 * @param {*} y1
	 * @param {*} x2
	 * @param {*} y2
	 * @param {*} [opt_limit=null]
	 * @param {*} [opt_retArea=null]
	 * @return
	 */
	quadCurveAbs(x0, y0, x1, y1, x2, y2, opt_limit = null, opt_retArea = null) {
		const roughSpan = Math.ceil(lenOf(x0, y0, x1, y1) + lenOf(x1, y1, x2, y2));
		return this._quadCurvePre(x0, y0, x1, y1, x2, y2, null, roughSpan, opt_limit, opt_retArea);
	}

	/**~ja
	 * 二次ベジェ曲線をかく準備をする（始点x、y座標、制御点x、y、終点x、y座標、終点方向、長さ、<長さ制限>、<エリアを返す配列>）（ライブラリ内だけで使用）
	 * @private
	 * @param {*} x0
	 * @param {*} y0
	 * @param {*} x1
	 * @param {*} y1
	 * @param {*} x2
	 * @param {*} y2
	 * @param {*} dirEnd
	 * @param {*} roughSpan
	 * @param {*} opt_limit
	 * @param {*} opt_retArea
	 * @return
	 */
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

	/**~ja
	 * 二次ベジェ曲線を実際にかく（終点方向、始点x、y座標、ハンドルx、y座標、終点x、y座標、長さ、制限長さ、エッジ）（ライブラリ内だけで使用）
	 * @private
	 * @param {*} dirEnd
	 * @param {*} x0
	 * @param {*} y0
	 * @param {*} x1
	 * @param {*} y1
	 * @param {*} x2
	 * @param {*} y2
	 * @param {*} span
	 * @param {*} limitedSpan
	 * @param {*} edge
	 */
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


	//~ja 三次ベジェ曲線 ----------------------------------------------------------
	//~en Cubic Bezier curve ------------------------------------------------------


	/**~ja
	 * 三次ベジェ曲線をかく（始点x、y座標、方向1、長さ1、方向2、長さ2、方向3、長さ3、<長さ制限>、<エリアを返す配列>）
	 * @param {*} x0
	 * @param {*} y0
	 * @param {*} dir
	 * @param {*} dist0
	 * @param {*} deg0
	 * @param {*} dist1
	 * @param {*} deg1
	 * @param {*} dist2
	 * @param {*} [opt_limit=null]
	 * @param {*} [opt_retArea=null]
	 * @return
	 */
	bezierCurve(x0, y0, dir, dist0, deg0, dist1, deg1, dist2, opt_limit = null, opt_retArea = null) {
		const r0 = rad(dir), r1 = rad(dir + deg0), r2 = rad(dir + deg0 + deg1);
		const x1 = x0 + dist0 * Math.cos(r0), y1 = y0 + dist0 * Math.sin(r0);
		const x2 = x1 + dist1 * Math.cos(r1), y2 = y1 + dist1 * Math.sin(r1);
		const x3 = x2 + dist2 * Math.cos(r2), y3 = y2 + dist2 * Math.sin(r2);
		const roughSpan = Math.ceil(Math.abs(dist0) + Math.abs(dist1) + Math.abs(dist2));
		return this._bezierCurvePre(x0, y0, x1, y1, x2, y2, x3, y3, dir + deg0 + deg1, roughSpan, opt_limit, opt_retArea);
	}

	/**~ja
	 * 三次ベジェ曲線をかく（始点x、y座標、制御点1x、y座標、制御点2x、y座標、終点x、y座標、<長さ制限>、<エリアを返す配列>）
	 * @param {*} x0
	 * @param {*} y0
	 * @param {*} x1
	 * @param {*} y1
	 * @param {*} x2
	 * @param {*} y2
	 * @param {*} x3
	 * @param {*} y3
	 * @param {*} [opt_limit=null]
	 * @param {*} [opt_retArea=null]
	 * @return
	 */
	bezierCurveAbs(x0, y0, x1, y1, x2, y2, x3, y3, opt_limit = null, opt_retArea = null) {
		const roughSpan = Math.ceil(lenOf(x0, y0, x1, y1) + lenOf(x1, y1, x2, y2) + lenOf(x2, y2, x3, y3));
		return this._bezierCurvePre(x0, y0, x1, y1, x2, y2, x3, y3, null, roughSpan, opt_limit, opt_retArea);
	}

	/**~ja
	 * 三次ベジェ曲線をかく準備をする（始点x、y座標、制御点1x、y、制御点2x、y、終点x、y座標、終点方向、長さ、<長さ制限>、<エリアを返す配列>）（ライブラリ内だけで使用）
	 * @private
	 * @param {*} x0
	 * @param {*} y0
	 * @param {*} x1
	 * @param {*} y1
	 * @param {*} x2
	 * @param {*} y2
	 * @param {*} x3
	 * @param {*} y3
	 * @param {*} dirEnd
	 * @param {*} roughSpan
	 * @param {*} opt_limit
	 * @param {*} opt_retArea
	 * @return
	 */
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

	/**~ja
	 * 三次ベジェ曲線を実際にかく（終点方向、始点x、y座標、ハンドル1x、y座標、ハンドル2x、y座標、終点x、y座標、長さ、制限長さ、エッジ）（ライブラリ内だけで使用）
	 * @private
	 * @param {*} dirEnd
	 * @param {*} x0
	 * @param {*} y0
	 * @param {*} x1
	 * @param {*} y1
	 * @param {*} x2
	 * @param {*} y2
	 * @param {*} x3
	 * @param {*} y3
	 * @param {*} span
	 * @param {*} limitedSpan
	 * @param {*} edge
	 */
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


	//~ja 円弧 --------------------------------------------------------------------
	//~en Arc ---------------------------------------------------------------------


	/**~ja
	 * 円弧をかく（中心x、y座標、方向、横半径、たて半径、開始角度、終了角度、反時計回り？、長さ制限、<エリアを返す配列>）
	 * @param {*} cx
	 * @param {*} cy
	 * @param {*} dir
	 * @param {*} w
	 * @param {*} h
	 * @param {*} deg0
	 * @param {*} deg1
	 * @param {boolean} [anticlockwise=false]
	 * @param {*} [opt_limit=null]
	 * @param {*} [opt_retArea=null]
	 * @return
	 */
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

	/**~ja
	 * 円弧をかく準備をする（中心x、y座標、方向ラジアン、横半径、たて半径、開始ラジアン、終了ラジアン、反時計回り？、長さ、<長さ制限>、<エリアを返す配列>）（ライブラリ内だけで使用）
	 * @private
	 * @param {*} cx
	 * @param {*} cy
	 * @param {*} dr
	 * @param {*} w
	 * @param {*} h
	 * @param {*} r0
	 * @param {*} r1
	 * @param {*} ac
	 * @param {*} roughSpan
	 * @param {*} opt_limit
	 * @param {*} opt_retArea
	 * @return
	 */
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

	/**~ja
	 * 円弧を実際にかく（終点方向、中心x、y座標、方向、横半径、たて半径、開始角度、終了角度、長さ、制限長さ、エッジ）（ライブラリ内だけで使用）
	 * @private
	 * @param {*} dirEnd
	 * @param {*} cx
	 * @param {*} cy
	 * @param {*} dr
	 * @param {*} w
	 * @param {*} h
	 * @param {*} r0
	 * @param {*} r1
	 * @param {*} span
	 * @param {*} limitedSpan
	 * @param {*} edge
	 */
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