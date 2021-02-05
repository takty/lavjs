/**~ja
 * 密度マップ
 * @version 2021-02-05
 */
/**~en
 * Density Map
 * @version 2021-02-05
 */
class DensityMap {

	/**~ja
	 * 密度マップを作る
	 * @constructor
	 * @param {number} width 横の大きさ
	 * @param {number} height たての大きさ
	 * @param {number} gridSize マス目の大きさ
	 */
	/**~en
	 * Make a density map
	 * @constructor
	 * @param {number} width width
	 * @param {number} height height
	 * @param {number} gridSize grid size
	 */
	constructor(width, height, gridSize) {
		this._width    = width;
		this._height   = height;
		this._gridSize = gridSize;

		const dw = width  / gridSize;
		const dh = height / gridSize;
		this._gw = (0 | dw) < dw ? (0 | dw) + 1 : (0 | dw);
		this._gh = (0 | dh) < dh ? (0 | dh) + 1 : (0 | dh);

		this._map = this._makeMap();
	}

	/**~ja
	 * マップを作る（ライブラリ内だけで使用）
	 * @private
	 * @return {number[][]} マップ
	 */
	/**~en
	 * Make a map (used only in the library)
	 * @private
	 * @return {number[][]} Map
	 */
	_makeMap() {
		const m = new Array(this._gh);
		for (let y = 0; y < this._gh; y += 1) m[y] = new Array(this._gw).fill(0);
		return m;
	}

	/**~ja
	 * ステージに合わせてマップを更新する
	 * @param {Stage} stage ステージ
	 */
	/**~en
	 * Update the map according to the stage
	 * @param {Stage} stage Stage
	 */
	update(stage) {
		const m = this._map;
		const gs = this._gridSize;
		stage.forEach((e) => {
			const x = Math.min(Math.max(e.x(), 0), this._width  - 1);
			const y = Math.min(Math.max(e.y(), 0), this._height - 1);
			const dx = 0 | (x / gs);
			const dy = 0 | (y / gs);
			m[dy][dx] += 1;

			const pDx = e._prevDx;
			const pDy = e._prevDy;
			if (pDx !== undefined && pDy !== undefined) m[pDy][pDx] -= 1;
			e._prevDx = dx;
			e._prevDy = dy;
		}, this);
	}

	/**~ja
	 * 密度を求める
	 * @param {number} x x座標
	 * @param {number} y y座標
	 * @param {number} [deg=0] 方向
	 * @param {number} [len=0] 長さ
	 * @return 密度
	 */
	/**~en
	 * Get a density
	 * @param {number} x X coordinate
	 * @param {number} y Y coordinate
	 * @param {number} [deg=0] Direction
	 * @param {number} [len=0] Length
	 * @return Density
	 */
	getDensity(x, y, deg = 0, len = 0) {
		if (len === 0) {
			return this._getDensity(x, y);
		}
		[x, y] = this._checkCoordinate(x, y);
		const r = (deg - 90) * Math.PI / 180;
		const sin = Math.sin(r);
		const cos = Math.cos(r);
		const step = 0 | (len * 2 / this._gridSize);
		let sum = 0;
		for (let i = 1; i <= step; i += 1) {
			const r = i * this._gridSize / 2;
			const xx = x + r * cos;
			const yy = y + r * sin;
			sum += this._getDensity(xx, yy);
		}
		return sum;
	}

	/**~ja
	 * 1点の密度を求める（ライブラリ内だけで使用）
	 * @param {number} x x座標
	 * @param {number} y y座標
	 * @return 密度
	 */
	/**~en
	 * Get a density of one point (used only in the library)
	 * @param {number} x X coordinate
	 * @param {number} y Y coordinate
	 * @return Density
	 */
	_getDensity(x, y) {
		[x, y] = this._checkCoordinate(x, y);
		const gs = this._gridSize;
		const dx = 0 | (x / gs);
		const dy = 0 | (y / gs);
		return this._map[dy][dx];
	}

	/**~ja
	 * 座標の範囲を調べて正しい範囲の座標を返す（ライブラリ内だけで使用）
	 * @param {number} x x座標
	 * @param {number} y y座標
	 * @return 座標
	 */
	/**~en
	 * Check the range of coordinates and return the correct range of coordinates (used only in the library)
	 * @param {number} x X coordinate
	 * @param {number} y Y coordinate
	 * @return Coordinate
	 */
	_checkCoordinate(x, y) {
		if (x < 0) x += this._width;
		if (y < 0) y += this._height;
		if (this._width  <= x) x -= this._width;
		if (this._height <= y) y -= this._height;
		x = Math.min(Math.max(x, 0), this._width  - 1);
		y = Math.min(Math.max(y, 0), this._height - 1);
		return [x, y];
	}

	/**~ja
	 * 密度マップをかく
	 * @param {Paper|CanvasRenderingContext2D} ctx 紙／キャンバス・コンテキスト
	 * @param {number} max 最大値
	 */
	/**~en
	 * Draw the density map
	 * @param {Paper|CanvasRenderingContext2D} ctx Paper or canvas context
	 * @param {number} max Maximum value
	 */
	draw(ctx, max) {
		const gs = this._gridSize;
		for (let y = 0; y < this._gh; y += 1) {
			for (let x = 0; x < this._gw; x += 1) {
				const d = this._map[y][x];
				ctx.styleFill().alpha(CALC.map(d, 0, max, 0, 1));
				ctx.beginPath();
				ctx.rect(x * gs, y * gs, gs, gs);
				ctx.styleFill().draw();
			}
		}
	}

}