/**~ja
 * タートル
 * @version 2021-02-06
 */
/**~en
 * Turtle
 * @version 2021-02-06
 */
class Turtle extends TurtleBase {

	/**~ja
	 * カメを作る
	 * @constructor
	 * @param {Paper|CanvasRenderingContext2D} ctx 紙／キャンバス・コンテキスト
	 * @param {number=} normalDeg 標準の方向
	 */
	/**~en
	 * Make a turtle
	 * @constructor
	 * @param {Paper|CanvasRenderingContext2D} ctx Paper or canvas context
	 * @param {number=} normalDeg Normal degree
	 */
	constructor(ctx, normalDeg) {
		super(ctx, normalDeg);

		this._visible      = false;
		this._isAnimating  = false;
		this._aniRemain    = 0;
		this._aniMax       = 0;
		this._aniFinished  = true;
		this._lastPenState = false;

		this._curLoc     = [0, 0, 0];
		this._curHomeLoc = [0, 0, 0];
		this._curFnPos   = [null, null];
		this._curFn      = '';
		this._curAs      = [];
		this._curPen     = false;
		this._curTrans   = this._ctx.getTransform();

		this._onPenChanged = null;
		this._onMoved      = null;
	}

	/**~ja
	 * ペンが変わったイベントに対応する関数をセットする
	 * @param {function} handler 関数
	 * @return {function|Turtle} 関数かこのタートル
	 */
	/**~en
	 * Set the function corresponding to 'Pen changed event'
	 * @param {function} handler Function
	 * @return {function|Turtle} Function, or this turtle
	 */
	onPenChanged(handler) {
		if (handler === undefined) return this._onPenChanged;
		this._onPenChanged = handler;
		return this;
	}

	/**~ja
	 * 移動したイベントに対応する関数をセットする
	 * @param {function} handler 関数
	 * @return {function|Turtle} 関数かこのタートル
	 */
	/**~en
	 * Set the function corresponding to 'moved event'
	 * @param {function} handler Function
	 * @return {function|Turtle} Function, or this turtle
	 */
	onMoved(handler) {
		if (handler === undefined) return this._onMoved;
		this._onMoved = handler;
		return this;
	}


	//~ja 場所か方向の変化 --------------------------------------------------------
	//~en Change of place or direction --------------------------------------------


	/**~ja
	 * 前に進む
	 * @param {number} step 歩数
	 * @return {Turtle} このタートル
	 */
	/**~en
	 * Go forward
	 * @param {number} step Number of steps
	 * @return {Turtle} This turtle
	 */
	go(step) {
		this._curFn = 'go';
		return super.go(step);
	}

	/**~ja
	 * 後ろに戻る
	 * @param {number} step 歩数
	 * @return {Turtle} このタートル
	 */
	/**~en
	 * Go back
	 * @param {number} step Number of steps
	 * @return {Turtle} This turtle
	 */
	back(step) {
		this._curFn = 'bk';
		return super.back(step);
	}

	/**~ja
	 * 実際に進む（ライブラリ内だけで使用）
	 * @private
	 * @param {number} step 歩数
	 * @param {number} limit 制限
	 * @return {number} 実際に動いた量
	 */
	/**~en
	 * Actually go (used only in the library)
	 * @private
	 * @param {number} step Number of steps
	 * @param {number} limit Limitation
	 * @return {number} Amount actually moved
	 */
	_doGo(step, limit) {
		return super._doGo(step, limit, (x0, y0, dir_, d) => {
			if (!this._visible) return;
			const r = rad(dir_);
			const x = x0 + d * Math.cos(r);
			const y = y0 + d * Math.sin(r);
			this._curAs = [{ x0, y0 }, { x, y }];
		});
	}

	/**~ja
	 * 右に回る
	 * @param {number} deg 角度
	 * @return {Turtle} このタートル
	 */
	/**~en
	 * Turn right
	 * @param {number} deg Degree
	 * @return {Turtle} This turtle
	 */
	turnRight(deg) {
		this._curFn = 'tr';
		return super.turnRight(deg);
	}

