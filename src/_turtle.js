// -------------------------------------------------------------------------
// タートル (TURTLE.Turtle)
// -------------------------------------------------------------------------




class Turtle extends TurtleBase {

	// カメを作る（紙／キャンバス・コンテキスト）
	constructor(context, normalDeg) {
		super(context, normalDeg);

		this._visible = false;  // タートルを表示するか
		this._isAnimating = false;
		this._aniRemain = 0;  // 残りパワー（値を直接変えないこと）
		this._aniMax = 0;  // 最大パワー（値を直接変えないこと）
		this._aniFinished = true;
		this._lastPenState = false;

		this._curLoc = [0, 0, 0];
		this._curHomeLoc = [0, 0, 0];
		this._curFnPos = [0, 0];
		this._curFn = '';
		this._curAs = [];
		this._curPen = false;

		this._onPenChanged = null;
		this._onMoved = null;
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
			this._curLoc = [this._x, this._y, this._dir];
			this._curHomeLoc = [this._homeX, this._homeY, this._homeDir];
			this._curPen = p;

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
			c.lineTo(8, 8);
			c.moveTo(8, -8);
			c.lineTo(-8, 8);
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