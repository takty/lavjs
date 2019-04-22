//
// タートル・ライブラリ（TURTLE）
// 日付: 2019-04-22
// 作者: 柳田拓人（Space-Time Inc.）
//
// カメを動かして、絵をかくためのライブラリです。
//


// ライブラリ変数
const TURTLE = (function () {

	'use strict';




	// -------------------------------------------------------------------------
	// ライブラリ中だけで使用するユーティリティ
	// -------------------------------------------------------------------------




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

	// 影をセットする
	const setShadow = function (ctx, blur, off, color = 'rgba(0,0,0,0.5)') {
		ctx.shadowBlur = blur;
		ctx.shadowOffsetX = ctx.shadowOffsetY = off;
		ctx.shadowColor = color;
	};




	// -------------------------------------------------------------------------
	// タートル・ベース (TURTLE.TurtleBase)
	// -------------------------------------------------------------------------




	class TurtleBase {

		// カメを作る（紙／キャンバス・コンテキスト）
		constructor(context, normalDeg) {
			if (!STYLE) throw new Error('Styleライブラリが必要です。');
			if (!PATH) throw new Error('Pathライブラリが必要です。');

			this._ctx = context;  // キャンバス・コンテキスト
			this._stack = [];  // 状態を保存するスタック

			// 以下の変数は値を直接変えないこと
			this._x       = 0;  // x座標
			this._y       = 0;  // y座標
			this._dir     = 0;  // 方向（角度）
			this._step    = 1;  // 1歩の長さ
			this._homeX   = 0;
			this._homeY   = 0;
			this._homeDir = 0;

			this._liner = new PATH.Liner({
				lineOrMoveTo: (x, y, dir) => {
					if (this._pen) this._ctx.lineTo(x, y);
					this._changePos(x, y, dir + 90);
				},
				quadCurveOrMoveTo: (x1, y1, x2, y2, dir) => {
					if (this._pen) this._ctx.quadraticCurveTo(x1, y1, x2, y2);
					this._changePos(x2, y2, dir + 90);
				},
				bezierCurveOrMoveTo: (x1, y1, x2, y2, x3, y3, dir) => {
					if (this._pen) this._ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
					this._changePos(x3, y3, dir + 90);
				},
				arcOrMoveTo: (cx, cy, dr, w, h, r0, r1, ac, dir, xx, yy) => {
					if (this._pen) PATH.eclipse(this._ctx, cx, cy, w, h, dr, r0, r1, ac);
					this._changePos(xx, yy, dir + 90);
				}
			}, normalDeg ? rad(normalDeg) : undefined);

			this._area    = { fromX: 0, toX: 0, left: 0, right: 0, fromY: 0, toY: 0, top: 0, bottom: 0, sqLen: 0 };
			this._mode    = 'stroke';  // 絵を描くモード
			this._stroke  = new STYLE.Stroke();
			this._fill    = new STYLE.Fill();
			this._curMode = this._mode;
			this._pen     = false;  // ペンが上がっているか下がっているか

			this._isClipable = true;
		}

		// 子カメを作る（親カメ）
		makeChild() {
			const child = new Turtle();
			child._setState(this._getState(), false);
			child.pen = () => { return this; };  // ペンの上げ下げをできなくする
			return child;
		}

		// 今の状態を保存する（<コンテキストの状態も保存するか？>）
		save(opt_saveContext = false) {
			if (opt_saveContext === true) this._ctx.save();
			this._stack.push(this._getState());
			return this;
		}

		// 前の状態を復元する（<コンテキストの状態も復元するか？>）
		restore(opt_restoreContext = false) {
			this._setState(this._stack.pop());
			if (opt_restoreContext === true) this._ctx.restore();
			return this;
		}

		// （ライブラリ内だけで使用）状態を取得する
		_getState() {
			return [
				this._x, this._y, this._dir,  // 以下、順番に依存関係あり
				this._step,
				this._liner.edge(),
				this._homeX, this._homeY, this._homeDir,
				Object.assign({}, this._area),
				this._mode,
				new STYLE.Stroke(this._stroke),
				new STYLE.Fill(this._fill),
				this._curMode,
				this._pen,  // ペンの状態は最後
			];
		}

		// （ライブラリ内だけで使用）状態を設定する（状態、ペンの状態を設定するか？）
		_setState(t, applyPenState = true) {
			this._changePos(t[0], t[1], t[2]);  // 以下、順番に依存関係あり
			this.step(t[3]);
			this._liner.edge(t[4]);
			this._homeX = t[5]; this._homeY = t[6]; this._homeDir = t[7];
			this._area = t[8];
			this.mode(t[9]);
			this._stroke = t[10];
			this._fill = t[11];
			this._curMode = t[12];
			if (applyPenState === true) this.pen(t[13]);  // ペンの状態は最後に設定すること（area等を参照しているため）
		}

		// （ライブラリ内だけで使用）場所や方向を変える時に呼ばれる
		_changePos(x, y, opt_deg) {
			this._x = x;
			this._y = y;
			if (opt_deg !== undefined) this._dir = checkDegRange(opt_deg);
		}

		// （ライブラリ内だけで使用）アニメーション用プレースホルダ（アニメーションのスキップをチェックする）
		_getPower() {
			return null;
		}

		// （ライブラリ内だけで使用）アニメーション用プレースホルダ（アニメーションの終わりをチェックする）
		_usePower(consumption) {
			return;
		}


		// -------------------------------- 場所か方向の変化


		// 前に進む（歩数）
		go(step) {
			return this._goPrep(step);  // 前に進むことの逆
		}

		// 後ろに戻る（歩数）
		back(step) {
			return this._goPrep(-step);  // 前に進むことの逆
		}

		// （ライブラリ内だけで使用）前に進む（歩数）
		_goPrep(step) {
			const limit = this._getPower();
			if (limit === 0) return this;
			this._usePower(this._doGo(step, limit));
			return this;
		}

		// （ライブラリ内だけで使用）実際に進む
		_doGo(step, limit, before = false) {
			const x = this._x, y = this._y, dir_ = this._dir - 90, d = step * this._step;
			if (before) before(x, y, dir_, d);
			return this._liner.line(x, y, dir_, d, limit, this._area);
		}

		// 右に回る（角度）
		turnRight(deg) {
			return this._turnPrep(deg);
		}

		// 左に回る（角度）
		turnLeft(deg) {
			return this._turnPrep(-deg);  // 右に回ることの逆
		}

		// （ライブラリ内だけで使用）右に回る（角度）
		_turnPrep(deg) {
			const limit = this._getPower();
			if (limit === 0) return this;
			this._usePower(this._doTurn(deg, limit));
			return this;
		}

		// （ライブラリ内だけで使用）方向を変える
		_doTurn(deg, limit, before = false) {
			const sign = (deg < 0 ? -1 : 1), d = sign * deg;
			let cons;
			if (limit !== null) {
				const f = (90 < d) ? 1 : ((d < 10) ? 5 : (5 - 4 * (d - 10) / 80));  // 10 ~ 90 => 5 ~ 1
				const need = d * f;
				if (limit < need) deg = sign * limit / f;
				cons = Math.min(limit, need);
			} else {
				cons = d;
			}
			if (before) before(this._x, this._y);
			this._changePos(this._x, this._y, this._dir + deg);
			return cons;
		}

		// x座標（<値>）
		x(val) {
			if (val === undefined) return this._x;
			return this.moveTo(val, this._y);
		}

		// y座標（<値>）
		y(val) {
			if (val === undefined) return this._y;
			return this.moveTo(this._x, val);
		}

		// 方向（<角度>）
		direction(deg) {
			if (deg === undefined) return this._dir;
			if (this._getPower() === 0) return this;
			this._changePos(this._x, this._y, deg);
			return this;
		}

		// 移動する（x座標、y座標、<方向>）
		moveTo(x, y, opt_dir) {
			if (this._getPower() === 0) return this;
			if (this._pen) {
				const dir = Math.atan2(y - this._y, x - this._x) * 180.0 / Math.PI;
				const dist = Math.sqrt((x - this._x) * (x - this._x) + (y - this._y) * (y - this._y));
				this._liner.line(this._x, this._y, dir, dist, null, this._area);
			}
			this._changePos(x, y, opt_dir);
			return this;
		}

		// 集まる（別のカメ）
		gatherTo(turtle) {
			return this.moveTo(turtle._x, turtle._y, turtle._dir);
		}

		// ホームに帰る（最初の場所と方向に戻る）
		home() {
			return this.moveTo(this._homeX, this._homeY, this._homeDir);
		}

		// 今の場所をホームに
		setHome() {
			if (this._getPower() === 0) return this;
			this._homeX   = this._x;
			this._homeY   = this._y;
			this._homeDir = this._dir;
			return this;
		}


		// -------------------------------- 場所と方向の変化


		// 右にカーブする（歩数1、角度1、歩数2<、角度2、歩数3>）
		curveRight(step0, deg, step1, opt_deg, opt_step) {
			return this._curvePrep(step0, deg, step1, opt_deg, opt_step);
		}

		// 左にカーブする（歩数1、角度1、歩数2<、角度2、歩数3>）
		curveLeft(step0, deg, step1, opt_deg, opt_step) {
			if (opt_deg === undefined) return this._curvePrep(step0, -deg, step1);
			return this._curvePrep(step0, -deg, step1, -opt_deg, opt_step);
		}

		// （ライブラリ内だけで使用）右にカーブする（歩数1、角度1、歩数2<、角度2、歩数3>）
		_curvePrep(step0, deg, step1, opt_deg, opt_step) {
			const limit = this._getPower();
			if (limit === 0) return this;
			this._usePower(this._doCurve(step0, deg, step1, opt_deg, opt_step, limit));
			return this;
		}

		// （ライブラリ内だけで使用）実際にカーブする
		_doCurve(step0, deg, step1, opt_deg, opt_step, limit, before = false) {
			const x = this._x, y = this._y, dir_ = this._dir - 90, s = this._step;
			const d0 = step0 * s, d1 = step1 * s;

			if (opt_deg === undefined) {
				if (before) before(x, y, dir_, d0, deg, d1);
				return this._liner.quadCurve(x, y, dir_, d0, deg, d1, limit, this._area);
			} else {
				const d2 = opt_step * s;
				if (before) before(x, y, dir_, d0, deg, d1, opt_deg, d2);
				return this._liner.bezierCurve(x, y, dir_, d0, deg, d1, opt_deg, d2, limit, this._area);
			}
		}

		// 右に曲がる弧をかく（半径（配列なら横半径とたて半径）、角度（配列なら開始角度と終了角度））
		arcRight(r, deg) {
			return this._arcPrep(r, deg, false);
		}

		// 左に曲がる弧をかく（半径（配列なら横半径とたて半径）、角度（配列なら開始角度と終了角度））
		arcLeft(r, deg) {
			return this._arcPrep(r, deg, true);
		}

		// （ライブラリ内だけで使用）弧をかく
		_arcPrep(r, deg, isLeft) {
			const limit = this._getPower();
			if (limit === 0) return this;
			this._usePower(this._doArc(r, deg, isLeft, limit));
			return this;
		}

		// （ライブラリ内だけで使用）実際に弧をかく
		_doArc(r, deg, isLeft, limit, before = false) {
			const p = PATH.arrangeArcParams(r, deg, this._step);
			const rev = isLeft ? 0 : Math.PI;  // 時計回りの接線の傾きなのでPIを足す（逆向きにする）

			if (isLeft) {
				p.deg0 = -p.deg0;
				p.deg1 = -p.deg1;
			} else {
				p.deg0 = p.deg0 + 180;
				p.deg1 = p.deg1 + 180;
			}
			const r0 = rad(p.deg0);
			const s0 = p.w * Math.cos(r0), t0 = p.h * Math.sin(r0);
			const a0 = Math.atan2(-(p.h * p.h * s0), (p.w * p.w * t0)) + rev;

			const rot = rad(this._dir - 90) - a0;
			const lrsin = Math.sin(rot), lrcos = Math.cos(rot);
			const lsp = this._x + -s0 * lrcos - -t0 * lrsin;
			const ltp = this._y + -s0 * lrsin + -t0 * lrcos;

			if (before) before(lsp, ltp, rot, p);
			return this._liner.arc(lsp, ltp, rot * 180.0 / Math.PI, p.w, p.h, p.deg0, p.deg1, isLeft, limit, this._area);
		}


		// -------------------------------- その他


		// 1歩の長さ（<値>）
		step(val) {
			if (val === undefined) return this._step;
			this._step = val;
			return this;
		}

		// エッジ（<エッジを決める関数>）
		edge(func) {
			if (func === undefined) return this._liner.edge();
			this._liner.edge(func);
			return this;
		}

		// 今の場所から見て、ある場所がどの角度かを返す（ある場所の座標x、y）
		getDirectionOf(x, y) {
			let d = (Math.atan2(this._y - y, this._x - x) * 180.0 / Math.PI - this._dir - 90);
			while (d < 0) d += 360;
			while (360 <= d) d -= 360;
			return d;
		}

		// 今の場所から見て、ホームがどの角度かを返す
		getDirectionOfHome() {
			return this.getDirectionOf(this._homeX, this._homeY);
		}

		// 今の場所から、ある場所までの距離を返す（ある場所の座標x、y）
		getDistanceTo(x, y) {
			return Math.sqrt((x - this._x) * (x - this._x) + (y - this._y) * (y - this._y));
		}

		// 今の場所から、ホームまでの距離を返す
		getDistanceToHome() {
			return this.getDistanceTo(this._homeX, this._homeY);
		}


		// -------------------------------- 図形の描画


		// 点をかく
		dot() {
			this._drawShape((limit) => {
				let r = this._stroke._width / 2;
				if (limit) r = Math.min(r, limit);
				const dr0 = rad(this._dir - 90), offX = r * Math.cos(dr0), offY = r * Math.sin(dr0);

				this._area.fromX = this._x - offX, this._area.fromY  = this._y - offY;
				this._area.toX   = this._x + offX, this._area.toY    = this._y + offY;
				this._area.left  = this._x - r,    this._area.top    = this._y - r;
				this._area.right = this._x + r,    this._area.bottom = this._y + r;

				if (this._pen) this._ctx.arc(this._x, this._y, r, 0, 2 * Math.PI, false);
				return r;
			});
			return this;
		}

		// 円をかく（半径（配列なら横半径とたて半径）、<弧の角度（配列なら開始角度と終了角度）>、<反時計回り？>）
		circle(r, deg = 360, anticlockwise = false) {
			const p = PATH.arrangeArcParams(r, deg, this._step);
			const cx = this._x, cy = this._y;
			const dr0 = rad(p.deg0 - 90), s1 = p.w * Math.cos(dr0), t1 = p.h * Math.sin(dr0);
			const dr = rad(this._dir), rsin = Math.sin(dr), rcos = Math.cos(dr);
			const x0 = cx + s1 * rcos - t1 * rsin, y0 = cy + s1 * rsin + t1 * rcos;

			this._drawShape((limit) => { return this._doCircle(cx, cy, p, anticlockwise, limit, dr); }, x0, y0);
			return this;
		}

		_doCircle(cx, cy, p, anticlockwise, limit, dr, before = false) {
			if (before) before(cx, cy, p, dr);
			return this._liner.arc(cx, cy, this._dir, p.w, p.h, p.deg0 - 90, p.deg1 - 90, anticlockwise, limit, this._area);
		}

		// （ライブラリ内だけで使用）実際に絵をかく
		_drawShape(doFunc, opt_x = null, opt_y = null) {
			const limit = this._getPower();
			if (limit === 0) return;
			const pen = this._pen;

			this.save();
			if (pen) this.penUp();
			if (opt_x !== null && opt_y !== null) this.moveTo(opt_x, opt_y);
			if (pen) this.penDown();
			this._usePower(doFunc(limit));
			if (pen) this.penUp();
			this.restore();
		}

		// イメージをかく（イメージか紙、中心のx座標、y座標、スケール）
		image(image, cx, cy, scale = 1) {
			const img = (image instanceof CanvasRenderingContext2D) ? image.canvas : image;
			this._ctx.save();
			this.localize();
			this._ctx.drawImage(img, -cx * scale, -cy * scale, img.width * scale, img.height * scale);
			this._ctx.restore();
		}


		// -------------------------------- 描画状態の変化


		// ペンを上げる
		penUp() {
			return this.pen(false);
		}

		// ペンを下ろす
		penDown() {
			return this.pen(true);
		}

		// ペンの状態（下がっているならtrue）（<値>）
		pen(val) {
			if (val === undefined) return this._pen;
			if (this._pen === false && val === true) {
				this._ctx.beginPath();
				this._ctx.moveTo(this._x, this._y);
				// ペンを下げた場所を保存しておく
				this._area.fromX = this._area.left = this._area.right = this._x;
				this._area.fromY = this._area.top = this._area.bottom = this._y;
				this._area.sqLen = 0;
				this._curMode = this._mode.toLowerCase();
			}
			if (this._pen === true && val === false && !this._isNotDrawn()) {
				// ペンを下げた場所と同じ場所でペンを上げたら、パスを閉じる（始点と終点をつなげる）
				if (this._isInPenDownPoint()) this._ctx.closePath();
				this._drawActually();  // 実際に絵をかく
			}
			this._pen = val;
			return this;
		}

		// （ライブラリ内だけで使用）ペンを下ろした場所にいる？
		_isInPenDownPoint() {
			const x = this._x, y = this._y;
			const pdX = this._area.fromX, pdY = this._area.fromY;
			const sqLen = (x - pdX) * (x - pdX) + (y - pdY) * (y - pdY);
			return (sqLen < 0.01);
		}

		// （ライブラリ内だけで使用）実際に絵をかく
		_drawActually() {
			let ms = this._curMode;
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

		// 描くモード（<値>）
		mode(val) {
			if (val === undefined) return this._mode;
			this._mode = val;

			// ペンを下ろしていても、何も描いていないなら
			if (this._pen && this._isNotDrawn()) {
				this._curMode = this._mode.toLowerCase();
			}
			return this;
		}

		// （ライブラリ内だけで使用）何もかいていない？
		_isNotDrawn() {
			const a = this._area, x = this._x, y = this._y;
			if (a.fromX === x && a.left === x && a.right === x && a.fromY === y && a.top === y && a.bottom === y) {
				return true;
			}
			return false;
		}

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


		// -------------------------------- コンテキスト操作


		// キャンバス・コンテキストを返す
		context() {
			return this._ctx;
		}

		// キャンバス・コンテキストをカメの場所と方向に合わせる
		localize() {
			this._ctx.translate(this._x, this._y);
			this._ctx.rotate(rad(this._dir));
		}

		// キャンバス・コンテキストをカメの場所に合わせて拡大縮小する（拡大縮小率）
		scale(rate) {
			this._ctx.translate(this._x, this._y);
			this._ctx.scale(rate, rate);
			this._ctx.translate(-this._x, -this._y);
		}

	}




	// -------------------------------------------------------------------------
	// タートル (TURTLE.Turtle)
	// -------------------------------------------------------------------------




	class Turtle extends TurtleBase {

		// カメを作る（紙／キャンバス・コンテキスト）
		constructor(context, normalDeg) {
			super(context, normalDeg);

			this._visible      = false;  // タートルを表示するか
			this._isAnimating  = false;
			this._aniRemain    = 0;  // 残りパワー（値を直接変えないこと）
			this._aniMax       = 0;  // 最大パワー（値を直接変えないこと）
			this._aniFinished  = true;
			this._lastPenState = false;

			this._curLoc     = [0, 0, 0];
			this._curHomeLoc = [0, 0, 0];
			this._curFnPos   = [0, 0];
			this._curFn      = '';
			this._curAs      = [];
			this._curPen     = false;

			this._onPenChanged = null;
			this._onMoved      = null;
		}

		// ペンが変わったイベントに対応する関数をセットする
		onPenChanged(handler) {
			if (handler === undefined) return this._onPenChanged;
			this._onPenChanged = handler;
			return this;
		}

		// 移動したイベントに対応する関数をセットする
		onMoved(handler) {
			if (handler === undefined) return this._onMoved;
			this._onMoved = handler;
			return this;
		}


		// -------------------------------- 場所か方向の変化


		// 前に進む（歩数）
		go(step) {
			this._curFn = 'go';
			return super.go(step);
		}

		// 後ろに戻る（歩数）
		back(step) {
			this._curFn = 'bk';
			return super.back(step);
		}

		// （ライブラリ内だけで使用）実際に進む
		_doGo(step, limit) {
			return super._doGo(step, limit, (x0, y0, dir_, d) => {
				if (!this._visible) return;
				const r = rad(dir_);
				const x = x0 + d * Math.cos(r);
				const y = y0 + d * Math.sin(r);
				this._curAs = [{ x0, y0 }, { x, y }];
			});
		}

		// 右に回る（角度）
		turnRight(deg) {
			this._curFn = 'tr';
			return super.turnRight(deg);
		}

		// 左に回る（角度）
		turnLeft(deg) {
			this._curFn = 'tl';
			return super.turnLeft(deg);
		}

		// （ライブラリ内だけで使用）方向を変える
		_doTurn(deg, limit) {
			return super._doTurn(deg, limit, (bx, by) => {
				if (!this._visible) return;
				const dir_ = this._dir - 90;
				const r0 = rad(dir_), r1 = rad(dir_ + deg);
				this._curAs = [{ bx, by, r0, r1 }];
			});
		}


		// -------------------------------- 場所と方向の変化


		// 右にカーブする（歩数1、角度1、歩数2<、角度2、歩数3>）
		curveRight(step0, deg, step1, opt_deg, opt_step) {
			this._curFn = 'cr';
			return super.curveRight(step0, deg, step1, opt_deg, opt_step);
		}

		// 左にカーブする（歩数1、角度1、歩数2<、角度2、歩数3>）
		curveLeft(step0, deg, step1, opt_deg, opt_step) {
			this._curFn = 'cl';
			return super.curveLeft(step0, deg, step1, opt_deg, opt_step);
		}

		// （ライブラリ内だけで使用）実際にカーブする
		_doCurve(step0, deg, step1, opt_deg, opt_step, limit) {
			return super._doCurve(step0, deg, step1, opt_deg, opt_step, limit, (x, y, dir_, d0, deg, d1, opt_deg, d2) => {
				if (!this._visible) return;
				const r0 = rad(dir_), r1 = rad(dir_ + deg);
				const x1 = x + d0 * Math.cos(r0), y1 = y + d0 * Math.sin(r0);
				const x2 = x1 + d1 * Math.cos(r1), y2 = y1 + d1 * Math.sin(r1);

				if (opt_deg === undefined) {
					this._curAs = [{ x0: x, y0: y }, { tx: x1, ty: y1 }, { x: x2, y: y2 }];
				} else {
					const r2 = rad(dir_ + deg + opt_deg);
					const x3 = x2 + d2 * Math.cos(r2), y3 = y2 + d2 * Math.sin(r2);
					this._curAs = [{ x0: x, y0: y }, { tx: x1, ty: y1 }, { tx: x2, ty: y2 }, { x: x3, y: y3 }];
				}
			});
		}

		// 右に曲がる弧をかく（半径（配列なら横半径とたて半径）、角度（配列なら開始角度と終了角度））
		arcRight(r, deg) {
			this._curFn = 'ar';
			return super.arcRight(r, deg);
		}

		// 左に曲がる弧をかく（半径（配列なら横半径とたて半径）、角度（配列なら開始角度と終了角度））
		arcLeft(r, deg) {
			this._curFn = 'al';
			return super.arcLeft(r, deg);
		}

		// （ライブラリ内だけで使用）実際に弧をかく
		_doArc(r, deg, isLeft, limit) {
			return super._doArc(r, deg, isLeft, limit, (lsp, ltp, rot, p) => {
				if (this._visible) this._curAs = [{ cx: lsp, cy: ltp, w: p.w, h: p.h, r: rot }];
			});
		}


		// -------------------------------- 図形の描画


		// 点をかく
		dot() {
			this._curFn = 'dot';
			return super.dot();
		}

		// 円をかく（半径（配列なら横半径とたて半径）、<弧の角度（配列なら開始角度と終了角度）>、<反時計回り？>）
		circle(r, deg = 360, anticlockwise = false) {
			this._curFn = 'circle';
			return super.circle(r, deg, anticlockwise);
		}

		_doCircle(cx, cy, p, anticlockwise, limit, dr) {
			return super._doCircle(cx, cy, p, anticlockwise, limit, dr, (cx, cy, p, dr) => {
				if (this._visible) this._curAs = [{ cx: cx, cy: cy, w: p.w, h: p.h, r: dr }];
			});
		}


		// -------------------------------- アニメーション


		// アニメーションを表示する？（<値>）
		visible(val) {
			if (val === undefined) return this._visible;
			this._visible = val;
			return this;
		}

		// アニメーションを次に進める（フレーム数）
		stepNext(num) {
			if (this._isAnimating) {
				if (this._aniFinished) {  // アニメ終わり
					this._isAnimating = false;
					this._stack.pop();  // 保存してあったアニメ開始時点を捨てる
				} else {
					this._drawTurtle(this._ctx);
					this.restore().save();  // アニメ開始時点に戻す
					this._aniMax += num;
				}
			} else {
				if (!this._aniFinished) {  // アニメ始まり
					this._isAnimating = true;
					this.save();  // アニメ開始時点を保存する
				}
			}
			this._aniRemain = this._aniMax;
			this._aniFinished = true;
			this._isClipable = true;
		}

		// アニメーションを最初に戻す
		resetAnimation() {
			if (this._isAnimating) {
				this._isAnimating = false;
				this._stack.pop();  // 保存してあったアニメ開始時点を捨てる
			}
			this._aniMax = 0;
		}

		// （ライブラリ内だけで使用）アニメーションのスキップをチェックする
		_getPower() {
			if (!this._visible) return null;  // アニメーション表示でなかったらnullを返す

			if (this._aniRemain <= 0) {
				this._aniFinished = false;
				this._isClipable = false;
				return 0;
			}
			return this._aniRemain;
		}

		// （ライブラリ内だけで使用）アニメーションの終わりをチェックする
		_usePower(consumption) {
			if (!this._visible) return;  // アニメーション表示でなかったら何もしない

			this._aniRemain -= consumption;
			if (this._aniRemain <= 0) {
				const p = this._pen;
				this.penUp();

				this._aniFinished = false;  // penUpの後の必要あり
				this._isClipable = false;

				// カメをかくための情報を保存しておく
				this._curLoc     = [this._x, this._y, this._dir];
				this._curHomeLoc = [this._homeX, this._homeY, this._homeDir];
				this._curPen     = p;

				if (this._onPenChanged !== null && this._lastPenState !== p) this._onPenChanged(this, p);
				if (this._onMoved !== null) this._onMoved(this, this._x, this._y, p);
				this._lastPenState = p;
			}
		}

		// （ライブラリ内だけで使用）カメ（ホーム）をかく
		_drawTurtle(c) {
			c.save();
			c.setLineDash([]);
			c.globalAlpha = 1;

			this._drawAnchor(c, this._curAs);

			const [hx, hy, hd] = this._curHomeLoc;
			if (hx !== 0 || hy !== 0 || hd !== 0) {  // ホームの場所が変えられていたら
				this._drawTriangle(c, this._curHomeLoc, true, 'Purple', '', 'Magenta');
			}

			this._drawTriangle(c, this._curLoc, this._curPen, 'SeaGreen', 'DarkSeaGreen', 'Lime');
			this._drawFunction(c, this._curLoc, this._curFnPos, this._curFn);

			c.restore();
			this._curFn = '';
			this._curAs = [];
		}

		// （ライブラリ内だけで使用）カメやホームを表す三角をかく
		_drawTriangle(c, loc, pen, downColor, upColor, lineColor) {
			c.save();
			c.translate(loc[0], loc[1]);
			c.rotate(rad(loc[2]));

			c.beginPath();
			c.moveTo(0, -10);
			c.lineTo(8, 8);
			c.lineTo(-8, 8);
			c.closePath();

			c.fillStyle = pen ? downColor : upColor;
			setShadow(c, pen ? 4 : 6, 4);
			c.fill();

			setShadow(c, 0, 0);
			c.lineWidth = 2;
			c.strokeStyle = lineColor;
			c.stroke();
			c.restore();
		}

		// （ライブラリ内だけで使用）カメの実行中の動きをかく
		_drawFunction(c, loc, fnPos, curFn) {
			c.save();
			const offX = loc[0] <= 0 ? 48 : -48;
			const offY = loc[1] <= 0 ? 48 : -48;
			fnPos[0] = fnPos[0] * 0.95 + (loc[0] + offX) * 0.05;
			fnPos[1] = fnPos[1] * 0.95 + (loc[1] + offY) * 0.05;

			c.fillStyle = 'black';
			c.strokeStyle = 'white';
			c.lineWidth = 3;
			c.font = 'bold 26px Consolas, Menlo, "Courier New", Meiryo, monospace';
			c.textAlign = 'center';
			c.translate(fnPos[0], fnPos[1]);
			setShadow(c, 4, 2);
			c.strokeText(curFn, 0, 12);
			setShadow(c, 0, 0);
			c.fillText(curFn, 0, 12);
			c.restore();
		}

		// （ライブラリ内だけで使用）カメのアンカーをかく
		_drawAnchor(c, curPos) {
			for (let p of curPos) {
				if (p.x0 !== undefined) {
					draw(p.x0, p.y0, null, 'Lime', 'DarkSeaGreen', drawCheck);
				} else if (p.x !== undefined) {
					draw(p.x, p.y, null, 'Lime', 'SeaGreen', drawCheck);
				} else if (p.tx !== undefined) {
					draw(p.tx, p.ty, null, 'Magenta', 'Purple', drawCheck);
				} else if (p.cx !== undefined) {
					draw(p.cx, p.cy, null, 'Magenta', 'Purple', drawCheck);
					draw(p.cx, p.cy, p.r, 'Magenta', 'Purple', drawRect, p.w, p.h);
				} else if (p.bx !== undefined) {
					draw(p.bx, p.by, p.r0, 'Magenta', 'DarkPurple', drawLine);
					draw(p.bx, p.by, p.r1, 'Magenta', 'Purple', drawLine);
				}
			}
			function draw(x, y, r, outer, inner, fn, ...args) {
				c.save();
				c.translate(x, y);
				if (r !== null) c.rotate(r);
				c.strokeStyle = outer;
				c.lineWidth = 4;
				setShadow(c, 4, 2);
				fn(...args);

				c.strokeStyle = inner;
				c.lineWidth = 2;
				setShadow(c, 0, 0);
				fn(...args);
				c.restore();
			}
			function drawCheck() {
				c.beginPath();
				c.moveTo(-8, -8);
				c.lineTo( 8,  8);
				c.moveTo( 8, -8);
				c.lineTo(-8,  8);
				c.stroke();
			}
			function drawRect(hw, hh) {
				c.setLineDash([6, 4]);
				c.beginPath();
				c.rect(-hw, -hh, hw * 2, hh * 2);
				c.stroke();
			}
			function drawLine() {
				c.setLineDash([6, 4]);
				c.beginPath();
				c.moveTo(0, 0);
				c.lineTo(128, 0);
				c.stroke();
			}
		}

	}




	// -------------------------------------------------------------------------
	// ユーティリティ関数
	// -------------------------------------------------------------------------




	// タートルを使ってかく関数からスタンプ（高速に絵をかく関数）を作ります（スタンプの横幅、たて幅、スタンプの中心x座標、y座標、拡大率、関数）
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




	// -------------------------------------------------------------------------
	// ライブラリを作る
	// -------------------------------------------------------------------------




	// 関数の別名
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

	// 関数の別名を登録する
	for (let target of [Turtle, TurtleBase]) {
		for (const [orig, aliases] of Object.entries(aliasMap)) {
			for (let alias of aliases) {
				target.prototype[alias] = target.prototype[orig];
			}
		}
	}

	// ライブラリとして返す
	return { Turtle, TurtleBase, makeStamp };

}());
