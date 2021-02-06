/**~ja
 * タートル・ベース
 * @version 2021-02-06
 */
/**~en
 * Turtle base
 * @version 2021-02-06
 */
class TurtleBase {

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
		//@ifdef ja
		if (typeof STYLE === 'undefined') throw new Error('Styleライブラリが必要です。');
		if (typeof PATH === 'undefined') throw new Error('Pathライブラリが必要です。');
		//@endif
		//@ifdef en
		if (typeof STYLE === 'undefined') throw new Error('Style library is needed.');
		if (typeof PATH === 'undefined') throw new Error('Path library is needed.');
		//@endif

		this._ctx = ctx;
		this._stack = [];

		//~ja 以下の変数は値を直接変えないこと
		//~en Do not change the following variables directly
		this._x       = 0;
		this._y       = 0;
		this._dir     = 0;
		this._step    = 1;
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

		this._area = { fromX: 0, toX: 0, left: 0, right: 0, fromY: 0, toY: 0, top: 0, bottom: 0, sqLen: 0 };
		this._mode = 'stroke';
		this._stroke = new STYLE.Stroke();
		this._fill = new STYLE.Fill();
		this._curMode = this._mode;
		this._pen = false;

		this._isClippable = true;
	}

	/**~ja
	 * 子カメを作る
	 * @return {*} 子カメ
	 */
	/**~en
	 * Make a child turtle
	 * @return {*} Child turtle
	 */
	makeChild() {
		const child = new this.constructor(this._ctx);
		child._setState(this._getState(), false);
		//~ja ペンの上げ下げをできなくする
		//~en Make it impossible to make up and down the pen
		child.pen = () => { return this; };
		return child;
	}

	/**~ja
	 * 今の状態を保存する
	 * @param {boolean=} [opt_savePaper=false] 紙の状態も保存するか？
	 * @return {TurtleBase} このタートル・ベース
	 */
	/**~en
	 * Save the current state
	 * @param {boolean=} [opt_savePaper=false] Whether to save the paper state too
	 * @return {TurtleBase} This turtle base
	 */
	save(opt_savePaper = false) {
		if (opt_savePaper === true) this._ctx.save();
		this._stack.push(this._getState());
		return this;
	}

	/**~ja
	 * 前の状態を復元する
	 * @param {boolean=} [opt_restorePaper=false] 紙の状態も復元するか？
	 * @return {TurtleBase} このタートル・ベース
	 */
	/**~en
	 * Restore previous state
	 * @param {boolean=} [opt_restorePaper=false] Whether to restore the paper state too
	 * @return {TurtleBase} This turtle base
	 */
	restore(opt_restorePaper = false) {
		this._setState(this._stack.pop());
		if (opt_restorePaper === true) this._ctx.restore();
		return this;
	}

	/**~ja
	 * 状態を取得する（ライブラリ内だけで使用）
	 * @private
	 * @return {Array} 状態
	 */
	/**~en
	 * Get state (used only in the library)
	 * @private
	 * @return {Array} State
	 */
	_getState() {
		return [
			//~ja 以下、順番に依存関係あり
			//~en Below, there is a dependency in order
			this._x, this._y, this._dir,
			this._step,
			this._liner.edge(),
			this._homeX, this._homeY, this._homeDir,
			Object.assign({}, this._area),
			this._mode,
			new STYLE.Stroke(this._stroke),
			new STYLE.Fill(this._fill),
			this._curMode,
			//~ja ペンの状態は最後
			//~en The state of the pen is last
			this._pen,
		];
	}

	/**~ja
	 * 状態を設定する（ライブラリ内だけで使用）
	 * @private
	 * @param {Array} t 状態
	 * @param {boolean=} [applyPenState=true] ペンの状態を設定するか？
	 */
	/**~en
	 * Set state (used only in the library)
	 * @private
	 * @param {Array} t State
	 * @param {boolean=} [applyPenState=true] Whether to set the state of the pen
	 */
	_setState(t, applyPenState = true) {
		//~ja 以下、順番に依存関係あり
		//~en Below, there is a dependency in order
		this._changePos(t[0], t[1], t[2]);
		this.step(t[3]);
		this._liner.edge(t[4]);
		this._homeX = t[5]; this._homeY = t[6]; this._homeDir = t[7];
		this._area = t[8];
		this.mode(t[9]);
		this._stroke = t[10];
		this._fill = t[11];
		this._curMode = t[12];
		//~ja ペンの状態は最後に設定すること（area等を参照しているため）
		//~en The state of the pen should be set at the end (because the area etc. are referred)
		if (applyPenState === true) this.pen(t[13]);
	}

	/**~ja
	 * 場所や方向を変える時に呼ばれる（ライブラリ内だけで使用）
	 * @private
	 * @param {number} x x座標
	 * @param {number} y y座標
	 * @param {number=} opt_deg 方向（オプション）
	 */
	/**~en
	 * Called when changing places and directions (used only in the library)
	 * @private
	 * @param {number} x x coordinate
	 * @param {number} y y coordinate
	 * @param {number=} opt_deg Degree (optional)
	 */
	_changePos(x, y, opt_deg) {
		this._x = x;
		this._y = y;
		if (opt_deg !== undefined) this._dir = checkDegRange(opt_deg);
	}

	/**~ja
	 * アニメーション用プレースホルダ（アニメーションのスキップをチェックする）（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Placeholder for animation (check skip animation) (used only in the library)
	 * @private
	 */
	_getPower() {
		return null;
	}

	/**~ja
	 * アニメーション用プレースホルダ（アニメーションの終わりをチェックする）（ライブラリ内だけで使用）
	 * @private
	 * @param {number} consumption
	 */
	/**~en
	 * Placeholder for animation (check the end of animation) (used only in the library)
	 * @private
	 * @param {number} consumption
	 */
	_usePower(consumption) {
	}


	//~ja 場所か方向の変化 --------------------------------------------------------
	//~en Change of place or direction --------------------------------------------


	/**~ja
	 * 前に進む
	 * @param {number} step 歩数
	 * @return {TurtleBase} このタートル・ベース
	 */
	/**~en
	 * Go forward
	 * @param {number} step Number of steps
	 * @return {TurtleBase} This turtle base
	 */
	go(step) {
		return this._goPrep(step);
	}

	/**~ja
	 * 後ろに戻る
	 * @param {number} step 歩数
	 * @return {TurtleBase} このタートル・ベース
	 */
	/**~en
	 * Go back
	 * @param {number} step Number of steps
	 * @return {TurtleBase} This turtle base
	 */
	back(step) {
		//~ja 前に進むことの逆
		//~en The reverse of going forward
		return this._goPrep(-step);
	}

	/**~ja
	 * 進む（ライブラリ内だけで使用）
	 * @private
	 * @param {number} step 歩数
	 * @return {TurtleBase} このタートル・ベース
	 */
	/**~en
	 * Go (used only in the library)
	 * @private
	 * @param {number} step Number of steps
	 * @return {TurtleBase} This turtle base
	 */
	_goPrep(step) {
		const limit = this._getPower();
		if (limit === 0) return this;
		this._usePower(this._doGo(step, limit));
		return this;
	}

	/**~ja
	 * 実際に進む（ライブラリ内だけで使用）
	 * @private
	 * @param {number} step 歩数
	 * @param {number} limit 制限
	 * @param {function=} [before=null] 実際に動く前に呼ばれる関数
	 * @return {number} 実際に動いた量
	 */
	/**~en
	 * Actually go (used only in the library)
	 * @private
	 * @param {number} step Number of steps
	 * @param {number} limit Limitation
	 * @param {function=} [before=null] Function to be called before it actually moves
	 * @return {number} Amount actually moved
	 */
	_doGo(step, limit, before = null) {
		const x = this._x, y = this._y, dir_ = this._dir - 90, d = step * this._step;
		if (before) before(x, y, dir_, d);
		return this._liner.line(x, y, dir_, d, limit, this._area);
	}

	/**~ja
	 * 右に回る
	 * @param {number} deg 角度
	 * @return {TurtleBase} このタートル・ベース
	 */
	/**~en
	 * Turn right
	 * @param {number} deg Degree
	 * @return {TurtleBase} This turtle base
	 */
	turnRight(deg) {
		return this._turnPrep(deg);
	}

	/**~ja
	 * 左に回る
	 * @param {number} deg 角度
	 * @return {TurtleBase} このタートル・ベース
	 */
	/**~en
	 * Turn left
	 * @param {number} deg Degree
	 * @return {TurtleBase} This turtle base
	 */
	turnLeft(deg) {
		//~ja 右に回ることの逆
		//~en The reverse of turning to the right
		return this._turnPrep(-deg);
	}

	/**~ja
	 * 回る（ライブラリ内だけで使用）
	 * @private
	 * @param {number} deg 角度
	 * @return {TurtleBase} このタートル・ベース
	 */
	/**~en
	 * Turn (used only in the library)
	 * @private
	 * @param {number} deg Degree
	 * @return {TurtleBase} This turtle base
	 */
	_turnPrep(deg) {
		const limit = this._getPower();
		if (limit === 0) return this;
		this._usePower(this._doTurn(deg, limit));
		return this;
	}

	/**~ja
	 * 実際に方向を変える（ライブラリ内だけで使用）
	 * @private
	 * @param {number} deg 角度
	 * @param {number} limit 制限
	 * @param {function=} [before=null] 実際に動く前に呼ばれる関数
	 * @return {number} 実際に動いた量
	 */
	/**~en
	 * Actually change direction (used only in the library)
	 * @private
	 * @param {number} deg Degree
	 * @param {number} limit Limitation
	 * @param {function=} [before=null] Function to be called before it actually moves
	 * @return {number} Amount actually moved
	 */
	_doTurn(deg, limit, before = null) {
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

	/**~ja
	 * x座標（横の場所）
	 * @param {number=} val 値
	 * @return x座標／このタートル・ベース
	 */
	/**~en
	 * X coordinate
	 * @param {number=} val Value
	 * @return X coordinate, or this turtle base
	 */
	x(val) {
		if (val === undefined) return this._x;
		return this.moveTo(val, this._y);
	}

	/**~ja
	 * y座標（たての場所）
	 * @param {number=} val 値
	 * @return y座標／このタートル・ベース
	 */
	/**~en
	 * Y coordinate
	 * @param {number=} val Value
	 * @return Y coordinate, or this turtle base
	 */
	y(val) {
		if (val === undefined) return this._y;
		return this.moveTo(this._x, val);
	}

	/**~ja
	 * 方向
	 * @param {number=} deg 角度
	 * @return 角度／このタートル・ベース
	 */
	/**~en
	 * Direction
	 * @param {number=} deg Degree
	 * @return Degree, or this turtle base
	 */
	direction(deg) {
		if (deg === undefined) return this._dir;
		if (this._getPower() === 0) return this;
		this._changePos(this._x, this._y, deg);
		return this;
	}

	/**~ja
	 * 移動する
	 * @param {number} x x座標
	 * @param {number} y y座標
	 * @param {number=} opt_dir 方向（オプション）
	 * @return {TurtleBase} このタートル・ベース
	 */
	/**~en
	 * Move to
	 * @param {number} x X coordinate
	 * @param {number} y Y coordinate
	 * @param {number=} opt_dir Direction (optional)
	 * @return {TurtleBase} This turtle base
	 */
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

	/**~ja
	 * 集まる
	 * @param {TurtleBase} turtle 別のカメ
	 * @return {TurtleBase} このタートル・ベース
	 */
	/**~en
	 * Gather to
	 * @param {TurtleBase} turtle Another turtle
	 * @return {TurtleBase} This turtle base
	 */
	gatherTo(turtle) {
		return this.moveTo(turtle._x, turtle._y, turtle._dir);
	}

	/**~ja
	 * ホームに帰る（最初の場所と方向に戻る）
	 * @return {TurtleBase} このタートル・ベース
	 */
	/**~en
	 * Go back to home (Return to the first place and direction)
	 * @return {TurtleBase} This turtle base
	 */
	home() {
		return this.moveTo(this._homeX, this._homeY, this._homeDir);
	}

	/**~ja
	 * 今の場所をホームに
	 * @return {TurtleBase} このタートル・ベース
	 */
	/**~en
	 * Set your current location to 'home'
	 * @return {TurtleBase} This turtle base
	 */
	setHome() {
		if (this._getPower() === 0) return this;
		this._homeX = this._x;
		this._homeY = this._y;
		this._homeDir = this._dir;
		return this;
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
	 * @return {TurtleBase} このタートル・ベース
	 */
	/**~en
	 * Curve to the right
	 * @param {number} step0 Number of steps 1
	 * @param {number} deg Degree 1
	 * @param {number} step1 Number of steps 2
	 * @param {number=} opt_deg Degree 2 (optional)
	 * @param {number=} opt_step Number of steps 3 (optional)
	 * @return {TurtleBase} This turtle base
	 */
	curveRight(step0, deg, step1, opt_deg, opt_step) {
		return this._curvePrep(step0, deg, step1, opt_deg, opt_step);
	}

	/**~ja
	 * 左にカーブする
	 * @param {number} step0 歩数1
	 * @param {number} deg 角度1
	 * @param {number} step1 歩数2
	 * @param {number=} opt_deg 角度2（オプション）
	 * @param {number=} opt_step 歩数3（オプション）
	 * @return {TurtleBase} このタートル・ベース
	 */
	/**~en
	 * Curve to the left
	 * @param {number} step0 Number of steps 1
	 * @param {number} deg Degree 1
	 * @param {number} step1 Number of steps 2
	 * @param {number=} opt_deg Degree 2 (optional)
	 * @param {number=} opt_step Number of steps 3 (optional)
	 * @return {TurtleBase} This turtle base
	 */
	curveLeft(step0, deg, step1, opt_deg, opt_step) {
		if (opt_deg === undefined) return this._curvePrep(step0, -deg, step1);
		return this._curvePrep(step0, -deg, step1, -opt_deg, opt_step);
	}

	/**~ja
	 * カーブする（ライブラリ内だけで使用）
	 * @private
	 * @param {number} step0 歩数1
	 * @param {number} deg 角度1
	 * @param {number} step1 歩数2
	 * @param {number=} opt_deg 角度2（オプション）
	 * @param {number=} opt_step 歩数3（オプション）
	 * @return {TurtleBase} このタートル・ベース
	 */
	/**~en
	 * Curve (used only in the library)
	 * @private
	 * @param {number} step0 Number of steps 1
	 * @param {number} deg Degree 1
	 * @param {number} step1 Number of steps 2
	 * @param {number=} opt_deg Degree 2 (optional)
	 * @param {number=} opt_step Number of steps 3 (optional)
	 * @return {TurtleBase} This turtle base
	 */
	_curvePrep(step0, deg, step1, opt_deg, opt_step) {
		const limit = this._getPower();
		if (limit === 0) return this;
		this._usePower(this._doCurve(step0, deg, step1, opt_deg, opt_step, limit));
		return this;
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
	_doCurve(step0, deg, step1, opt_deg, opt_step, limit, before = null) {
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

	/**~ja
	 * 右に曲がる弧をかく
	 * @param {number|Array<number>} r 半径（配列なら横半径とたて半径）
	 * @param {number|Array<number>} deg 角度（配列なら開始角度と終了角度）
	 * @return {TurtleBase} このタートル・ベース
	 */
	/**~en
	 * Draw an arc that turns to the right
	 * @param {number|Array<number>} r Radius (horizontal radius and vertical radius if an array given)
	 * @param {number|Array<number>} deg Degree (start and end angles if an array given)
	 * @return {TurtleBase} This turtle base
	 */
	arcRight(r, deg) {
		return this._arcPrep(r, deg, false);
	}

	/**~ja
	 * 左に曲がる弧をかく
	 * @param {number|Array<number>} r 半径（配列なら横半径とたて半径）
	 * @param {number|Array<number>} deg 角度（配列なら開始角度と終了角度）
	 * @return {TurtleBase} このタートル・ベース
	 */
	/**~en
	 * Draw an arc that turns to the left
	 * @param {number|Array<number>} r Radius (horizontal radius and vertical radius if an array given)
	 * @param {number|Array<number>} deg Degree (start and end angles if an array given)
	 * @return {TurtleBase} This turtle base
	 */
	arcLeft(r, deg) {
		return this._arcPrep(r, deg, true);
	}

	/**~ja
	 * 弧をかく（ライブラリ内だけで使用）
	 * @private
	 * @param {number|Array<number>} r 半径（配列なら横半径とたて半径）
	 * @param {number|Array<number>} deg 角度（配列なら開始角度と終了角度）
	 * @param {boolean} isLeft 左かどうか
	 * @return {TurtleBase} このタートル・ベース
	 */
	/**~en
	 * Draw an arc (used only in the library)
	 * @private
	 * @param {number|Array<number>} r Radius (horizontal radius and vertical radius if an array given)
	 * @param {number|Array<number>} deg Degree (start and end angles if an array given)
	 * @param {boolean} isLeft Whether it is left
	 * @return {TurtleBase} This turtle base
	 */
	_arcPrep(r, deg, isLeft) {
		const limit = this._getPower();
		if (limit === 0) return this;
		this._usePower(this._doArc(r, deg, isLeft, limit));
		return this;
	}

	/**~ja
	 * 実際に弧をかく（ライブラリ内だけで使用）
	 * @private
	 * @param {number|Array<number>} r 半径（配列なら横半径とたて半径）
	 * @param {number|Array<number>} deg 角度（配列なら開始角度と終了角度）
	 * @param {boolean} isLeft 左かどうか
	 * @param {number} limit 制限
	 * @param {function=} [before=null] 実際に動く前に呼ばれる関数
	 * @return {number} 実際に動いた量
	 */
	/**~en
	 * Actually draw an arc (used only in the library)
	 * @private
	 * @param {number|Array<number>} r Radius (horizontal radius and vertical radius if an array given)
	 * @param {number|Array<number>} deg Degree (start and end angles if an array given)
	 * @param {boolean} isLeft Whether it is left
	 * @param {number} limit Limitation
	 * @param {function=} [before=null] Function to be called before it actually moves
	 * @return {number} Amount actually moved
	 */
	_doArc(r, deg, isLeft, limit, before = null) {
		const p = PATH.arrangeArcParams(r, deg, this._step);
		//~ja 時計回りの接線の傾きなのでPIを足す（逆向きにする）
		//~en Since it is the inclination of the tangent in the clockwise direction, add PI
		const rev = isLeft ? 0 : Math.PI;

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


	//~ja その他 ------------------------------------------------------------------
	//~en Others ------------------------------------------------------------------


	/**~ja
	 * 1歩の長さ
	 * @param {number=} val 値
	 * @return {number|TurtleBase} 1歩の長さ／このタートル・ベース
	 */
	/**~en
	 * Length per step
	 * @param {number=} val Value
	 * @return {number|TurtleBase} Length per step, or this turtle base
	 */
	step(val) {
		if (val === undefined) return this._step;
		this._step = val;
		return this;
	}

	/**~ja
	 * 今の場所から見て、ある場所がどの角度かを返す
	 * @param {number} x ある場所のx座標（横の場所）
	 * @param {number} y ある場所のy座標（たての場所）
	 * @return {number} 角度
	 */
	/**~en
	 * Seeing from the current location, what direction is there
	 * @param {number} x X coordinate of a place
	 * @param {number} y Y coordinate of a place
	 * @return {number} Degree
	 */
	getDirectionOf(x, y) {
		let d = (Math.atan2(this._y - y, this._x - x) * 180.0 / Math.PI - this._dir - 90);
		while (d < 0) d += 360;
		while (360 <= d) d -= 360;
		return d;
	}

	/**~ja
	 * 今の場所から見て、ホームがどの角度かを返す
	 * @return {number} 角度
	 */
	/**~en
	 * Seeing from the current location, which direction is home
	 * @return {number} Degree
	 */
	getDirectionOfHome() {
		return this.getDirectionOf(this._homeX, this._homeY);
	}

	/**~ja
	 * 今の場所から、ある場所までの距離を返す
	 * @param {number} x ある場所のx座標
	 * @param {number} y ある場所のy座標
	 * @return {number} 距離
	 */
	/**~en
	 * Distance from current location to a certain location
	 * @param {number} x X coordinate of a place
	 * @param {number} y Y coordinate of a place
	 * @return {number} Distance
	 */
	getDistanceTo(x, y) {
		return Math.sqrt((x - this._x) * (x - this._x) + (y - this._y) * (y - this._y));
	}

	/**~ja
	 * 今の場所から、ホームまでの距離を返す
	 * @return {number} 距離
	 */
	/**~en
	 * Distance from current location to home
	 * @return {number} Distance
	 */
	getDistanceToHome() {
		return this.getDistanceTo(this._homeX, this._homeY);
	}


	//~ja 図形の描画 --------------------------------------------------------------
	//~en Draw a shape ------------------------------------------------------------


	/**~ja
	 * 点をかく
	 * @return {TurtleBase} このタートル・ベース
	 */
	/**~en
	 * Draw a point
	 * @return {TurtleBase} This turtle base
	 */
	dot() {
		this._drawShape((limit) => {
			let r = this._stroke._width / 2;
			if (limit) r = Math.min(r, limit);
			const dr0 = rad(this._dir - 90), offX = r * Math.cos(dr0), offY = r * Math.sin(dr0);

			this._area.fromX = this._x - offX, this._area.fromY = this._y - offY;
			this._area.toX = this._x + offX, this._area.toY = this._y + offY;
			this._area.left = this._x - r, this._area.top = this._y - r;
			this._area.right = this._x + r, this._area.bottom = this._y + r;

			if (this._pen) this._ctx.arc(this._x, this._y, r, 0, 2 * Math.PI, false);
			return r;
		});
		return this;
	}

	/**~ja
	 * 円をかく
	 * @param {number|Array<number>} r 半径（配列なら横半径とたて半径）
	 * @param {number|Array<number>=} [deg=360] 弧の角度（配列なら開始角度と終了角度）
	 * @param {boolean=} [anticlockwise=false] 反時計回り？
	 * @return {TurtleBase} このタートル・ベース
	 */
	/**~en
	 * Draw a circle
	 * @param {number|Array<number>} r Radius (horizontal radius and vertical radius if an array given)
	 * @param {number|Array<number>} deg Degree (start and end angles if an array given)
	 * @param {boolean=} [anticlockwise=false] Whether it is counterclockwise
	 * @return {TurtleBase} This turtle base
	 */
	circle(r, deg = 360, anticlockwise = false) {
		const p = PATH.arrangeArcParams(r, deg, this._step);
		const cx = this._x, cy = this._y;
		const dr0 = rad(p.deg0 - 90), s1 = p.w * Math.cos(dr0), t1 = p.h * Math.sin(dr0);
		const dr = rad(this._dir), rsin = Math.sin(dr), rcos = Math.cos(dr);
		const x0 = cx + s1 * rcos - t1 * rsin, y0 = cy + s1 * rsin + t1 * rcos;

		this._drawShape((limit) => { return this._doCircle(cx, cy, p, anticlockwise, limit, dr); }, x0, y0);
		return this;
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
	 * @param {function=} [before=null] 実際に動く前に呼ばれる関数
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
	 * @param {function=} [before=null] Function to be called before it actually moves
	 * @return {number} Amount actually moved
	 */
	_doCircle(cx, cy, p, anticlockwise, limit, dr, before = false) {
		if (before) before(cx, cy, p, dr);
		return this._liner.arc(cx, cy, this._dir, p.w, p.h, p.deg0 - 90, p.deg1 - 90, anticlockwise, limit, this._area);
	}

	/**~ja
	 * 実際に絵をかく（ライブラリ内だけで使用）
	 * @private
	 * @param {function} doFunc 関数
	 * @param {number=} [opt_x=null] 始点のx座標
	 * @param {number=} [opt_y=null] 始点のy座標
	 */
	/**~en
	 * Actually draw a shape (used only in the library)
	 * @private
	 * @param {function} doFunc Function
	 * @param {number=} [opt_x=null] Start point x coordinate
	 * @param {number=} [opt_y=null] Start point y coordinate
	 */
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

	/**~ja
	 * イメージをかく
	 * @param {Image|Paper|CanvasRenderingContext2D} image イメージ／紙／キャンバス・コンテキスト
	 * @param {number} cx 中心のx座標
	 * @param {number} cy 中心のy座標
	 * @param {number=} [scale=1] スケール
	 */
	/**~en
	 * Draw an image
	 * @param {Image|Paper|CanvasRenderingContext2D} image Image, paper, or canvas context
	 * @param {number} cx X coordinate of center
	 * @param {number} cy Y coordinate of center
	 * @param {number=} [scale=1] Scale
	 */
	image(image, cx, cy, scale = 1) {
		const img = (image instanceof CROQUJS.Paper || image instanceof CanvasRenderingContext2D) ? image.canvas : image;
		this._ctx.save();
		this.localize();
		this._ctx.drawImage(img, -cx * scale, -cy * scale, img.width * scale, img.height * scale);
		this._ctx.restore();
	}


	//~ja 描画状態の変化 ----------------------------------------------------------
	//~en Change of drawing state -------------------------------------------------


	/**~ja
	 * ペンを上げる
	 * @return {TurtleBase} このタートル・ベース
	 */
	/**~en
	 * Raise up the pen
	 * @return {TurtleBase} This turtle base
	 */
	penUp() {
		return this.pen(false);
	}

	/**~ja
	 * ペンを下ろす
	 * @return {TurtleBase} このタートル・ベース
	 */
	/**~en
	 * Put down the pen
	 * @return {TurtleBase} This turtle base
	 */
	penDown() {
		return this.pen(true);
	}

	/**~ja
	 * ペンの状態
	 * @param {boolean=} val 値（下がっているならtrue）
	 * @return {boolean|TurtleBase} ペンの状態／このタートル・ベース
	 */
	/**~en
	 * Pen state
	 * @param {boolean=} val Value (true if down)
	 * @return {boolean|TurtleBase} Pen state, or this turtle base
	 */
	pen(val) {
		if (val === undefined) return this._pen;
		if (this._pen === false && val === true) {
			this._ctx.beginPath();
			this._ctx.moveTo(this._x, this._y);
			//~ja ペンを下げた場所を保存しておく
			//~en Save the place where the pen put down
			this._area.fromX = this._area.left = this._area.right = this._x;
			this._area.fromY = this._area.top = this._area.bottom = this._y;
			this._area.sqLen = 0;
			this._curMode = this._mode.toLowerCase();
		}
		if (this._pen === true && val === false && !this._isNotDrawn()) {
			//~ja ペンを下げた場所と同じ場所でペンを上げたら、パスを閉じる（始点と終点をつなげる）
			//~en Close the path (connect the start and end points) by raising the pen at the same place where putting down the pen
			if (this._isInPenDownPoint()) this._ctx.closePath();
			this._drawActually();
		}
		this._pen = val;
		return this;
	}

	/**~ja
	 * ペンを下ろした場所にいる？（ライブラリ内だけで使用）
	 * @private
	 * @return {boolean} ペンを下ろした場所にいるかどうか
	 */
	/**~en
	 * Whether the current location is where putting down the pen (used only in the library)
	 * @private
	 * @return {boolean} Whether the current location is where putting down the pen
	 */
	_isInPenDownPoint() {
		const x = this._x, y = this._y;
		const pdX = this._area.fromX, pdY = this._area.fromY;
		const sqLen = (x - pdX) * (x - pdX) + (y - pdY) * (y - pdY);
		return (sqLen < 0.01);
	}

	/**~ja
	 * 実際に絵をかく（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Actually draw (used only in the library)
	 * @private
	 */
	_drawActually() {
		let ms = this._curMode;
		ms = ms.replace('fill', 'f');
		ms = ms.replace('stroke', 's');
		ms = ms.replace('clip', 'c');
		for (const m of ms) {
			switch (m) {
				case 'f':
					this._fill.draw(this._ctx, this._area);
					break;
				case 's':
					this._stroke.draw(this._ctx, this._area);
					break;
				case 'c':
					if (this._isClippable) this._ctx.clip();
					break;
			}
		}
	}

	/**~ja
	 * かくモード
	 * @param {string=} val 値
	 * @return {string|TurtleBase} かくモード／このタートル・ベース
	 */
	/**~en
	 * Drawing mode
	 * @param {string=} val Value
	 * @return {string|TurtleBase} Drawing mode, or this turtle base
	 */
	mode(val) {
		if (val === undefined) return this._mode;
		this._mode = val;

		//~ja ペンを下ろしていても、何も描いていないなら
		//~en Even if the pen is down, if nothing is drawn
		if (this._pen && this._isNotDrawn()) {
			this._curMode = this._mode.toLowerCase();
		}
		return this;
	}

	/**~ja
	 * 何もかいていない？（ライブラリ内だけで使用）
	 * @private
	 * @return {boolean} 何もかいていないかどうか
	 */
	/**~en
	 * Whether nothing is drawn (used only in the library)
	 * @private
	 * @return {boolean} Whether nothing is drawn
	 */
	_isNotDrawn() {
		const a = this._area, x = this._x, y = this._y;
		if (a.fromX === x && a.left === x && a.right === x && a.fromY === y && a.top === y && a.bottom === y) {
			return true;
		}
		return false;
	}

	/**~ja
	 * 線スタイル
	 * @param {Stroke=} opt_stroke 設定する線スタイル（オプション）
	 * @return {Stroke|TurtleBase} 線スタイル／このタートル・ベース
	 */
	/**~en
	 * Stroke style
	 * @param {Stroke=} opt_stroke Stroke style (optional)
	 * @return {Stroke|TurtleBase} Stroke style, or this turtle base
	 */
	stroke(opt_stroke) {
		if (opt_stroke === undefined) return this._stroke;
		this._stroke = new STYLE.Stroke(opt_stroke);
		return this;
	}

	/**~ja
	 * ぬりスタイル
	 * @param {Fill=} opt_fill 設定するぬりスタイル（オプション）
	 * @return {Fill|TurtleBase} ぬりスタイル／このタートル・ベース
	 */
	/**~en
	 * Filling style
	 * @param {Fill=} opt_fill Filling style (optional)
	 * @return {Fill|TurtleBase} Filling style, or this turtle base
	 */
	fill(opt_fill) {
		if (opt_fill === undefined) return this._fill;
		this._fill = new STYLE.Fill(opt_fill);
		return this;
	}

	/**~ja
	 * エッジ
	 * @param {function=} func エッジを決める関数
	 * @return {function|TurtleBase} エッジ／このタートル・ベース
	 */
	/**~en
	 * Edge
	 * @param {function=} func Function to determine the edge
	 * @return {function|TurtleBase} Edge, or this turtle base
	 */
	edge(func, ...fs) {
		if (func === undefined) return this._liner.edge();
		this._liner.edge(func, ...fs);
		return this;
	}


	//~ja 紙操作 ------------------------------------------------------------------
	//~en Paper operation ---------------------------------------------------------


	/**~ja
	 * 紙を返す
	 * @return {Paper|CanvasRenderingContext2D} 紙／キャンバス・コンテキスト
	 */
	/**~en
	 * Get the paper
	 * @return {Paper|CanvasRenderingContext2D} Paper or canvas context
	 */
	context() {
		return this._ctx;
	}

	/**~ja
	 * 紙をカメの場所と方向に合わせる
	 */
	/**~en
	 * Align the paper with turtle location and orientation
	 */
	localize() {
		this._ctx.translate(this._x, this._y);
		this._ctx.rotate(rad(this._dir));
	}

	/**~ja
	 * 紙をカメの場所に合わせて拡大縮小する
	 * @param {number} rate 拡大縮小率
	 * @param {number=} opt_rateY たての拡大縮小率（オプション）
	 */
	/**~en
	 * Scale the paper to the location of the turtle
	 * @param {number} rate Scaling rate
	 * @param {number=} opt_rateY Vertical scaling rate (optional)
	 */
	scale(rate, opt_rateY = null) {
		this._ctx.translate(this._x, this._y);
		if (opt_rateY === null) {
			this._ctx.scale(rate, rate);
		} else {
			this._ctx.scale(rate, opt_rateY);
		}
		this._ctx.translate(-this._x, -this._y);
	}

}