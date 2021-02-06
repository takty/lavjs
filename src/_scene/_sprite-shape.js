/**~ja
 * スプライト図形（ライブラリ内だけで使用）
 * @private
 * @extends {Sprite}
 * @version 2021-02-06
 */
/**~en
 * Sprite shape (used only in the library)
 * @private
 * @extends {Sprite}
 * @version 2021-02-06
 */
class SpriteShape extends Sprite {

	/**~ja
	 * スプライト図形を作る
	 * @constructor
	 * @param {Paper|CanvasRenderingContext2D} ctx 紙／キャンバス・コンテキスト
	 */
	/**~en
	 * Make a sprite shape
	 * @constructor
	 * @param {Paper|CanvasRenderingContext2D} ctx Paper or canvas context
	 */
	constructor(ctx) {
		super();
		//@ifdef ja
		if (typeof RULER === 'undefined') throw new Error('Rulerライブラリが必要です。');
		//@endif
		//@ifdef en
		if (typeof RULER === 'undefined') throw new Error('Ruler library is needed.');
		//@endif
		this._ruler = new RULER.Ruler(ctx);
	}

	/**~ja
	 * 定規
	 * @return {Ruler} 定規
	 */
	/**~en
	 * Ruler
	 * @return {Ruler} Ruler
	 */
	ruler() {
		return this._ruler;
	}

}

/**~ja
 * 円スプライト
 * @extends {Element}
 * @version 2021-02-06
 */
/**~en
 * Circle sprite
 * @extends {Element}
 * @version 2021-02-06
 */
class Circle extends SpriteShape {

	/**~ja
	 * 円形スプライトを作る
	 * @constructor
	 * @param {Paper|CanvasRenderingContext2D} ctx 紙／キャンバス・コンテキスト
	 * @param {number=} radius 半径
	 */
	/**~en
	 * Make a circle shape sprite
	 * @constructor
	 * @param {Paper|CanvasRenderingContext2D} ctx Paper or canvas context
	 * @param {number=} radius Radius
	 */
	constructor(ctx, radius = 10) {
		super(ctx);
		this._drawFunction = this._draw.bind(this);
		this._collisionRadius = radius;
		this._radius = radius;
	}

	/**~ja
	 * 円をかく（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Draw a circle (used only in the library)
	 * @private
	 */
	_draw() {
		this._ruler.circle(0, 0, this._radius);
		this._ruler.draw('fs');
	}

	/**~ja
	 * 半径
	 * @param {number=} radius 半径
	 * @return {number|Circle} 半径／このスプライト
	 */
	/**~en
	 * Radius
	 * @param {number=} radius Radius
	 * @return {number|Circle} Radius, or this sprite
	 */
	radius(val) {
		if (val === undefined) return this._radius;
		this._radius = val;
		this._collisionRadius = radius;
		return this;
	}

}

/**~ja
 * 四角形スプライト
 * @extends {Element}
 * @version 2021-02-06
 */
/**~en
 * Rectangle sprite
 * @extends {Element}
 * @version 2021-02-06
 */
class Rect extends SpriteShape {

	/**~ja
	 * 四角形スプライトを作る
	 * @constructor
	 * @param {Paper|CanvasRenderingContext2D} ctx 紙／キャンバス・コンテキスト
	 * @param {number=} width 横幅
	 * @param {number=} height たて幅
	 */
	/**~en
	 * Make a rectangle shape sprite
	 * @constructor
	 * @param {Paper|CanvasRenderingContext2D} ctx Paper or canvas context
	 * @param {number=} width Width
	 * @param {number=} height Height
	 */
	constructor(ctx, width = 20, height = 20) {
		super(ctx);
		this._drawFunction = this._draw.bind(this);
		this._collisionRadius = Math.min(width, height);
		this._width = width;
		this._height = height;
	}

	/**~ja
	 * 四角形をかく（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Draw a rectangle (used only in the library)
	 * @private
	 */
	_draw() {
		this._ruler.rect(0, 0, this._width, this._height);
		this._ruler.draw('fs');
	}

	/**~ja
	 * 横幅
	 * @param {number=} width 横幅
	 * @return {number|Rect} 横幅／このスプライト
	 */
	/**~en
	 * Width
	 * @param {number=} width Width
	 * @return {number|Rect} Width, or this sprite
	 */
	width(val) {
		if (val === undefined) return this._width;
		this._width = val;
		this._collisionRadius = Math.min(this._width, this._height);
		return this;
	}

	/**~ja
	 * たて幅
	 * @param {number=} height たて幅
	 * @return {number|Rect} たて幅／このスプライト
	 */
	/**~en
	 * Height
	 * @param {number=} height Height
	 * @return {number|Rect} Height, or this sprite
	 */
	height(val) {
		if (val === undefined) return this._height;
		this._height = val;
		this._collisionRadius = Math.min(this._width, this._height);
		return this;
	}

}