	/**~ja
	 * 左に回る
	 * @param {number} deg 角度
	 * @return {Turtle} このタートル
	 */
	/**~en
	 * Turn left
	 * @param {number} deg Degree
	 * @return {Turtle} This turtle
	 */
	turnLeft(deg) {
		this._curFn = 'tl';
		return super.turnLeft(deg);
	}

	/**~ja
	 * 実際に方向を変える（ライブラリ内だけで使用）
	 * @private
	 * @param {number} deg 角度
	 * @param {number} limit 制限
	 * @return {number} 実際に動いた量
	 */
	/**~en
	 * Actually change direction (used only in the library)
	 * @private
	 * @param {number} deg Degree
	 * @param {number} limit Limitation
	 * @return {number} Amount actually moved
	 */
	_doTurn(deg, limit) {
		return super._doTurn(deg, limit, (bx, by) => {
			if (!this._visible) return;
			const dir_ = this._dir - 90;
			const r0 = rad(dir_), r1 = rad(dir_ + deg);
			this._curAs = [{ bx, by, r0, r1 }];
		});
	}


	//~ja 場所と方向の変化 --------------------------------------------------------
	//~en Change of place and direction -------------------------------------------


	/**~ja
	 * 右にカーブする
	 * @param {number} step0 歩数1
	 * @param {number} deg 角度1
	 * @param {number} step1 歩数2
	 * @param {number=} opt_deg 角度2（オプション）
	 * @param {number=} opt_step 歩数3（オプション）
	 * @return {Turtle} このタートル
	 */
	/**~en
	 * Curve to the right
	 * @param {number} step0 Number of steps 1
	 * @param {number} deg Degree 1
	 * @param {number} step1 Number of steps 2
	 * @param {number=} opt_deg Degree 2 (optional)
	 * @param {number=} opt_step Number of steps 3 (optional)
	 * @return {Turtle} This turtle
	 */
	curveRight(step0, deg, step1, opt_deg, opt_step) {
		this._curFn = 'cr';
		return super.curveRight(step0, deg, step1, opt_deg, opt_step);
	}

	/**~ja
	 * 左にカーブする
	 * @param {number} step0 歩数1
	 * @param {number} deg 角度1
	 * @param {number} step1 歩数2
	 * @param {number=} opt_deg 角度2（オプション）
	 * @param {number=} opt_step 歩数3（オプション）
	 * @return {Turtle} このタートル
	 */
	/**~en
	 * Curve to the left
	 * @param {number} step0 Number of steps 1
	 * @param {number} deg Degree 1
	 * @param {number} step1 Number of steps 2
	 * @param {number=} opt_deg Degree 2 (optional)
	 * @param {number=} opt_step Number of steps 3 (optional)
	 * @return {Turtle} This turtle
	 */
	curveLeft(step0, deg, step1, opt_deg, opt_step) {
		this._curFn = 'cl';
		return super.curveLeft(step0, deg, step1, opt_deg, opt_step);
	}

	/**~ja
	 * 実際にカーブする（ライブラリ内だけで使用）
	 * @private
	 * @param {number} step0 歩数1
	 * @param {number} deg 角度1
	 * @param {number} step1 歩数2
	 * @param {number=} opt_deg 角度2（オプション）
	 * @param {number=} opt_step 歩数3（オプション）
	 * @param {number} limit 制限
	 * @param {function=} [before=null] 実際に動く前に呼ばれる関数
	 * @return {number} 実際に動いた量
	 */
	/**~en
	 * Actually curve (used only in the library)
	 * @private
	 * @param {number} step0 Number of steps 1
	 * @param {number} deg Degree 1
	 * @param {number} step1 Number of steps 2
	 * @param {number=} opt_deg Degree 2 (optional)
	 * @param {number=} opt_step Number of steps 3 (optional)
	 * @param {number} limit Limitation
	 * @param {function=} [before=null] Function to be called before it actually moves
	 * @return {number} Amount actually moved
	 */
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

