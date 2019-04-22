//
// スプライト・ライブラリ（SPRITE）
// 日付: 2019-04-22
// 作者: 柳田拓人（Space-Time Inc.）
//
// スプライト（アニメのセル画のようなもの）を作って、
// 好きな場所に好きな大きさ、向き、透明度で表示するためのライブラリです。
//


// ライブラリ変数
const SPRITE = (function () {

	'use strict';




	// -------------------------------------------------------------------------
	// ライブラリ中だけで使用するユーティリティ
	// -------------------------------------------------------------------------




	// 角度を0～360度の範囲にする
	const checkDegRange = function (deg) {
		deg %= 360;
		if (deg < 0) deg += 360;
		return deg;
	};

	// 関数なら関数を呼び出し、値ならそのまま返す
	const valueFunction = function (vf) {
		if (typeof vf === 'function') {
			return vf();
		} else {
			return vf;
		}
	};

	// 範囲をチェックする関数を作る
	const makeRangeChecker = function (min, max, isLoop) {
		if (isLoop) {
			return function (v) {
				if (v < min) return max;
				if (max < v) return min;
				return v;
			}
		} else {
			return function (v) {
				if (v < min) return min;
				if (max < v) return max;
				return v;
			}
		}
	};




	// -------------------------------------------------------------------------
	// スプライト・ステージ共通
	// -------------------------------------------------------------------------




	class Element {

		// （<モーション>）
		constructor(motion = null) {
			this._parent = null;

			this._x   = 0;
			this._y   = 0;
			this._dir = 0;

			this._scale = 1;  // 拡大率（大きさ）
			this._alpha = 1;  // 透明度アルファ（RGBAのAと同じ）
			this._isFixedHeading = false;  // 絵を描く方向を向きと関係なく固定する

			this._angle  = 0;  // Z軸を中心とする角度（向き）
			this._angleX = 0;  // X軸を中心とする角度（向き）
			this._angleZ = 0;  // Z軸を中心とする角度2（向き）

			this._speed = 1;

			this._angleSpeed  = 0;
			this._angleSpeedX = 0;
			this._angleSpeedZ = 0;

			this._checkRangeX = null;
			this._checkRangeY = null;

			this._motion = motion;
		}

		// x座標（<値>）
		x(val) {
			if (val === undefined) return this._x;
			this._x = val;
			return this;
		}

		// y座標（<値>）
		y(val) {
			if (val === undefined) return this._y;
			this._y = val;
			return this;
		}

		// 方向（<角度>）
		direction(deg) {
			if (deg === undefined) return this._dir;
			this._dir = checkDegRange(deg);
			return this;
		}

		// 移動する（x座標、y座標、<方向>）
		moveTo(x, y, opt_dir) {
			this._x = x;
			this._y = y;
			if (opt_dir !== undefined) this._dir = checkDegRange(opt_dir);
			return this;
		}

		// スケール（<値>）
		scale(val) {
			if (val === undefined) return this._scale;
			this._scale = val;
			return this;
		}

		// アルファ（<値>）
		alpha(val) {
			if (val === undefined) return this._alpha;
			this._alpha = val;
			return this;
		}

		// 方向（<値>）
		angle(val) {
			if (val === undefined) return this._angle;
			this._angle = val;
			return this;
		}

		// 方向x（<値>）
		angleX(val) {
			if (val === undefined) return this._angleX;
			this._angleX = val;
			return this;
		}

		// 方向z（<値>）
		angleZ(val) {
			if (val === undefined) return this._angleZ;
			this._angleZ = val;
			return this;
		}

		// 絵を描く方向を向きと関係なく固定するか？（<値>）
		fixedHeading(val) {
			if (val === undefined) return this._isFixedHeading;
			this._isFixedHeading = val;
			return this;
		}

		// スピード（<値>）
		speed(val) {
			if (val === undefined) return this._speed;
			this._speed = val;
			return this;
		}

		// 方向スピード（<値>）
		angleSpeed(val) {
			if (val === undefined) return this._angleSpeed;
			this._angleSpeed = val;
			return this;
		}

		// 方向スピードx（<値>）
		angleSpeedX(val) {
			if (val === undefined) return this._angleSpeedX;
			this._angleSpeedX = val;
			return this;
		}

		// 方向スピードz（<値>）
		angleSpeedZ(val) {
			if (val === undefined) return this._angleSpeedZ;
			this._angleSpeedZ = val;
			return this;
		}

		// 横方向の範囲をセットする（始まり、終わり、ループする？）
		setRangeX(min, max, isLoop) {
			this._checkRangeX = makeRangeChecker(min, max, isLoop);
		}

		// たて方向の範囲をセットする（始まり、終わり、ループする？）
		setRangeY(min, max, isLoop) {
			this._checkRangeY = makeRangeChecker(min, max, isLoop);
		}

		// 更新前イベントのハンドラーをセットする（関数、関数に渡す引数の配列）
		setOnUpdate(func, args_array) {
			const fn = function () { func.apply(this, args_array); };
			this._onUpdate = fn;
		}

		// 更新後イベントのハンドラーをセットする（関数、関数に渡す引数の配列）
		setOnUpdated(func, args_array) {
			const fn = function () { func.apply(this, args_array); };
			this._onUpdated = fn;
		}

		// 動き（<動き>）
		motion(val) {
			if (val === undefined) return this._motion;
			this._motion = val;
			return this;
		}

		// （ライブラリ内だけで使用）コンテキストの座標変換とアルファ値をセットする
		_setTransformation(ctx) {
			ctx.translate(this._x, this._y);  // 中心点をずらす
			if (!this._isFixedHeading) {
				ctx.rotate(this._dir * Math.PI / 180.0);
			}
			// 下ではスプライトを、Z軸中心にangle度回転、X軸を中心にangleX度回転、さらにもう一度Z軸を中心にangleZ度回転させている
			ctx.rotate(this._angleZ * Math.PI / 180);  // 角度をラジアンに変換して回転（ラジアン = 角度 ✕ π / 180）
			ctx.scale(1.0, Math.cos(this._angleX * Math.PI / 180));
			ctx.rotate(this._angle * Math.PI / 180);  // 角度をラジアンに変換して回転（ラジアン = 角度 ✕ π / 180）
			// ※Z-X-Zのオイラー角に対応

			if (this._scale instanceof Array) {  // scaleが配列だったら
				ctx.scale(this._scale[0], this._scale[1]);  // 縦と横で別々にスケールを設定
			} else {
				ctx.scale(this._scale, this._scale);  // 縦と横で共通のスケールを設定
			}
			ctx.globalAlpha *= this._alpha;  // 透明度アルファを設定
		}

		// （ライブラリ内だけで使用）スピードに合わせて座標と角度を更新する
		_update() {
			if (this._onUpdate) this._onUpdate.call(this);  // 更新前イベント

			this._angle  = checkDegRange(this._angle  + valueFunction(this._angleSpeed));
			this._angleX = checkDegRange(this._angleX + valueFunction(this._angleSpeedX));
			this._angleZ = checkDegRange(this._angleZ + valueFunction(this._angleSpeedZ));

			if (this._motion !== null) {
				const newPos = this._motion.update(this._x, this._y, this._dir, this._speed);
				this._x   = newPos[0];
				this._y   = newPos[1];
				this._dir = newPos[2];
			}
			if (this._checkRangeX !== null) this._x = this._checkRangeX(this._x);
			if (this._checkRangeY !== null) this._y = this._checkRangeY(this._y);

			if (this._onUpdated) this._onUpdated.call(this);  // 更新後イベント
			this._fisrtUpdated = true;  // 最初にこの関数が呼ばれ、座標などが正しいことを示す
		}

	}




	// -------------------------------------------------------------------------
	// スプライト (SPRITE.Sprite)
	// -------------------------------------------------------------------------




	class Sprite extends Element {

		// スプライトを作る（絵を描く関数、<関数に渡す引数の配列>、<モーション>）
		// ※ただし普通は、SPRITE.MasterのmakeSprite関数を使う。
		constructor(drawFunction, opt_args_array, opt_motion) {
			super(opt_motion);

			this._drawFunction = drawFunction;  // 絵を描く関数
			this._drawFunctionArgs = opt_args_array;
		}

		// スプライトを描く（キャンバス・コンテキスト、その他の引数の配列）
		draw(ctx, args_array) {
			let args = args_array;
			if (this._drawFunctionArgs) {
				args = args_array.concat(this._drawFunctionArgs);
			}
			if (this._fisrtUpdated) {
				ctx.save();  // コンテキストの状態を保存
				this._setTransformation(ctx);
				this._drawFunction.apply(this, args);  // 絵を描く関数を呼び出す
				ctx.restore();  // コンテキストの状態を元に戻す
			}
			this._update();
		}

	}




	// -------------------------------------------------------------------------
	// ステージ (SPRITE.Stage)
	// -------------------------------------------------------------------------




	class Stage extends Element {

		// ステージを作る（<モーション>）
		constructor(opt_motion) {
			super(opt_motion);

			this._children = [];  // 子要素の配列
			this.localizeOffsetX = 0;
			this.localizeOffsetY = 0;
			this.localizeOffsetA = 0;

			this._localizeOption = null;
			this._update();
		}

		// スプライトを作って加える（絵をかく関数、<関数に渡す引数の配列>、<モーション>）
		makeSprite(drawFunction, opt_args_array, opt_motion) {
			const s = new SPRITE.Sprite(drawFunction, opt_args_array, opt_motion);  // スプライトを作る
			this.add(s);  // 加える
			return s;  // 作ったスプライトを返す
		}

		// ステージを作って加える
		makeStage() {
			const l = new SPRITE.Stage();  // ステージを作る
			this.add(l);  // 配列に加える
			return l;  // 作ったステージを返す
		}

		// スプライトか子ステージを加える（スプライトか子ステージ）
		add(child) {
			this._children.push(child);  // 配列に追加する
			child._parent = this;
		}

		// スプライトか子ステージを返す（何番目か）
		get(index) {
			return this._children[index];
		}

		// 何枚のスプライトか子ステージを持っているか、数を返す
		size() {
			return this._children.length;
		}

		// 持っているスプライトと子ステージに対して処理をする（処理をする関数）
		forEach(callback, thisArg) {
			for (let i = 0, I = this._children.length; i < I; i += 1) {
				const val = this._children[i];
				callback.call(thisArg, val, i, this);
			}
		}

		// 指定したスプライトを固定して表示する（スプライトかステージ、<回転をおさえるか>）
		localize(descendant, opt_suppressRotation) {
			this._localizeOption = [descendant, opt_suppressRotation];
		}

		// （ライブラリ内だけで使用）指定したスプライトを固定して表示する
		_localize() {
			if (this._localizeOption) {
				const descendant = this._localizeOption[0], opt_suppressRotation = this._localizeOption[1];
				const off = _getPositionOnParent(descendant, 0, 0, 0, opt_suppressRotation);
				this.localizeOffsetX = -off[0];
				this.localizeOffsetY = -off[1];
				this.localizeOffsetA = -off[2];
			} else {
				this.localizeOffsetX = 0;
				this.localizeOffsetY = 0;
				this.localizeOffsetA = 0;
			}
		}

		// このステージの原点のコンテキストでの場所を返す（スプライトかステージ）
		getPositionOnContext(descendant) {
			const p = this._getPositionOnParent(descendant, 0, 0, 0);
			p[0] += this.localizeOffsetX;
			p[1] += this.localizeOffsetY;

			const r = this.localizeOffsetA * Math.PI / 180, sin = Math.sin(r), cos = Math.cos(r);
			const x = (p[0] * cos - p[1] * sin);
			const y = (p[0] * sin + p[1] * cos);
			return [x, y];
		}

		// 持っているスプライトと子ステージを全て描く（キャンバス・コンテキスト、その他の引数の配列）
		draw(ctx, args_array) {
			ctx.save();  // コンテキストの状態を保存

			this._localize();
			ctx.rotate(this.localizeOffsetA * Math.PI / 180);
			ctx.translate(this.localizeOffsetX, this.localizeOffsetY);
			this._setTransformation(ctx);

			for (let i = 0, I = this._children.length; i < I; i += 1) {  // 持っているスプライトの数だけくり返す
				const c = this._children[i];  // i番目のスプライトを取り出す
				c.draw.call(c, ctx, args_array);  // スプライトのdraw関数を呼び出す
			}
			ctx.restore();  // コンテキストの状態を元に戻す

			this._update();  // このタイミングでTracer::stepNextが呼ばれ、その結果、Tracer::onStepも呼び出される
		}

		// （ライブラリ内だけで使用）
		_getPositionOnParent(elm, cx, cy, ca, opt_suppressRotation) {
			const a = (opt_suppressRotation ? elm._angle : 0) + (elm._isFixedHeading ? 0 : elm._dir);
			const r = a * Math.PI / 180, sin = Math.sin(r), cos = Math.cos(r);
			let sx, sy;
			if (elm._scale instanceof Array) {  // scaleが配列だったら
				sx = elm._scale[0], sy = elm._scale[1];
			} else {
				sx = sy = elm._scale;
			}
			const x = sx * (cx * cos - cy * sin);
			const y = sy * (cx * sin + cy * cos);
			if (elm._parent === null) return [x + elm._x, y + elm._y, a + ca];
			return this._getPositionOnParent(elm._parent, x + elm._x, y + elm._y, a + ca);
		}

	}




	// -------------------------------------------------------------------------
	// ユーティリティ関数
	// -------------------------------------------------------------------------




	// スプライトの軌跡をプロットする関数を作る（子孫要素、先祖ステージ、プロットするコンテキスト）
	const makePlotFunction = function (descendant, ancestorStage, ctx) {
		let old = [];
		return function () {
			if (!descendant._fisrtUpdated) return;
			const p = ancestorStage.getPositionOnContext(descendant);
			if (old.length > 0) {
				ctx.beginPath();
				ctx.moveTo(old[0], old[1]);
				ctx.lineTo(p[0], p[1]);
				ctx.stroke();
			}
			old = p;
		};
	};




	// -------------------------------------------------------------------------
	// ライブラリを作る
	// -------------------------------------------------------------------------




	// ライブラリとして返す
	return { Stage, Sprite, makePlotFunction };

}());
