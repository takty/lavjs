/**~ja
 * ステージ
 * @extends {Element}
 * @version 2021-02-06
 */
/**~en
 * Stage
 * @extends {Element}
 * @version 2021-02-06
 */
class Stage extends Element {

	/**~ja
	 * ステージを作る
	 * @constructor
	 * @param {Motion=} opt_motion モーション
	 */
	/**~en
	 * Make a stage
	 * @constructor
	 * @param {Motion=} opt_motion Motion
	 */
	constructor(opt_motion) {
		super(opt_motion);

		this._children = [];

		this._localizeOption = null;
		this._localizedOffset = [0, 0, 0];

		this._update(0);
	}

	/**~ja
	 * スプライトを作って加える
	 * @param {function(*)} drawFunction 絵をかく関数
	 * @param {Array=} opt_args_array 関数に渡す引数の配列
	 * @param {Motion=} opt_motion モーション
	 * @return {Sprite} スプライト
	 */
	/**~en
	 * Make a sprite and add it to this stage
	 * @param {function(*)} drawFunction Function to draw pictures
	 * @param {Array=} opt_args_array Array of arguments to pass to the function
	 * @param {Motion=} opt_motion Motion
	 * @return {Sprite} Sprite
	 */
	makeSprite(drawFunction, opt_args_array, opt_motion) {
		const s = new SPRITE.Sprite(drawFunction, opt_args_array, opt_motion);
		this.add(s);
		return s;
	}

	/**~ja
	 * ステージを作って加える
	 * @return {Stage} ステージ
	 */
	/**~en
	 * Make a stage and add it to this stage
	 * @return {Stage} Stage
	 */
	makeStage() {
		const l = new SPRITE.Stage();
		this.add(l);
		return l;
	}

	/**~ja
	 * スプライトか子ステージを加える
	 * @param {Element} child スプライトか子ステージ
	 */
	/**~en
	 * Add a sprite or a stage
	 * @param {Element} child A sprite or a child stage
	 */
	add(child) {
		this._children.push(child);
		child._parent = this;
	}

	/**~ja
	 * スプライトか子ステージを返す
	 * @param {number} index 何番目か
	 * @return {Element} スプライトか子ステージ
	 */
	/**~en
	 * スプライトか子ステージを返す
	 * @param {number} index Index
	 * @return {Element} Sprite or child stage
	 */
	get(index) {
		return this._children[index];
	}

	/**~ja
	 * 何枚のスプライトか子ステージを持っているか、数を返す
	 * @return {number} 数
	 */
	/**~en
	 * Return the count of sprites or child stages this stage has
	 * @return {number} Count
	 */
	size() {
		return this._children.length;
	}

	/**~ja
	 * 持っているスプライトと子ステージに対して処理をする
	 * @param {function} callback 処理をする関数
	 * @param {*} thisArg This引数
	 */
	/**~en
	 * Process for sprites and child stages that this stage has
	 * @param {function} callback Function to process
	 * @param {*} thisArg 'This' argument
	 */
	forEach(callback, thisArg) {
		for (let i = 0; i < this._children.length; i += 1) {
			const c = this._children[i];
			callback.call(thisArg, c, i, this);
		}
	}

	/**~ja
	 * 指定したスプライトを固定して表示する
	 * @param {Element} descendant スプライトかステージ
	 * @param {boolean=} opt_stopRotation 回転を止めるか
	 */
	/**~en
	 * Display specified sprite as fixed
	 * @param {Element} descendant Sprite or stage
	 * @param {boolean=} opt_stopRotation Whether to stop rotation
	 */
	localize(descendant, opt_stopRotation) {
		this._localizeOption = [descendant, opt_stopRotation];
	}

	/**~ja
	 * 指定したスプライトを固定して表示する（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Display specified sprite as fixed (used only in the library)
	 * @private
	 */
	_localize() {
		if (this._localizeOption) {
			const [descendant, opt_stopRotation] = this._localizeOption;
			const off = this._getPositionOnParent(descendant, 0, 0, 0, opt_stopRotation);
			this._localizedOffset[0] = -off[0];
			this._localizedOffset[1] = -off[1];
			this._localizedOffset[2] = -off[2];
		} else {
			this._localizedOffset[0] = 0;
			this._localizedOffset[1] = 0;
			this._localizedOffset[2] = 0;
		}
	}