	/**~ja
	 * 右に曲がる弧をかく
	 * @param {number|Array<number>} r 半径（配列なら横半径とたて半径）
	 * @param {number|Array<number>} deg 角度（配列なら開始角度と終了角度）
	 * @return {Turtle} このタートル
	 */
	/**~en
	 * Draw an arc that turns to the right
	 * @param {number|Array<number>} r Radius (horizontal radius and vertical radius if an array given)
	 * @param {number|Array<number>} deg Degree (start and end angles if an array given)
	 * @return {Turtle} This turtle
	 */
	arcRight(r, deg) {
		this._curFn = 'ar';
		return super.arcRight(r, deg);
	}

	/**~ja
	 * 左に曲がる弧をかく
	 * @param {number|Array<number>} r 半径（配列なら横半径とたて半径）
	 * @param {number|Array<number>} deg 角度（配列なら開始角度と終了角度）
	 * @return {Turtle} このタートル
	 */
	/**~en
	 * Draw an arc that turns to the left
	 * @param {number|Array<number>} r Radius (horizontal radius and vertical radius if an array given)
	 * @param {number|Array<number>} deg Degree (start and end angles if an array given)
	 * @return {Turtle} This turtle
	 */
	arcLeft(r, deg) {
		this._curFn = 'al';
		return super.arcLeft(r, deg);
	}

	/**~ja
	 * 実際に弧をかく（ライブラリ内だけで使用）
	 * @private
	 * @param {number|Array<number>} r 半径（配列なら横半径とたて半径）
	 * @param {number|Array<number>} deg 角度（配列なら開始角度と終了角度）
	 * @param {boolean} isLeft 左かどうか
	 * @param {number} limit 制限
	 * @return {number} 実際に動いた量
	 */
	/**~en
	 * Actually draw an arc (used only in the library)
	 * @private
	 * @param {number|Array<number>} r Radius (horizontal radius and vertical radius if an array given)
	 * @param {number|Array<number>} deg Degree (start and end angles if an array given)
	 * @param {boolean} isLeft Whether it is left
	 * @param {number} limit Limitation
	 * @return {number} Amount actually moved
	 */
	_doArc(r, deg, isLeft, limit) {
		return super._doArc(r, deg, isLeft, limit, (lsp, ltp, rot, p) => {
			if (this._visible) this._curAs = [{ cx: lsp, cy: ltp, w: p.w, h: p.h, r: rot }];
		});
	}


	//~ja 図形の描画 --------------------------------------------------------------
	//~en Draw a shape ------------------------------------------------------------


	/**~ja
	 * 点をかく
	 * @return {Turtle} このタートル
	 */
	/**~en
	 * Draw a point
	 * @return {Turtle} This turtle
	 */
	dot() {
		this._curFn = 'dot';
		return super.dot();
	}

	/**~ja
	 * 円をかく
	 * @param {number|Array<number>} r 半径（配列なら横半径とたて半径）
	 * @param {number|Array<number>=} [deg=360] 弧の角度（配列なら開始角度と終了角度）
	 * @param {boolean=} [anticlockwise=false] 反時計回り？
	 * @return {Turtle} このタートル
	 */
	/**~en
	 * Draw a circle
	 * @param {number|Array<number>} r Radius (horizontal radius and vertical radius if an array given)
	 * @param {number|Array<number>} deg Degree (start and end angles if an array given)
	 * @param {boolean=} [anticlockwise=false] Whether it is counterclockwise
	 * @return {Turtle} This turtle
	 */
	circle(r, deg = 360, anticlockwise = false) {
		this._curFn = 'circle';
		return super.circle(r, deg, anticlockwise);
	}

	/**~ja
	 * 実際に円をかく（ライブラリ内だけで使用）
	 * @private
	 * @param {number} cx 中心のx座標
	 * @param {number} cy 中心のy座標
	 * @param {dict} p パラメター
	 * @param {boolean} anticlockwise 反時計回り？
	 * @param {number} limit 制限
	 * @param {number} dr 方向
	 * @return {number} 実際に動いた量
	 */
	/**~en
	 * Actually draw a circle (used only in the library)
	 * @private
	 * @param {number} cx X coordinate of center
	 * @param {number} cy Y coordinate of center
	 * @param {dict} p Parameters
	 * @param {boolean} anticlockwise Whether it is counterclockwise
	 * @param {number} limit Limitation
	 * @param {number} dr Direction
	 * @return {number} Amount actually moved
	 */
	_doCircle(cx, cy, p, anticlockwise, limit, dr) {
		return super._doCircle(cx, cy, p, anticlockwise, limit, dr, (cx, cy, p, dr) => {
			if (this._visible) this._curAs = [{ cx: cx, cy: cy, w: p.w, h: p.h, r: dr }];
		});
	}


