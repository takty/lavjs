/**~ja
 * 要素（スプライト・ステージ共通）
 * @version 2021-02-06
 */
/**~en
 * Element (common to sprites and stages)
 * @version 2021-02-06
 */
class Element {

	/**~ja
	 * 要素を作る
	 * @constructor
	 * @param {Motion=} [motion=null] 動き
	 * @param {Rotation=} [rotation=null] 回転
	 */
	/**~en
	 * Make an element
	 * @constructor
	 * @param {Motion=} [motion=null] Motion
	 * @param {Rotation=} [rotation=null] Rotation
	 */
	constructor(motion = null, rotation = null) {
		this._parent    = null;
		this._data      = null;
		this._observers = null;

		this._x   = 0;
		this._y   = 0;
		this._dir = 0;

		this._scale = 1;
		this._alpha = 1;
		this._isFixedHeading = false;

		this._angle  = 0;
		this._angleX = 0;
		this._angleZ = 0;

		this._speed = 1;

		this._checkRangeX = null;
		this._checkRangeY = null;

		this._motion   = motion;
		this._rotation = rotation;
	}

	/**~ja
	 * x座標
	 * @param {?number} val x座標の値
	 * @return {number|Element} x座標の値／この要素
	 */
	/**~en
	 * X coordinate
	 * @param {?number} val Value of x coordinate
	 * @return {number|Element} Value of x coordinate, or this element
	 */
	x(val) {
		if (val === undefined) return this._x;
		this._x = val;
		return this;
	}

	/**~ja
	 * y座標
	 * @param {?number} val y座標の値
	 * @return {number|Element} y座標の値／この要素
	 */
	/**~en
	 * Y coordinate
	 * @param {?number} val Value of y coordinate
	 * @return {number|Element} Value of y coordinate, or this element
	 */
	y(val) {
		if (val === undefined) return this._y;
		this._y = val;
		return this;
	}

	/**~ja
	 * 方向
	 * @param {?number} deg 角度の値
	 * @return {number|Element} 角度の値／この要素
	 */
	/**~en
	 * Direction
	 * @param {?number} deg Value of degree
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
	 * @param {?number} opt_dir 方向（オプション）
	 * @return {Element} この要素
	 */
	/**~en
	 * Move to
	 * @param {number} x X coordinate
	 * @param {number} y Y coordinate
	 * @param {?number} opt_dir Direction (optional)
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
	 * @param {?number} val スケールの値
	 * @return {number|Element} スケールの値／この要素
	 */
	/**~en
	 * Scale
	 * @param {?number} val Value of scale
	 * @return {number|Element} Value of scale, or this element
	 */
	scale(val) {
		if (val === undefined) return this._scale;
		this._scale = val;
		return this;
	}

	/**~ja
	 * アルファ
	 * @param {?number} val アルファの値
	 * @return {number|Element} アルファの値／この要素
	 */
	/**~en
	 * Alpha
	 * @param {?number} val Value of alpha
	 * @return {number|Element} Value of alpha, or this element
	 */
	alpha(val) {
		if (val === undefined) return this._alpha;
		this._alpha = val;
		return this;
	}

	/**~ja
	 * z軸を中心とする角度（向き）
	 * @param {?number} deg 角度の値
	 * @return {number|Element} 角度の値／この要素
	 */
	/**~en
	 * Angle around z axis (direction)
	 * @param {?number} deg Value of degree
	 * @return {number|Element} Value of degree, or this element
	 */
	angle(val) {
		if (val === undefined) return this._angle;
		this._angle = val;
		return this;
	}

	/**~ja
	 * x軸を中心とする角度（向き）
	 * @param {?number} deg 角度の値
	 * @return {number|Element} 角度の値／この要素
	 */
	/**~en
	 * Angle around x axis (direction)
	 * @param {?number} deg Value of degree
	 * @return {number|Element} Value of degree, or this element
	 */
	angleX(val) {
		if (val === undefined) return this._angleX;
		this._angleX = val;
		return this;
	}

	/**~ja
	 * z軸を中心とする角度2（向き）
	 * @param {?number} deg 角度の値
	 * @return {number|Element} 角度の値／この要素
	 */
	/**~en
	 * 2nd angle around z axis (direction)
	 * @param {?number} deg Value of degree
	 * @return {number|Element} Value of degree, or this element
	 */
	angleZ(val) {
		if (val === undefined) return this._angleZ;
		this._angleZ = val;
		return this;
	}

