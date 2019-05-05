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