	//~ja アニメーション ----------------------------------------------------------
	//~en Animation ---------------------------------------------------------------


	/**~ja
	 * アニメーションを表示する？
	 * @param {boolean} val 値
	 * @return {boolean|Turtle} アニメーションを表示する？／このタートル
	 */
	/**~en
	 * Whether to show animation
	 * @param {boolean} val Value
	 * @return {boolean|Turtle} Whether to show animation, or this turtle
	 */
	visible(val) {
		if (val === undefined) return this._visible;
		this._visible = val;
		return this;
	}

	/**~ja
	 * アニメーションを次に進める
	 * @param {number} num フレーム数
	 */
	/**~en
	 * Step the animation next
	 * @param {number} num Number of frames
	 */
	stepNext(num) {
		if (this._isAnimating) {
			//~ja アニメ終わり
			//~en Animation ends
			if (this._aniFinished) {
				this._isAnimating = false;
				//~ja 保存してあったアニメ開始時点を捨てる
				//~en Discard saved state at the animation start time
				this._stack.pop();
			} else {
				this._drawTurtle(this._ctx);
				//~ja アニメ開始時点に戻す
				//~en Revert to the beginning of the animation
				this.restore().save();
				this._aniMax += num;
			}
		} else {
			//~ja アニメ始まり
			//~en Animation starts
			if (!this._aniFinished) {
				this._isAnimating = true;
				//~ja アニメ開始時点を保存する
				//~en Save the state at the animation start time
				this.save();
			}
		}
		this._aniRemain = this._aniMax;
		this._aniFinished = true;
		this._isClippable = true;
	}

	/**~ja
	 * アニメーションを最初に戻す
	 */
	/**~en
	 * Reset the animation to beginning
	 */
	resetAnimation() {
		if (this._isAnimating) {
			this._isAnimating = false;
			//~ja 保存してあったアニメ開始時点を捨てる
			//~en Discard saved state at the animation start time
			this._stack.pop();
		}
		this._aniMax = 0;
	}

	/**~ja
	 * アニメーションのスキップをチェックする（ライブラリ内だけで使用）
	 * @private
	 * @return {number} 残りのパワー
	 */
	/**~en
	 * Check the animation skip (used only in the library)
	 * @private
	 * @return {number} Remaining power
	 */
	_getPower() {
		//~ja アニメーション表示でなかったらnullを返す
		//~en Return null if the animation disabled
		if (!this._visible) return null;

		if (this._aniRemain <= 0) {
			this._aniFinished = false;
			this._isClippable = false;
			return 0;
		}
		return this._aniRemain;
	}

	/**~ja
	 * アニメーションの終わりをチェックする（ライブラリ内だけで使用）
	 * @private
	 * @param {number} consumption 消費パワー
	 */
	/**~en
	 * Check the end of the animation (used only in the library)
	 * @private
	 * @param {number} consumption Power consumption
	 */
	_usePower(consumption) {
		if (!this._visible) return;

		this._aniRemain -= consumption;
		if (this._aniRemain <= 0) {
			const p = this._pen;
			this.penUp();

			//~ja penUpの後の必要あり
			//~en Need after penUp
			this._aniFinished = false;
			this._isClippable = false;

			//~ja カメをかくための情報を保存しておく
			//~en Save information for drawing the turtle
			this._curLoc     = [this._x, this._y, this._dir];
			this._curHomeLoc = [this._homeX, this._homeY, this._homeDir];
			this._curPen     = p;
			this._curTrans   = this._ctx.getTransform();

			if (this._onPenChanged !== null && this._lastPenState !== p) this._onPenChanged(this, p);
			if (this._onMoved !== null) this._onMoved(this, this._x, this._y, p);
			this._lastPenState = p;
		}
	}