	/**~ja
	 * 絵をかく方向を向きと関係なく固定するか？
	 * @param {boolean=} val 値
	 * @return {boolean|Element} 値／この要素
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
	 * @param {?number} val スピード
	 * @return {number|Element} スピード／この要素
	 */
	/**~en
	 * Speed
	 * @param {?number} val Speed
	 * @return {number|Element} Speed or this element
	 */
	speed(val) {
		if (val === undefined) return this._speed;
		this._speed = val;
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
	 * 更新前イベントに対応する関数をセットする
	 * @param {function()} handler 関数
	 * @return {function()=} 関数
	 */
	/**~en
	 * Set the function handling the before update event
	 * @param {function(Element)} handler Function
	 * @return {function(Element)=} Function
	 */
	onBeforeUpdate(handler) {
		if (handler === undefined) return this._onBeforeUpdate;
		this._onBeforeUpdate = handler;
	}

	/**~ja
	 * 更新イベントに対応する関数をセットする
	 * @param {function()} handler 関数
	 * @return {function()=} 関数
	 */
	/**~en
	 * Set the function handling the update event
	 * @param {function(Element)} handler Function
	 * @return {function(Element)=} Function
	 */
	onUpdate(handler) {
		if (handler === undefined) return this._onUpdate;
		this._onUpdate = handler;
	}

	/**~ja
	 * 動き
	 * @param {Motion=} val 動き
	 * @return {Motion|Element} 動き／この要素
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
	 * 回転
	 * @param {Rotation=} val 回転
	 * @return {Rotation|Element} 回転／この要素
	 */
	/**~en
	 * Rotation
	 * @param {Rotation=} val Rotation
	 * @return {Rotation|Element} Rotation or this element
	 */
	rotation(val) {
		if (val === undefined) return this._rotation;
		this._rotation = val;
		return this;
	}

	/**~ja
	 * データ
	 * @param {?object} val データ
	 * @return {object|Element} データ／この要素
	 */
	/**~en
	 * Data
	 * @param {?object} val Data
	 * @return {object|Element} Data or this element
	 */
	data(val) {
		if (val === undefined) return this._data;
		this._data = val;
		return this;
	}

	/**~ja
	 * 紙の座標変換とアルファ値をセットする（ライブラリ内だけで使用）
	 * @private
	 * @param {Paper|CanvasRenderingContext2D} ctx 紙／キャンバス・コンテキスト
	 */
	/**~en
	 * Set paper transformation and alpha value (used only in the library)
	 * @private
	 * @param {Paper|CanvasRenderingContext2D} ctx Paper or canvas context
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
	 * @param {number} deltaTime 時間差（前回のフレームからの時間経過）[ms]
	 */
	/**~en
	 * Update coordinates and angles according to the speeds (used only in the library)
	 * @private
	 * @param {number} deltaTime Delta time [ms]
	 */
	_update(deltaTime) {
		//~ja 更新前イベント
		//~en Update event
		if (this._onBeforeUpdate) this._onBeforeUpdate(this);

		if (this._rotation !== null) {
			const newAs = this._rotation.update(this._speed * deltaTime, this._angle, this._angleX, this._angleZ);
			[this._angle, this._angleX, this._angleZ] = newAs;
		}
		if (this._motion !== null) {
			const newPos = this._motion.update(this._speed * deltaTime, this._x, this._y, this._dir);
			if (newPos.length === 2) newPos.push(this._dir);
			[this._x, this._y, this._dir] = newPos;
		}
		if (this._checkRangeX !== null) this._x = this._checkRangeX(this._x);
		if (this._checkRangeY !== null) this._y = this._checkRangeY(this._y);

		if (this._observers) {
			for (const o of this._observers) {
				o.update(this);
			}
		}

		//~ja 更新後イベント
		//~en Updated event
		if (this._onUpdate) this._onUpdate(this);
		//~ja 最初にこの関数が呼ばれ、座標などが正しいことを示す
		//~en This function is called first to indicate that the coordinates etc. are correct
		this._firstUpdated = true;
	}

}