	/**~ja
	 * このステージの原点の紙での場所を返す
	 * @param {Element} descendant スプライトかステージ
	 * @return {number[]} 場所
	 */
	/**~en
	 * Returns the position in the paper of this stage's origin
	 * @param {Element} descendant Sprite or child stage of this stage
	 * @return {number[]} Position
	 */
	getPositionOnContext(descendant) {
		let [x, y] = this._getPositionOnParent(descendant, 0, 0, 0);
		x += this._localizedOffset[0];
		y += this._localizedOffset[1];

		const r = this._localizedOffset[2] * Math.PI / 180;
		const sin = Math.sin(r);
		const cos = Math.cos(r);
		const nx = (x * cos - y * sin);
		const ny = (x * sin + y * cos);
		return [nx, ny];
	}

	/**~ja
	 * 持っているスプライトと子ステージを全てかく
	 * @param {Paper|CanvasRenderingContext2D} ctx 紙／キャンバス・コンテキスト
	 * @param {Array=} args_array その他の引数の配列
	 */
	/**~en
	 * Draw all sprites and child stages this stage has
	 * @param {Paper|CanvasRenderingContext2D} ctx Paper or canvas context
	 * @param {Array=} args_array Array of other arguments
	 */
	draw(ctx, args_array = []) {
		ctx.save();

		this._localize();
		ctx.rotate(this._localizedOffset[2] * Math.PI / 180);
		ctx.translate(this._localizedOffset[0], this._localizedOffset[1]);
		this._setTransformation(ctx);

		for (const c of this._children) {
			//~ja スプライトのdraw関数を呼び出す
			//~en Call the sprite's draw function
			c.draw(ctx, args_array);
		}
		ctx.restore();
	}

	/**~ja
	 * 時間に合わせて持っているスプライトと子ステージを全て更新する
	 * @param {number=} deltaTime 時間差（前回のフレームからの時間経過）[ms]
	 */
	/**~en
	 * Update all sprites and child stages this stage has according to the time
	 * @param {number=} deltaTime Delta time [ms]
	 */
	update(deltaTime = 1) {
		for (const c of this._children) {
			//~ja スプライトの_update関数を呼び出す
			//~en Call the sprite's _update function
			c._update(deltaTime);
		}
		this._update(deltaTime);
		this._checkCollision();
	}

	/**~ja
	 * ある要素の原点の紙での場所を返す（ライブラリ内だけで使用）
	 * @private
	 * @param {Element} elm スプライトか子ステージ
	 * @param {number} cx 横位置
	 * @param {number} cy たて位置
	 * @param {number} ca 角度
	 * @param {boolean=} opt_stopRotation 回転を止めるか
	 * @return {number[]} 場所
	 */
	/**~en
	 * Return the position in the paper of the origin of an element (used only in the library)
	 * @private
	 * @param {Element} elm Sprite or child stage
	 * @param {number} cx Position x
	 * @param {number} cy Position y
	 * @param {number} ca Angle
	 * @param {boolean=} opt_stopRotation Whether to stop rotation
	 * @return {number[]} Position
	 */
	_getPositionOnParent(elm, cx, cy, ca, opt_stopRotation) {
		const a = (opt_stopRotation ? elm._angle : 0) + (elm._isFixedHeading ? 0 : elm._dir);
		const r = a * Math.PI / 180;
		const sin = Math.sin(r);
		const cos = Math.cos(r);
		let sx, sy;
		if (elm._scale instanceof Array) {
			[sx, sy] = elm._scale;
		} else {
			sx = sy = elm._scale;
		}
		const x = sx * (cx * cos - cy * sin);
		const y = sy * (cx * sin + cy * cos);
		if (elm._parent === null) return [x + elm._x, y + elm._y, a + ca];
		return this._getPositionOnParent(elm._parent, x + elm._x, y + elm._y, a + ca);
	}

	/**~ja
	 * 持っているスプライトが衝突しているかどうかをチェックする（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Check if the sprites are colliding (used only in the library)
	 * @private
	 */
	_checkCollision() {
		for (let i = 0; i < this._children.length; i += 1) {
			const c0 = this._children[i];
			const r0 = c0._collisionRadius;
			const x0 = c0._x;
			const y0 = c0._y;

			for (let j = i + 1; j < this._children.length; j += 1) {
				const c1 = this._children[j];
				if (!c0._onCollision && !c1._onCollision) continue;

				const r1 = c1._collisionRadius;
				const x1 = c1._x;
				const y1 = c1._y;
				const d2 = (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
				const e2 = (r0 + r1) * (r0 + r1);
				if (d2 <= e2) {
					if (c0._onCollision) c0._onCollision(c0, c1);
					if (c1._onCollision) c1._onCollision(c1, c0);
				}
			}
		}
	}

	/**~ja
	 * 観察者（オブザーバー）を加える
	 * @param {*} observer 観察者（オブザーバー）
	 */
	/**~en
	 * Add an observer
	 * @param {*} observer Observer
	 */
	addObserver(observer) {
		if (!this._observers) {
			this._observers = [];
		}
		this._observers.push(observer);
	}

}