	/**~ja
	 * 座標に行列を適用する（ライブラリ内だけで使用）
	 * @private
	 * @param {Array} t 行列
	 * @param {number} x x座標
	 * @param {number} y y座標
	 * @param {number} r 方向
	 */
	/**~en
	 * Apply matrix to coordinates (used only in the library)
	 * @private
	 * @param {Array} t Matrix
	 * @param {number} x x coordinate
	 * @param {number} y y coordinate
	 * @param {number} r Degree
	 */
	_transform(t, x, y, r) {
		if (t === null) return [x, y, r];
		const nx = t.a * x + t.c * y + t.e;
		const ny = t.b * x + t.d * y + t.f;
		return [nx, ny, r];
	}

	/**~ja
	 * カメ（ホーム）をかく（ライブラリ内だけで使用）
	 * @private
	 * @param {Paper|CanvasRenderingContext2D} ctx 紙／キャンバス・コンテキスト
	 */
	/**~en
	 * Draw the turtle (home) (used only in the library)
	 * @private
	 * @param {Paper|CanvasRenderingContext2D} ctx Paper or canvas context
	 */
	_drawTurtle(ctx) {
		ctx.save();
		ctx.setLineDash([]);
		ctx.globalAlpha = 1;

		if (this._curTrans) ctx.setTransform(this._curTrans);
		this._drawAnchor(ctx, this._curAs);

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		let [hx, hy, hd] = this._curHomeLoc;
		//~ja ホームの場所が変えられていたら
		//~en If home location has been changed
		if (hx !== 0 || hy !== 0 || hd !== 0) {
			if (this._curTrans) [hx, hy, hd] = this._transform(this._curTrans, hx, hy, hd);
			this._drawTriangle(ctx, [hx, hy, hd], true, 'Purple', '', 'Magenta');
		}
		let [x, y, d] = this._curLoc;
		if (this._curTrans) [x, y, d] = this._transform(this._curTrans, x, y, d);
		this._drawTriangle(ctx, [x, y, d], this._curPen, 'SeaGreen', 'DarkSeaGreen', 'Lime');
		this._drawFunction(ctx, [x, y, d], this._curFnPos, this._curFn);

		ctx.restore();
		this._curFn = '';
		this._curAs = [];
	}

	/**~ja
	 * カメやホームを表す三角をかく（ライブラリ内だけで使用）
	 * @private
	 * @param {Paper|CanvasRenderingContext2D} ctx 紙／キャンバス・コンテキスト
	 * @param {*} loc 場所
	 * @param {*} pen ペンの状態
	 * @param {*} downColor ペンを下げているときの色
	 * @param {*} upColor ペンを上げているときの色
	 * @param {*} lineColor 線の色
	 */
	/**~en
	 * Draw a triangle representing a turtle or home (used only in the library)
	 * @private
	 * @param {Paper|CanvasRenderingContext2D} ctx Paper or canvas context
	 * @param {*} loc Location
	 * @param {*} pen Pen state
	 * @param {*} downColor Color when putting down the pen
	 * @param {*} upColor Color when raising up the pen
	 * @param {*} lineColor Line color
	 */
	_drawTriangle(ctx, loc, pen, downColor, upColor, lineColor) {
		ctx.save();
		ctx.translate(loc[0], loc[1]);
		ctx.rotate(rad(loc[2]));

		ctx.beginPath();
		ctx.moveTo(0, -10);
		ctx.lineTo(8, 8);
		ctx.lineTo(-8, 8);
		ctx.closePath();

		ctx.fillStyle = pen ? downColor : upColor;
		Turtle._setShadow(ctx, pen ? 4 : 6, 4);
		ctx.fill();

		Turtle._setShadow(ctx, 0, 0);
		ctx.lineWidth = 2;
		ctx.strokeStyle = lineColor;
		ctx.stroke();
		ctx.restore();
	}

