//
// ドローイング・ライブラリ（DRAWING）
// 日付: 2018-10-03
// 作者: 柳田拓人（Space-Time Inc.）
//
// 簡単な図形を直接かくためのライブラリです。
// path.jsライブラリが必要です。
// augment関数を使うには、style.jsライブラリが必要です。
//


// ライブラリ変数
const DRAWING = (function () {

	'use strict';


	// ================================ ライブラリ中だけで使用するユーティリティ


	// 角度をラジアンにする
	const rad = function (deg) {
		return deg * Math.PI / 180.0;
	};

	// ラジアンを角度にする
	const deg = function (rad) {
		return rad * 180.0 / Math.PI;
	};


	// ================================ 直接描画関数


	// 円をかく（コンテキスト、中心x座標、y座標、半径（配列の時は横とたての半径）、<向き>、<終了角度（配列の時は開始と終了の角度）>、<反時計回り？>、<エッジ>）
	const drawCircle = function (ctx, cx, cy, r, opt_dir = 0, opt_deg = 360, opt_anticlockwise = false, opt_edge = false, area) {
		const l = new PATH.Liner(PATH.makeDefaultHandler(ctx));
		if (opt_edge !== false) l.edge(opt_edge);
		const p = PATH.arrangeArcParams(r, opt_deg, 1);

		// r0の座標を計算する。
		const r0 = rad(p.deg0), s0 = p.w * Math.cos(r0), t0 = p.h * Math.sin(r0);
		const dr = rad(opt_dir), rsin = Math.sin(dr), rcos = Math.cos(dr);
		const sp = s0 * rcos - t0 * rsin, tp = s0 * rsin + t0 * rcos;

		ctx.beginPath();
		ctx.moveTo(cx + sp, cy + tp);
		if (area !== undefined) {
			area.fromX = cx + sp;
			area.fromY = cy + tp;
		}
		l.arc(cx, cy, opt_dir, p.w, p.h, p.deg0, p.deg1, opt_anticlockwise, null, area);
	};

	// 線をかく（コンテキスト、始点x座標、y座標、終点x座標、y座標、<エッジ>）
	const drawLine = function (ctx, fromX, fromY, toX, toY, opt_edge = false, area) {
		const l = new PATH.Liner(PATH.makeDefaultHandler(ctx));
		if (opt_edge !== false) l.edge(opt_edge);

		const dr = Math.atan2(toY - fromY, toX - fromX);
		const dest = Math.sqrt((toX - fromX) * (toX - fromX) + (toY - fromY) * (toY - fromY));

		ctx.beginPath();
		ctx.moveTo(fromX, fromY);
		if (area !== undefined) {
			area.fromX = fromX;
			area.fromY = fromY;
		}
		l.line(fromX, fromY, deg(dr), dest, null, area);
	};

	// 四角形をかく（コンテキスト、x座標、y座標、横幅，たて幅、<エッジ>）
	const drawRect = function (ctx, x, y, width, height, opt_edge = false) {
		const l = new PATH.Liner(PATH.makeDefaultHandler(ctx));
		if (opt_edge !== false) l.edge(opt_edge);

		ctx.beginPath();
		ctx.moveTo(x, y);
		l.line(x, y, 0, width);
		l.line(x + width, y, 90, height);
		l.line(x + width, y + height, 180, width);
		l.line(x, y + height, -90, height);
	};


	// ================================ ユーティリティ関数


	// キャンバス・コンテキストを拡張する（キャンバス・コンテキスト）
	const augment = (ctx) => {
		ctx.drawFillCircle = (cx, cy, r, dir, deg, anticlockwise, edge) => {
			const area = {fromX: 0, toX: 0, left: 0, right: 0, fromY: 0, toY: 0, top: 0, bottom: 0, sqLen: 0};
			drawCircle(ctx, cx, cy, r, dir, deg, anticlockwise, edge, area);
			ctx.styleFill().draw(area);
		};
		ctx.drawFillLine = (fromX, fromY, toX, toY, edge) => {
			const area = {fromX: 0, toX: 0, left: 0, right: 0, fromY: 0, toY: 0, top: 0, bottom: 0, sqLen: 0};
			drawLine(ctx, fromX, fromY, toX, toY, edge, area);
			ctx.styleFill().draw(area);
		};
		ctx.drawFillRect = (x, y,　width, height, edge) => {
			drawRect(ctx, x, y,　width, height, edge);
			ctx.styleFill().draw({
				fromX: x, fromY: y, toX: x + width, toY: y + height,
				left: x, top: y, right: x + width, bottom: y + height,
			});
		};
		ctx.drawStrokeCircle = (cx, cy, r, dir, deg, anticlockwise, edge) => {
			const area = {fromX: 0, toX: 0, left: 0, right: 0, fromY: 0, toY: 0, top: 0, bottom: 0, sqLen: 0};
			drawCircle(ctx, cx, cy, r, dir, deg, anticlockwise, edge, area);
			ctx.styleStroke().draw(area);
		};
		ctx.drawStrokeLine = (fromX, fromY, toX, toY, edge) => {
			const area = {fromX: 0, toX: 0, left: 0, right: 0, fromY: 0, toY: 0, top: 0, bottom: 0, sqLen: 0};
			drawLine(ctx, fromX, fromY, toX, toY, edge, area);
			ctx.styleStroke().draw(area);
		};
		ctx.drawStrokeRect = (x, y,　width, height, edge) => {
			drawRect(ctx, x, y,　width, height, edge);
			ctx.styleStroke().draw({
				fromX: x, fromY: y, toX: x + width, toY: y + height,
				left: x, top: y, right: x + width, bottom: y + height,
			});
		};
	};


	// ================================ ライブラリを作る


	// ライブラリとして返す
	return { drawCircle, drawLine, drawRect, augment };

}());
