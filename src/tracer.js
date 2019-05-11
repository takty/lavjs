//
// トレーサー・ライブラリ（TRACER）
// 日付: 2019-04-22
// 作者: 柳田拓人（Space-Time Inc.）
//
// 座標を持ったオブジェクトを移動させるライブラリです。
//


// ライブラリ変数
const TRACER = (function () {

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




	// -------------------------------------------------------------------------
	// トレーサー (TRACER.Tracer)
	// -------------------------------------------------------------------------




	class Tracer {

		// トレーサーを作る
		constructor() {
			if (!PATH) throw new Error('Pathライブラリが必要です。');

			this._cmdQueue = [];
			this._remainTime = 0;

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

		// 今の状態を保存する
		save() {
			const t = this._getState();
			this._stack.push(t);
			return this;
		}

		// 前の状態を復元する
		restore() {
			const t = this._stack.pop();
			this._setState(t);
			return this;
		}

		// （ライブラリ内だけで使用）状態を取得する
		_getState() {
			return [
				this._x, this._y, this._dir,  // 以下、順番に依存関係あり
				this._step,
				this._liner.edge(),
				this._homeX, this._homeY, this._homeDir,
			];
		}

		// （ライブラリ内だけで使用）状態を設定する（状態）
		_setState(t) {
			this._changePos(t[0], t[1], t[2]);  // 以下、順番に依存関係あり
			this.step(t[3]);
			this._liner.edge(t[4]);
			this._homeX = t[5]; this._homeY = t[6]; this._homeDir = t[7];
		}

		// （ライブラリ内だけで使用）場所や方向を変える時に呼ばれる
		_changePos(x, y, opt_deg) {
			this._x = x;
			this._y = y;
			if (opt_deg !== undefined) this._dir = checkDegRange(opt_deg);
		}


		// -------------------------------- 場所か方向の変化


		// 前に進む（歩数）
		go(step) {
			this._addCommand((limit) => {
				return this._liner.line(this._x, this._y, this._dir - 90, step * this._step, limit);
			});
			return this;
		}

		// 後ろに戻る（歩数）
		back(step) {
			return this.go(-step);  // 前に進むことの逆
		}

		// 右に回る（角度）
		turnRight(deg) {
			this._addCommand((limit) => {
				return this._doTurn(deg, limit);
			});
			return this;
		}

		// 左に回る（角度）
		turnLeft(deg) {
			return this.turnRight(-deg);  // 右に回ることの逆
		}

		// （ライブラリ内だけで使用）方向を変える
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

		// x座標（<値>）
		x(val) {
			if (val === undefined) return this._x;
			this._addCommand((limit) => { this._changePos(val, this._y); });
			return this;
		}

		// y座標（<値>）
		y(val) {
			if (val === undefined) return this._y;
			this._addCommand((limit) => { this._changePos(this._x, val); });
			return this;
		}

		// 方向（<角度>）
		direction(deg) {
			if (deg === undefined) return this._dir;
			this._addCommand((limit) => { this._changePos(this._x, this._y, deg); });
			return this;
		}

		// 移動する（x座標、y座標、<方向>）
		moveTo(x, y, opt_dir) {
			this._addCommand((limit) => {
				this._changePos(x, y);
				if (opt_dir !== undefined) this._changePos(this._x, this._y, opt_dir);  // 値のチェックが必要なので関数呼び出し
			});
			return this;
		}

		// ホームに帰る（最初の場所と方向に戻る）
		home() {
			return this.moveTo(this._homeX, this._homeY, this._homeDir);
		}

		// 今の場所をホームに
		setHome() {
			this._addCommand(() => {
				this._homeX   = this._x;
				this._homeY   = this._y;
				this._homeDir = this._dir;
			});
			return this;
		}


		// -------------------------------- 場所と方向の変化


		// 右にカーブする（歩数1、角度1、歩数2<、角度2、歩数3>）
		curveRight(step0, deg, step1, opt_deg, opt_step) {
			this._addCommand((limit) => {
				return this._doCurve(step0, deg, step1, opt_deg, opt_step, limit);
			});
			return this;
		}

		// 左にカーブする（歩数1、角度1、歩数2<、角度2、歩数3>）
		curveLeft(step0, deg, step1, opt_deg, opt_step) {
			if (opt_deg === undefined) {
				return this.curveRight(step0, -deg, step1);
			} else {
				return this.curveRight(step0, -deg, step1, -opt_deg, opt_step);
			}
		}

		// （ライブラリ内だけで使用）実際にカーブする
		_doCurve(step0, deg, step1, opt_deg, opt_step, limit) {
			const s = this._step;
			if (opt_deg === undefined) {
				return this._liner.quadCurve(this._x, this._y, this._dir - 90, step0 * s, deg, step1 * s, limit);
			} else {
				return this._liner.bezierCurve(this._x, this._y, this._dir - 90, step0 * s, deg, step1 * s, opt_deg, opt_step * s, limit);
			}
		}

		// 右に曲がる弧をかく（半径（配列なら横半径とたて半径）、角度（配列なら開始角度と終了角度））
		arcRight(r, deg) {
			this._arcPrep(r, deg, false);
			return this;
		}

		// 左に曲がる弧をかく（半径（配列なら横半径とたて半径）、角度（配列なら開始角度と終了角度））
		arcLeft(r, deg) {
			this._arcPrep(r, deg, true);
			return this;
		}

		// （ライブラリ内だけで使用）弧をかく
		_arcPrep(r, deg, isLeft) {
			this._addCommand((limit) => {
				return this._doArc(r, deg, isLeft, limit);
			});
		}

		// （ライブラリ内だけで使用）実際に弧をかく
		_doArc(r, deg, isLeft, limit) {
			const p = PATH.arrangeArcParams(r, deg, this._step);
			let rev = 0;

			if (isLeft) {
				p.deg0 = -p.deg0;
				p.deg1 = -p.deg1;
			} else {
				p.deg0 = p.deg0 + 180;
				p.deg1 = p.deg1 + 180;
				rev = Math.PI;  // 時計回りの接線の傾きなのでPIを足す（逆向きにする）
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


		// -------------------------------- その他


		// 1歩の長さ（<値>）
		step(val) {
			if (val === undefined) return this._step;
			this._addCommand(() => { this._step = val; });
			return this;
		}

		// エッジ（<エッジを決める関数>）
		edge(func) {
			if (func === undefined) return this._liner.edge();
			this._addCommand(() => { this._liner.edge(func); });
			return this;
		}

		// 今の場所から見て、ある場所がどの角度かを返す（ある場所の座標x、y）
		getDirectionOf(x, y) {
			return (Math.atan2(y - this._y, x - this._x) * 180.0 / Math.PI - this._dir - 90);
		}


		// -------------------------------- アニメーション


		// 後で実行する（関数、<関数に渡す引数>）
		doLater(func, args_array) {
			const fn = function () { func.apply(this, args_array); };
			this._addCommand(fn);
			return this;
		}

		// 直ぐに実行する（関数、<関数に渡す引数>）
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

		// （ライブラリ内だけで使用）コマンドを追加する（関数）
		_addCommand(func) {
			this._cmdQueue.push(new Command(func));
		}

		// アニメーションを次に進める（フレーム数）
		stepNext(num) {
			this.update(this._x, this._y, this._dir, num);
		}

		// スピードに合わせて座標を更新する
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

		// 現在の動きをキャンセルする
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

		// すべての動きを止める
		stop() {
			this._cmdQueue.length = 0;
			this._remainTime = 0;
			return this;
		}

	}




	// -------------------------------------------------------------------------
	// コマンド (TRACER.Tracer)
	// -------------------------------------------------------------------------




	class Command {

		// （ライブラリ内だけで使用）コマンドを作る（関数）
		constructor(func) {
			this._func = func;
			this._initState = null;
		}

		// （ライブラリ内だけで使用）コマンドを実行する（進める時間）
		run(deltaT) {
			const pc = this._func(deltaT);
			return (pc === undefined) ? 0 : pc;
		}

	}


	//~ja ライブラリを作る --------------------------------------------------------
	//~en Create a library --------------------------------------------------------


	//~ja 関数の別名
	//~en Function alias
	const aliases = {
		go: ['forward', 'fd'],
		back: ['bk', 'backward'],
		step: ['unit'],
		turnRight: ['tr', 'right', 'rt'],
		turnLeft: ['tl', 'left', 'lt'],
		direction: ['heading'],
		curveRight: ['cr'],
		curveLeft: ['cl'],
		arcRight: ['ar'],
		arcLeft: ['al'],
		getDirectionOf: ['towards'],
	};

	//~ja 関数の別名を登録する
	//~en Register function alias
	Object.keys(aliases).forEach((p) => {
		aliases[p].forEach((a) => {
			Tracer.prototype[a] = Tracer.prototype[p];
		});
	});

	return { Tracer };

}());