	/**~ja
	 * カメの実行中の動きをかく（ライブラリ内だけで使用）
	 * @private
	 * @param {Paper|CanvasRenderingContext2D} ctx 紙／キャンバス・コンテキスト
	 * @param {number[]} loc 場所
	 * @param {number[]} fnPos 関数をかく場所
	 * @param {string} curFn 現在の関数
	 */
	/**~en
	 * Draw the running function of the turtle (used only in the library)
	 * @private
	 * @param {Paper|CanvasRenderingContext2D} ctx Paper or canvas context
	 * @param {number[]} loc Location
	 * @param {number[]} fnPos Location of drawing function
	 * @param {string} curFn Current function
	 */
	_drawFunction(ctx, loc, fnPos, curFn) {
		ctx.save();
		const offX = loc[0] <= 0 ? 48 : -48;
		const offY = loc[1] <= 0 ? 48 : -48;
		if (fnPos[0] === null || fnPos[1] === null) {
			fnPos[0] = loc[0] + offX;
			fnPos[1] = loc[1] + offY;
		} else {
			fnPos[0] = fnPos[0] * 0.95 + (loc[0] + offX) * 0.05;
			fnPos[1] = fnPos[1] * 0.95 + (loc[1] + offY) * 0.05;
		}

		ctx.fillStyle = 'black';
		ctx.strokeStyle = 'white';
		ctx.lineWidth = 3;
		ctx.font = 'bold 26px Consolas, Menlo, "Courier New", Meiryo, monospace';
		ctx.textAlign = 'center';
		ctx.translate(fnPos[0], fnPos[1]);
		Turtle._setShadow(ctx, 4, 2);
		ctx.strokeText(curFn, 0, 12);
		Turtle._setShadow(ctx, 0, 0);
		ctx.fillText(curFn, 0, 12);
		ctx.restore();
	}

	/**~ja
	 * カメのアンカーをかく（ライブラリ内だけで使用）
	 * @private
	 * @param {Paper|CanvasRenderingContext2D} ctx 紙／キャンバス・コンテキスト
	 * @param {Array} curPos 場所
	 */
	/**~en
	 * Draw a turtle anchors (used only in the library)
	 * @private
	 * @param {Paper|CanvasRenderingContext2D} ctx Paper or canvas context
	 * @param {Array} curPos Positions
	 */
	_drawAnchor(ctx, curPos) {
		for (const p of curPos) {
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
			ctx.save();
			ctx.translate(x, y);
			if (r !== null) ctx.rotate(r);
			ctx.strokeStyle = outer;
			ctx.lineWidth = 4;
			Turtle._setShadow(ctx, 4, 2);
			fn(...args);

			ctx.strokeStyle = inner;
			ctx.lineWidth = 2;
			Turtle._setShadow(ctx, 0, 0);
			fn(...args);
			ctx.restore();
		}
		function drawCheck() {
			ctx.beginPath();
			ctx.moveTo(-8, -8);
			ctx.lineTo(8, 8);
			ctx.moveTo(8, -8);
			ctx.lineTo(-8, 8);
			ctx.stroke();
		}
		function drawRect(hw, hh) {
			ctx.setLineDash([6, 4]);
			ctx.beginPath();
			ctx.rect(-hw, -hh, hw * 2, hh * 2);
			ctx.stroke();
		}
		function drawLine() {
			ctx.setLineDash([6, 4]);
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(128, 0);
			ctx.stroke();
		}
	}

	/**~ja
	 * 影をセットする（ライブラリ内だけで使用）
	 * @private
	 * @param {Paper|CanvasRenderingContext2D} ctx 紙／キャンバス・コンテキスト
	 * @param {number} blur ぼかし量
	 * @param {number} off 影のずれ
	 * @param {string} [color='rgba(0,0,0,0.5)'] 色
	 */
	/**~en
	 * Set shadow (used only in the library)
	 * @private
	 * @param {Paper|CanvasRenderingContext2D} ctx Paper or canvas context
	 * @param {number} blur Blur amount
	 * @param {number} off Shadow offset
	 * @param {string} [color='rgba(0,0,0,0.5)'] Color
	 */
	static _setShadow(ctx, blur, off, color = 'rgba(0,0,0,0.5)') {
		ctx.shadowBlur = blur;
		ctx.shadowOffsetX = ctx.shadowOffsetY = off;
		ctx.shadowColor = color;
	}

}