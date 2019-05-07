/**~ja
 * 要素（スプライト・ステージ共通）
 * @author Takuto Yanagida
 * @version 2019-05-07
 */
/**~en
 * Element (common to sprites and stages)
 * @author Takuto Yanagida
 * @version 2019-05-07
 */
class Element {

	/**~ja
	 * 要素を作る
	 * @param {Motion?} [motion=null] 動き
	 */
	/**~en
	 * Make an element
	 * @param {Motion?} [motion=null] Motion
	 */
	constructor(motion = null) {
		this._parent = null;

		this._x = 0;
		this._y = 0;
		this._dir = 0;

		this._scale = 1;
		this._alpha = 1;
		this._isFixedHeading = false;

		this._angle = 0;
		this._angleX = 0;
		this._angleZ = 0;

		this._speed = 1;

		this._angleSpeed = 0;
		this._angleSpeedX = 0;
		this._angleSpeedZ = 0;

		this._checkRangeX = null;
		this._checkRangeY = null;

		this._motion = motion;
	}

	/**~ja
	 * x座標
	 * @param {number=} val x座標の値
	 * @return {number|Element} x座標の値かこの要素
	 */
	/**~en
	 * X coordinate
	 * @param {number=} val Value of x coordinate
	 * @return {number|Element} Value of x coordinate, or this element
	 */
	x(val) {
		if (val === undefined) return this._x;
		this._x = val;
		return this;
	}

	/**~ja
	 * y座標
	 * @param {number=} val y座標の値
	 * @return {number|Element} y座標の値かこの要素
	 */
	/**~en
	 * Y coordinate
	 * @param {number=} val Value of y coordinate
	 * @return {number|Element} Value of y coordinate, or this element
	 */
	y(val) {
		if (val === undefined) return this._y;
		this._y = val;
		return this;
	}

	/**~ja
	 * 方向
	 * @param {number=} deg 角度の値
	 * @return {number|Element} 角度の値かこの要素
	 */
	/**~en
	 * Direction
	 * @param {number=} deg Value of degree
	 * @return {number|Element} Value of degree, or this element
	 */
	direction(deg) {
		if (deg === undefined) return this._dir;
		this._dir = checkDegRange(deg);
		return this;
	}

	/**~ja
	 * 移動する
	 * @param {number} x x座標
	 * @param {number} y y座標
	 * @param {number=} opt_dir 方向（オプション）
	 * @return {Element} この要素
	 */
	/**~en
	 * Move to
	 * @param {number} x X coordinate
	 * @param {number} y Y coordinate
	 * @param {number=} opt_dir Direction (optional)
	 * @return {Element} This element
	 */
	moveTo(x, y, opt_dir) {
		this._x = x;
		this._y = y;
		if (opt_dir !== undefined) this._dir = checkDegRange(opt_dir);
		return this;
	}

	/**~ja
	 * スケール
	 * @param {number=} val スケールの値
	 * @return {number|Element} スケールの値かこの要素
	 */
	/**~en
	 * Scale
	 * @param {number=} val Value of scale
	 * @return {number|Element} Value of scale, or this element
	 */
	scale(val) {
		if (val === undefined) return this._scale;
		this._scale = val;
		return this;
	}

	/**~ja
	 * アルファ
	 * @param {number=} val アルファの値
	 * @return {number|Element} アルファの値かこの要素
	 */
	/**~en
	 * Alpha
	 * @param {number=} val Value of alpha
	 * @return {number|Element} Value of alpha, or this element
	 */
	alpha(val) {
		if (val === undefined) return this._alpha;
		this._alpha = val;
		return this;
	}

	/**~ja
	 * z軸を中心とする角度（向き）
	 * @param {number=} deg 角度の値
	 * @return {number|Element} 角度の値かこの要素
	 */
	/**~en
	 * Angle around z axis (direction)
	 * @param {number=} deg Value of degree
	 * @return {number|Element} Value of degree, or this element
	 */
	angle(val) {
		if (val === undefined) return this._angle;
		this._angle = val;
		return this;
	}

