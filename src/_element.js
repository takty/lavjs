// -------------------------------------------------------------------------
// スプライト・ステージ共通
// -------------------------------------------------------------------------




class Element {

	// （<モーション>）
	constructor(motion = null) {
		this._parent = null;

		this._x = 0;
		this._y = 0;
		this._dir = 0;

		this._scale = 1;  // 拡大率（大きさ）
		this._alpha = 1;  // 透明度アルファ（RGBAのAと同じ）
		this._isFixedHeading = false;  // 絵を描く方向を向きと関係なく固定する

		this._angle = 0;  // Z軸を中心とする角度（向き）
		this._angleX = 0;  // X軸を中心とする角度（向き）
		this._angleZ = 0;  // Z軸を中心とする角度2（向き）

		this._speed = 1;

		this._angleSpeed = 0;
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

		this._angle = checkDegRange(this._angle + valueFunction(this._angleSpeed));
		this._angleX = checkDegRange(this._angleX + valueFunction(this._angleSpeedX));
		this._angleZ = checkDegRange(this._angleZ + valueFunction(this._angleSpeedZ));

		if (this._motion !== null) {
			const newPos = this._motion.update(this._x, this._y, this._dir, this._speed);
			this._x = newPos[0];
			this._y = newPos[1];
			this._dir = newPos[2];
		}
		if (this._checkRangeX !== null) this._x = this._checkRangeX(this._x);
		if (this._checkRangeY !== null) this._y = this._checkRangeY(this._y);

		if (this._onUpdated) this._onUpdated.call(this);  // 更新後イベント
		this._fisrtUpdated = true;  // 最初にこの関数が呼ばれ、座標などが正しいことを示す
	}

}