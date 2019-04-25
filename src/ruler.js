//
// 定規ライブラリ（RULER）
// 日付: 2019-04-25
// 作者: 柳田拓人（Space-Time Inc.）
//


// ライブラリ変数
const RULER = (function () {

	'use strict';




	// =========================================================================
	// ライブラリ中だけで使用するユーティリティ
	// =========================================================================




	// 角度をラジアンにする
	const rad = function (deg) {
		return deg * Math.PI / 180.0;
	};

	// 角度を0～360度の範囲にする
	const checkDegRange = function (deg) {
		deg %= 360;
		if (deg < 0) deg += 360;
		return deg;
	};




	// =========================================================================
	// 定規 (RULER.Ruler)
	// =========================================================================




	class Ruler {

		// カメを作る（紙／キャンバス・コンテキスト）
		constructor(context) {
			if (!STYLE) throw new Error('Styleライブラリが必要です。');
			if (!PATH) throw new Error('Pathライブラリが必要です。');

			this._x = 0;
			this._y = 0;
			this._toBeResetArea = true;
			this._beginX = 0;
			this._beginY = 0;

			this._liner  = new PATH.Liner(PATH.makeDefaultHandler(context));
			this._ctx    = context;  // キャンバス・コンテキスト
			this._area   = { fromX: null, toX: null, left: null, right: null, fromY: null, toY: null, top: null, bottom: null, sqLen: null };
			this._stroke = new STYLE.Stroke();
			this._fill   = new STYLE.Fill();
			this._edge   = null;
		}

		_resetArea(x, y) {
			this._area.fromX = this._area.left = this._area.right = x;
			this._area.fromY = this._area.top = this._area.bottom = y;
			this._area.sqLen = 0;
			this._toBeResetArea = false;
			this._beginX = x;
			this._beginY = y;
		}

	
		// -------------------------------- 描画状態の変化


		// 線スタイル（<設定する線スタイル>）
		stroke(opt_stroke) {
			if (opt_stroke === undefined) return this._stroke;
			this._stroke = new STYLE.Stroke(opt_stroke);
			return this;
		}

		// ぬりスタイル（<設定するぬりスタイル>）
		fill(opt_fill) {
			if (opt_fill === undefined) return this._fill;
			this._fill = new STYLE.Fill(opt_fill);
			return this;
		}

		// エッジ（<エッジを決める関数>）
		edge(func) {
			if (func === undefined) return this._liner.edge();
			this._liner.edge(func);
			return this;
		}


		// -------------------------------- コンテキスト操作


		// キャンバス・コンテキストを返す
		context() {
			return this._ctx;
		}


		// -------------------------------- 描画状態の変化


		beginPath() {
			this._ctx.beginPath();
			this._toBeResetArea = true;
		}

		closePath() {
			this.lineTo(this._beginX, this._beginY);
		}

		moveTo(x, y) {
			this._ctx.moveTo(x, y);
			this._x = x;
			this._y = y;
		}

		lineTo(x1, y1) {
			const { _x: x0, _y: y0 } = this;
			if (this._toBeResetArea) this._resetArea(x0, y0);
			this._ctx.moveTo(x0, y0);
			this._liner.lineAbs(x0, y0, x1, y1, null, this._area);
			this._x = x1;
			this._y = y1;
		}

		quadraticCurveTo(x1, y2, x2, y2) {
			const { _x: x0, _y: y0 } = this;
			if (this._toBeResetArea) this._resetArea(x0, y0);
			this._ctx.moveTo(x0, y0);
			this._liner.quadCurveAbs(x0, y0, x1, y1, x2, y2, null, this._area);
			this._x = x2;
			this._y = y2;
		}

		bezierCurveTo(x1, y1, x2, y2, x3, y3) {
			const { _x: x0, _y: y0 } = this;
			if (this._toBeResetArea) this._resetArea(x0, y0);
			this._ctx.moveTo(x0, y0);
			this._liner.bezierCurveAbs(x0, y0, x1, y1, x2, y2, null, this._area);
			this._x = x3;
			this._y = y3;
		}

		arc() {
		}

		arcTo() {
		}

		ellipse() {
		}

		// 四角形をかく（x座標、y座標、横幅，たて幅）
		rect(x, y, width, height) {
			this._resetArea(x, y);
			this._ctx.beginPath();

			this._ctx.moveTo(x, y);
			this._liner.line(x, y, 0, width, null, this._area);
			this._liner.line(x + width, y, 90, height, null, this._area);
			this._liner.line(x + width, y + height, 180, width, null, this._area);
			this._liner.line(x, y + height, -90, height, null, this._area);
		}

		draw(mode) {
			let ms = mode;
			if (ms.match(/(fill|stroke|clip|none)/)) {
				ms = ms.replace(/(fill|stroke|clip)/g, '$1,').replace(/,$/, '').split(',');
			}
			for (let m of ms) {
				switch (m) {
				case 'fill': case 'f':
					this._fill.draw(this._ctx, this._area);
					break;
				case 'stroke': case 's':
					this._stroke.draw(this._ctx, this._area);
					break;
				case 'clip': case 'c':
					if (this._isClipable) this._ctx.clip();
					break;
				}
			}
		}


		// -------------------------------- 直接描画関数


		// 円をかく（中心x座標、y座標、半径（配列の時は横とたての半径）、<向き>、<終了角度（配列の時は開始と終了の角度）>、<反時計回り？>）
		circle(cx, cy, r, opt_dir = 0, opt_deg = 360, opt_anticlockwise = false) {
			const p = PATH.arrangeArcParams(r, opt_deg, 1);

			const r0 = rad(p.deg0), s0 = p.w * Math.cos(r0), t0 = p.h * Math.sin(r0);
			const dr = rad(opt_dir), rsin = Math.sin(dr), rcos = Math.cos(dr);
			const sp = s0 * rcos - t0 * rsin, tp = s0 * rsin + t0 * rcos;

			this._resetArea(cx + sp, cy + tp);
			this._ctx.beginPath();

			this._ctx.moveTo(cx + sp, cy + tp);
			this._liner.arc(cx, cy, opt_dir, p.w, p.h, p.deg0, p.deg1, opt_anticlockwise, null, this._area);
		};

		// 線をかく（始点x座標、y座標、終点x座標、y座標）
		line(fromX, fromY, toX, toY) {
			const dr = Math.atan2(toY - fromY, toX - fromX);
			const dest = Math.sqrt((toX - fromX) * (toX - fromX) + (toY - fromY) * (toY - fromY));

			this._resetArea(fromX, fromY);
			this._ctx.beginPath();

			this._ctx.moveTo(fromX, fromY);
			this._liner.line(fromX, fromY, deg(dr), dest, null, this._area);
		};

	}




	// =========================================================================
	// ライブラリを作る
	// =========================================================================




	// 関数の別名
	const aliasMap = {
	};

	// 関数の別名を登録する
	for (const [orig, aliases] of Object.entries(aliasMap)) {
		for (let alias of aliases) {
			Ruler.prototype[alias] = Ruler.prototype[orig];
		}
	}

	// ライブラリとして返す
	return { Ruler };

}());