	/**~ja
	 * x軸を中心とする角度（向き）
	 * @param {number=} deg 角度の値
	 * @return {number|Element} 角度の値かこの要素
	 */
	/**~en
	 * Angle around x axis (direction)
	 * @param {number=} deg Value of degree
	 * @return {number|Element} Value of degree, or this element
	 */
	angleX(val) {
		if (val === undefined) return this._angleX;
		this._angleX = val;
		return this;
	}

	/**~ja
	 * z軸を中心とする角度2（向き）
	 * @param {number=} deg 角度の値
	 * @return {number|Element} 角度の値かこの要素
	 */
	/**~en
	 * 2nd angle around z axis (direction)
	 * @param {number=} deg Value of degree
	 * @return {number|Element} Value of degree, or this element
	 */
	angleZ(val) {
		if (val === undefined) return this._angleZ;
		this._angleZ = val;
		return this;
	}

	/**~ja
	 * 絵を描く方向を向きと関係なく固定するか？
	 * @param {boolean=} val 値
	 * @return {boolean|Element} 値かこの要素
	 */
	/**~en
	 * Whether is the drawing direction fixed regardless of the direction of the element?
	 * @param {boolean=} val Value
	 * @return {boolean|Element} Value or this element
	 */
	fixedHeading(val) {
		if (val === undefined) return this._isFixedHeading;
		this._isFixedHeading = val;
		return this;
	}

	/**~ja
	 * スピード
	 * @param {number=} val スピード
	 * @return {number|Element} スピードかこの要素 
	 */
	/**~en
	 * Speed
	 * @param {number=} val Speed
	 * @return {number|Element} Speed or this element
	 */
	speed(val) {
		if (val === undefined) return this._speed;
		this._speed = val;
		return this;
	}

	/**~ja
	 * 方向スピード
	 * @param {number=} val 方向スピード
	 * @return {number|Element} 方向スピードかこの要素
	 */
	/**~en
	 * Angle speed
	 * @param {number=} val Angle speed
	 * @return {number|Element} Angle speed or this element
	 */
	angleSpeed(val) {
		if (val === undefined) return this._angleSpeed;
		this._angleSpeed = val;
		return this;
	}

	/**~ja
	 * 方向スピードx
	 * @param {number=} val 方向スピード
	 * @return {number|Element} 方向スピードかこの要素
	 */
	/**~en
	 * Angle speed x
	 * @param {number=} val Angle speed
	 * @return {number|Element} Angle speed or this element
	 */
	angleSpeedX(val) {
		if (val === undefined) return this._angleSpeedX;
		this._angleSpeedX = val;
		return this;
	}

	/**~ja
	 * 方向スピードz
	 * @param {number=} val 方向スピード
	 * @return {number|Element} 方向スピードかこの要素
	 */
	/**~en
	 * Angle speed z
	 * @param {number=} val Angle speed
	 * @return {number|Element} Angle speed or this element
	 */
	angleSpeedZ(val) {
		if (val === undefined) return this._angleSpeedZ;
		this._angleSpeedZ = val;
		return this;
	}

	/**~ja
	 * 横方向の範囲をセットする
	 * @param {number} min 始まり
	 * @param {number} max 終わり
	 * @param {boolean} isLoop ループする？
	 */
	/**~en
	 * Set the horizontal range
	 * @param {number} min Minimum value
	 * @param {number} max Maximum value
	 * @param {boolean} isLoop Whether to loop
	 */
	setRangeX(min, max, isLoop) {
		this._checkRangeX = makeRangeChecker(min, max, isLoop);
	}

