/**~ja
 * トレーサー
 * @version 2020-05-05
 */
/**~en
 * Tracer
 * @version 2020-05-05
 */
class Tracer {

	/**~ja
	 * トレーサーを作る
	 * @constructor
	 */
	/**~en
	 * Make a tracer
	 * @constructor
	 */
	constructor() {
		//@ifdef ja
		if (typeof PATH === 'undefined') throw new Error('Pathライブラリが必要です。');
		//@endif
		//@ifdef en
		if (typeof PATH === 'undefined') throw new Error('Path library is needed.');
		//@endif

		this._cmdQueue = [];
		this._remainTime = 0;

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
			lineOrMoveTo : (x, y, dir) => {
				this._changePos(x, y, dir + 90);
			},
			quadCurveOrMoveTo: (x1, y1, x2, y2, dir) => {
				this._changePos(x2, y2, dir + 90);
			},
			bezierCurveOrMoveTo: (x1, y1, x2, y2, x3, y3, dir) => {
				this._changePos(x3, y3, dir + 90);
			},
			arcOrMoveTo: (cx, cy, dr, w, h, r0, r1, ac, dir, xx, yy) => {
				this._changePos(xx, yy, dir + 90);
			}
		});
	}

	/**~ja
	 * 今の状態を保存する
	 * @return {Tracer} このトレーサー
	 */
	/**~en
	 * Save the current state
	 * @return {Tracer} This tracer
	 */
	save() {
		const t = this._getState();
		this._stack.push(t);
		return this;
	}

	/**~ja
	 * 前の状態を復元する
	 * @return {Tracer} このトレーサー
	 */
	/**~en
	 * Restore previous state
	 * @return {Tracer} This tracer
	 */
	restore() {
		const t = this._stack.pop();
		this._setState(t);
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
			this._x, this._y, this._dir,  // 以下、順番に依存関係あり
			this._step,
			this._liner.edge(),
			this._homeX, this._homeY, this._homeDir,
		];
	}

	/**~ja
	 * 状態を設定する（ライブラリ内だけで使用）
	 * @private
	 * @param {Array} t 状態
	 */
	/**~en
	 * Set state (used only in the library)
	 * @private
	 * @param {Array} t State
	 */
	_setState(t) {
		this._changePos(t[0], t[1], t[2]);  // 以下、順番に依存関係あり
		this.step(t[3]);
		this._liner.edge(t[4]);
		this._homeX = t[5]; this._homeY = t[6]; this._homeDir = t[7];
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


	//~ja 場所か方向の変化 --------------------------------------------------------
	//~en Change of place or direction --------------------------------------------


	/**~ja
	 * 前に進む
	 * @param {number} step 歩数
	 * @return {Tracer} このトレーサー
	 */
	/**~en
	 * Go forward
	 * @param {number} step Number of steps
	 * @return {Tracer} This tracer
	 */
	go(step) {
		this._addCommand((limit) => {
			return this._liner.line(this._x, this._y, this._dir - 90, step * this._step, limit);
		});
		return this;
	}

	/**~ja
	 * 後ろに戻る
	 * @param {number} step 歩数
	 * @return {Tracer} このトレーサー
	 */
	/**~en
	 * Go back
	 * @param {number} step Number of steps
	 * @return {Tracer} This tracer
	 */
	back(step) {
		return this.go(-step);  // 前に進むことの逆
	}

	/**~ja
	 * 右に回る
	 * @param {number} deg 角度
	 * @return {Tracer} このトレーサー
	 */
	/**~en
	 * Turn right
	 * @param {number} deg Degree
	 * @return {Tracer} This tracer
	 */
	turnRight(deg) {
		this._addCommand((limit) => {
			return this._doTurn(deg, limit);
		});
		return this;
	}

	/**~ja
	 * 左に回る
	 * @param {number} deg 角度
	 * @return {Tracer} このトレーサー
	 */
	/**~em
	 * Turn left
	 * @param {number} deg Degree
	 * @return {Tracer} This tracer
	 */
	turnLeft(deg) {
		return this.turnRight(-deg);  // 右に回ることの逆
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
		const sign = deg < 0 ? -1 : 1;
		let limDeg;
		if (limit !== undefined) {
			limDeg = (limit < sign * deg) ? (sign * limit) : deg;
		} else {
			limDeg = deg;
		}
		this._changePos(this._x, this._y, this._dir + limDeg);
		return sign * limDeg;
	}

	/**~ja
	 * x座標（横の場所）
	 * @param {number=} val 値
	 * @return x座標／このトレーサー
	 */
	/**~en
	 * X coordinate
	 * @param {number=} val Value
	 * @return X coordinate, or this tracer
	 */
	x(val) {
		if (val === undefined) return this._x;
		this._addCommand((limit) => { this._changePos(val, this._y); });
		return this;
	}

	/**~ja
	 * y座標（たての場所）
	 * @param {number=} val 値
	 * @return y座標／このトレーサー
	 */
	/**~en
	 * Y coordinate
	 * @param {number=} val Value
	 * @return Y coordinate, or this tracer
	 */
	y(val) {
		if (val === undefined) return this._y;
		this._addCommand((limit) => { this._changePos(this._x, val); });
		return this;
	}

	/**~ja
	 * 方向
	 * @param {number=} deg 角度
	 * @return 角度／このトレーサー
	 */
	/**~en
	 * Direction
	 * @param {number=} deg Degree
	 * @return Degree, or this tracer
	 */
	direction(deg) {
		if (deg === undefined) return this._dir;
		this._addCommand((limit) => { this._changePos(this._x, this._y, deg); });
		return this;
	}

	/**~ja
	 * 移動する
	 * @param {number} x x座標（横の場所）
	 * @param {number} y y座標（たての場所）
	 * @param {number=} opt_dir 方向（オプション）
	 * @return {Tracer} このトレーサー
	 */
	/**~en
	 * Move to
	 * @param {number} x X coordinate
	 * @param {number} y Y coordinate
	 * @param {number=} opt_dir Direction (optional)
	 * @return {Tracer} This tracer
	 */
	moveTo(x, y, opt_dir) {
		this._addCommand((limit) => {
			this._changePos(x, y);
			if (opt_dir !== undefined) this._changePos(this._x, this._y, opt_dir);  // 値のチェックが必要なので関数呼び出し
		});
		return this;
	}

	/**~ja
	 * ホームに帰る（最初の場所と方向に戻る）
	 * @return {Tracer} このトレーサー
	 */
	/**~en
	 * Go back to home (Return to the first place and direction)
	 * @return {Tracer} This tracer
	 */
	home() {
		return this.moveTo(this._homeX, this._homeY, this._homeDir);
	}

	/**~ja
	 * 今の場所をホームに
	 * @return {Tracer} このトレーサー
	 */
	/**~en
	 * Set your current location to 'home'
	 * @return {Tracer} This tracer
	 */
	setHome() {
		this._addCommand(() => {
			this._homeX   = this._x;
			this._homeY   = this._y;
			this._homeDir = this._dir;
		});
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
	 * @return {Tracer} このトレーサー
	 */
	/**~en
	 * Curve to the right
	 * @param {number} step0 Number of steps 1
	 * @param {number} deg Degree 1
	 * @param {number} step1 Number of steps 2
	 * @param {number=} opt_deg Degree 2 (optional)
	 * @param {number=} opt_step Number of steps 3 (optional)
	 * @return {Tracer} This tracer
	 */
	curveRight(step0, deg, step1, opt_deg, opt_step) {
		this._addCommand((limit) => {
			return this._doCurve(step0, deg, step1, opt_deg, opt_step, limit);
		});
		return this;
	}

	/**~ja
	 * 左にカーブする
	 * @param {number} step0 歩数1
	 * @param {number} deg 角度1
	 * @param {number} step1 歩数2
	 * @param {number=} opt_deg 角度2（オプション）
	 * @param {number=} opt_step 歩数3（オプション）
	 * @return {Tracer} このトレーサー
	 */
	/**~en
	 * Curve to the left
	 * @param {number} step0 Number of steps 1
	 * @param {number} deg Degree 1
	 * @param {number} step1 Number of steps 2
	 * @param {number=} opt_deg Degree 2 (optional)
	 * @param {number=} opt_step Number of steps 3 (optional)
	 * @return {Tracer} This tracer
	 */
	curveLeft(step0, deg, step1, opt_deg, opt_step) {
		if (opt_deg === undefined) {
			return this.curveRight(step0, -deg, step1);
		} else {
			return this.curveRight(step0, -deg, step1, -opt_deg, opt_step);
		}
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
	 * @return {number} Amount actually moved
	 */
	_doCurve(step0, deg, step1, opt_deg, opt_step, limit) {
		const s = this._step;
		if (opt_deg === undefined) {
			return this._liner.quadCurve(this._x, this._y, this._dir - 90, step0 * s, deg, step1 * s, limit);
		} else {
			return this._liner.bezierCurve(this._x, this._y, this._dir - 90, step0 * s, deg, step1 * s, opt_deg, opt_step * s, limit);
		}
	}

	/**~ja
	 * 右に曲がる弧をかく
	 * @param {number|Array<number>} r 半径（配列なら横半径とたて半径）
	 * @param {number|Array<number>} deg 角度（配列なら開始角度と終了角度）
	 * @return {Tracer} このトレーサー
	 */
	/**~en
	 * Draw an arc that turns to the right
	 * @param {number|Array<number>} r Radius (horizontal radius and vertical radius if an array given)
	 * @param {number|Array<number>} deg Degree (start and end angles if an array given)
	 * @return {Tracer} This tracer
	 */
	arcRight(r, deg) {
		this._arcPrep(r, deg, false);
		return this;
	}

	/**~ja
	 * 左に曲がる弧をかく
	 * @param {number|Array<number>} r 半径（配列なら横半径とたて半径）
	 * @param {number|Array<number>} deg 角度（配列なら開始角度と終了角度）
	 * @return {Tracer} このトレーサー
	 */
	/**~en
	 * Draw an arc that turns to the left
	 * @param {number|Array<number>} r Radius (horizontal radius and vertical radius if an array given)
	 * @param {number|Array<number>} deg Degree (start and end angles if an array given)
	 * @return {Tracer} This tracer
	 */
	arcLeft(r, deg) {
		this._arcPrep(r, deg, true);
		return this;
	}

	/**~ja
	 * 弧をかく（ライブラリ内だけで使用）
	 * @private
	 * @param {number|Array<number>} r 半径（配列なら横半径とたて半径）
	 * @param {number|Array<number>} deg 角度（配列なら開始角度と終了角度）
	 * @param {boolean} isLeft 左かどうか
	 * @return {Tracer} このトレーサー
	 */
	/**~en
	 * Draw an arc (used only in the library)
	 * @private
	 * @param {number|Array<number>} r Radius (horizontal radius and vertical radius if an array given)
	 * @param {number|Array<number>} deg Degree (start and end angles if an array given)
	 * @param {boolean} isLeft Whether it is left
	 * @return {Tracer} This tracer
	 */
	_arcPrep(r, deg, isLeft) {
		this._addCommand((limit) => {
			return this._doArc(r, deg, isLeft, limit);
		});
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
		const p = PATH.arrangeArcParams(r, deg, this._step);
		let rev = 0;

		if (isLeft) {
			p.deg0 = -p.deg0;
			p.deg1 = -p.deg1;
		} else {
			p.deg0 = p.deg0 + 180;
			p.deg1 = p.deg1 + 180;
			//~ja 時計回りの接線の傾きなのでPIを足す（逆向きにする）
			//~en Since it is the inclination of the tangent in the clockwise direction, add PI
			rev = Math.PI;
		}
		const r0 = rad(p.deg0);
		const s0 = p.w * Math.cos(r0), t0 = p.h * Math.sin(r0);
		const a0 = Math.atan2(-(p.h * p.h * s0), (p.w * p.w * t0)) + rev;

		const rot = rad(this._dir - 90) - a0;
		const lrsin = Math.sin(rot), lrcos = Math.cos(rot);
		const lsp = this._x + -s0 * lrcos - -t0 * lrsin;
		const ltp = this._y + -s0 * lrsin + -t0 * lrcos;

		return this._liner.arc(lsp, ltp, rot * 180.0 / Math.PI, p.w, p.h, p.deg0, p.deg1, isLeft, limit);
	}


	//~ja その他 ------------------------------------------------------------------
	//~en Others ------------------------------------------------------------------


	/**~ja
	 * 1歩の長さ
	 * @param {number=} val 値
	 * @return {number|Tracer} 1歩の長さ／このトレーサー
	 */
	/**~en
	 * Length per step
	 * @param {number=} val Value
	 * @return {number|Tracer} Length per step, or this tracer
	 */
	step(val) {
		if (val === undefined) return this._step;
		this._addCommand(() => { this._step = val; });
		return this;
	}

	/**~ja
	 * エッジ
	 * @param {function=} func エッジを決める関数
	 * @return {function|Tracer} エッジ／このトレーサー
	 */
	/**~en
	 * Edge
	 * @param {function=} func Function to determine the edge
	 * @return {function|Tracer} Edge, or this tracer
	 */
	edge(func, ...fs) {
		if (func === undefined) return this._liner.edge();
		this._addCommand(() => { this._liner.edge(func, ...fs); });
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
		return (Math.atan2(y - this._y, x - this._x) * 180.0 / Math.PI - this._dir - 90);
	}


	//~ja アニメーション ----------------------------------------------------------
	//~en Animation ---------------------------------------------------------------


	/**~ja
	 * 後で実行する
	 * @param {function} func 関数
	 * @param {Array=} args_array 関数に渡す引数
	 * @return {Tracer} このトレーサー
	 */
	/**~en
	 * Run later
	 * @param {function} func Function
	 * @param {Array=} args_array Arguments to pass to the function
	 * @return {Tracer} This tracer
	 */
	doLater(func, args_array) {
		const fn = function () { func.apply(this, args_array); };
		this._addCommand(fn);
		return this;
	}

	/**~ja
	 * 直ぐに実行する
	 * @param {function} func 関数
	 * @param {Array=} args_array 関数に渡す引数
	 * @return {Tracer} このトレーサー
	 */
	/**~en
	 * Run immediately
	 * @param {function} func Function
	 * @param {Array=} args_array Arguments to pass to the function
	 * @return {Tracer} This tracer
	 */
	doNow(func, args_array) {
		const fn = function () { func.apply(this, args_array); };

		if (this._cmdQueue.length > 0) {
			const c = this._cmdQueue[0];
			const cmd = new Command(fn);
			if (c._isFirstTime) {
				this._cmdQueue.unshift(cmd);
			} else {
				this._cmdQueue.splice(1, 0, cmd);
			}
		} else {
			this._addCommand(fn);
		}
		return this;
	}

	/**~ja
	 * コマンドを追加する（ライブラリ内だけで使用）
	 * @private
	 * @param {function} func 関数
	 */
	/**~en
	 * Add command (used only in the library)
	 * @private
	 * @param {function} func Function
	 */
	_addCommand(func) {
		this._cmdQueue.push(new Command(func));
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
		this.update(this._x, this._y, this._dir, num);
	}

	/**~ja
	 * スピードに合わせて座標を更新する
	 * @param {number} x x座標（横の場所）
	 * @param {number} y y座標（たての場所）
	 * @param {number} dir 方向
	 * @param {number} unitTime 単位時間
	 * @return {Array<number>} 座標
	 */
	/**~en
	 * Update coordinates according to the speed
	 * @param {number} x X coordinate
	 * @param {number} y Y coordinate
	 * @param {number} dir Direction
	 * @param {number} unitTime Unit time
	 * @return {Array<number>} Coordinate
	 */
	update(x, y, dir, unitTime) {
		if (this._x !== x || this._y !== y || this._dir !== dir) {
			this.cancel();
			this._changePos(x, y, dir);
		}
		if (0 < this._cmdQueue.length) this._remainTime += unitTime;
		while (0 < this._cmdQueue.length) {
			const c = this._cmdQueue[0];
			if (c._initState === null) {
				c._initState = this._getState();
			} else {
				this._setState(c._initState);
			}
			const remain = this._remainTime - c.run(this._remainTime);
			if (0 < remain) {
				this._cmdQueue.shift();
				this._remainTime = remain;
			} else {
				break;
			}
		}
		if (0 === this._cmdQueue.length) this._remainTime = 0;
		return [this._x, this._y, this._dir];
	}

	/**~ja
	 * 現在の動きをキャンセルする
	 * @return {Tracer} このトレーサー
	 */
	/**~en
	 * Cancel the current motion
	 * @return {Tracer} This tracer
	 */
	cancel() {
		if (0 < this._cmdQueue.length) {
			const c = this._cmdQueue[0];
			if (c._initState !== null) {
				this._setState(c._initState);
				this._cmdQueue.shift();
				this._remainTime = 0;
			}
		}
		return this;
	}

	/**~ja
	 * すべての動きを止める
	 * @return {Tracer} このトレーサー
	 */
	/**~en
	 * Stop all motion
	 * @return {Tracer} This tracer
	 */
	stop() {
		this._cmdQueue.length = 0;
		this._remainTime = 0;
		return this;
	}

}