	/**~ja
	 * たて方向の範囲をセットする
	 * @param {number} min 始まり
	 * @param {number} max 終わり
	 * @param {boolean} isLoop ループする？
	 */
	/**~en
	 * Set the vertical range
	 * @param {number} min Minimum value
	 * @param {number} max Maximum value
	 * @param {boolean} isLoop Whether to loop
	 */
	setRangeY(min, max, isLoop) {
		this._checkRangeY = makeRangeChecker(min, max, isLoop);
	}

	/**~ja
	 * 更新前イベントのハンドラーをセットする
	 * @param {function(*)} fn 関数
	 * @param {Array} args_array 関数に渡す引数の配列
	 */
	/**~en
	 * Set handler for update event
	 * @param {function(*)} fn Function
	 * @param {Array} args_array Array of arguments to pass to the function
	 */
	setOnUpdate(fn, args_array) {
		const f = () => { fn.apply(this, args_array); };
		this._onUpdate = f;
	}

	/**~ja
	 * 更新後イベントのハンドラーをセットする
	 * @param {function(*)} fn 関数
	 * @param {Array} args_array 関数に渡す引数の配列
	 */
	/**~en
	 * Set handler for updated event
	 * @param {function(*)} fn Function
	 * @param {Array} args_array Array of arguments to pass to the function
	 */
	setOnUpdated(fn, args_array) {
		const f = () => { fn.apply(this, args_array); };
		this._onUpdated = f;
	}

	/**~ja
	 * 動き
	 * @param {Motion=} val 動き
	 * @return {Motion|Element} 動きかこの要素
	 */
	/**~en
	 * Motion
	 * @param {Motion=} val Motion
	 * @return {Motion|Element} Motion or this element
	 */
	motion(val) {
		if (val === undefined) return this._motion;
		this._motion = val;
		return this;
	}

	/**~ja
	 * コンテキストの座標変換とアルファ値をセットする（ライブラリ内だけで使用）
	 * @private
	 * @param {CanvasRenderingContext2D} ctx レンダリング・コンテキスト
	 */
	/**~en
	 * Set context transformation and alpha value (used only in the library)
	 * @private
	 * @param {CanvasRenderingContext2D} ctx Rendering context
	 */
	_setTransformation(ctx) {
		ctx.translate(this._x, this._y);
		if (!this._isFixedHeading) {
			ctx.rotate(this._dir * Math.PI / 180.0);
		}
		//~ja 下ではスプライトを、Z軸中心にangle度回転、X軸を中心にangleX度回転、さらにもう一度Z軸を中心にangleZ度回転させている
		//~en Below, the sprite is rotated by angle degrees around the Z axis, angleX degrees around the X axis, and again by angleZ degrees around the Z axis.
		//~ja 角度をラジアンに変換して回転（ラジアン = 角度 ✕ π / 180）
		//~en Convert an angle to radians and rotate (radian = angle * π / 180)
		ctx.rotate(this._angleZ * Math.PI / 180);
		ctx.scale(1.0, Math.cos(this._angleX * Math.PI / 180));
		ctx.rotate(this._angle * Math.PI / 180);
		//~ja ※Z-X-Zのオイラー角に対応
		//~en * Corresponding to Euler angle of Z-X-Z

		if (this._scale instanceof Array) {
			ctx.scale(this._scale[0], this._scale[1]);
		} else {
			ctx.scale(this._scale, this._scale);
		}
		ctx.globalAlpha *= this._alpha;
	}

	/**~ja
	 * スピードに合わせて座標と角度を更新する（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Update coordinates and angles according to the speeds (used only in the library)
	 * @private
	 */
	_update() {
		//~ja 更新前イベント
		//~en Update event
		if (this._onUpdate) this._onUpdate.call(this);

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

		//~ja 更新後イベント
		//~en Updated event
		if (this._onUpdated) this._onUpdated.call(this);
		//~ja 最初にこの関数が呼ばれ、座標などが正しいことを示す
		//~en This function is called first to indicate that the coordinates etc. are correct
		this._fisrtUpdated = true;
	}

}