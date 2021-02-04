/**~ja
 * 温度計
 * @author Takuto Yanagida
 * @version 2021-02-04
 */
/**~en
 * Thermometer
 * @author Takuto Yanagida
 * @version 2021-02-04
 */
class Thermometer extends SliderBase {

	/**~ja
	 * 温度計を作る
	 * @param {number=} [min=-10] 最小温度
	 * @param {number=} [max=50] 最大温度
	 * @param {number=} [value=25] 現在の温度
	 * @param {dict} [{ width = 72, height = 400 }={}]　オプション
	 */
	/**~en
	 * Make a thermometer
	 * @param {number=} [min=-10] Minimum temperature
	 * @param {number=} [max=50] Maximum temperature
	 * @param {number=} [value=25] Current temperature
	 * @param {dict} [{ width = 72, height = 400 }={}] Options
	 */
	constructor(min = -10, max = 50, value = 25, { width = 72, height = 400 } = {}) {
		super(width, height, { int: true, reverse: true });

		this._min = 0 | min;
		this._max = 0 | max;

		this._base.style.flexDirection = 'column';
		this._inner.style.height = 'calc(100% - 30px)';

		this._scale = document.createElement('canvas');
		this._scale.className = 'lavjs-widget lavjs-widget-full';
		this._inner.appendChild(this._scale);
		//~ja 以下はbaseに追加した後に行うこと（offsetWidth/Heightは追加後でないと取得できない）
		//~en Do the following after adding to base (offsetWidth/Height can not be acquired without adding)
		this._scale.setAttribute('width', this._scale.offsetWidth);
		this._scale.setAttribute('height', this._scale.offsetHeight);

		this._railSize = this._scale.height - this._margin * 2;
		this._dragging = false;

		this._inner.addEventListener('mousedown', this._handleMouseDownEvent.bind(this));
		this._inner.addEventListener('mousemove', this._handleMouseMoveEvent.bind(this));
		document.addEventListener('mousemove', this._handleMouseMoveEvent.bind(this));
		document.addEventListener('mouseup', this._handleMouseUpEvent.bind(this));
		this._output.addEventListener('keydown', this._handleKeyDownEvent.bind(this));

		this._draw();
		this.value(value);
	}

	/**~ja
	 * 値が変更されたときに呼び出される（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Called when the value has changed (used only in the library)
	 * @private
	 */
	_valueChanged() {
		this._output.value = this._value + '℃';
		this._draw();
	}

	/**~ja
	 * つまみの場所を求める（ライブラリ内だけで使用）
	 * @private
	 * @param {MouseEvent} e マウス・イベント
	 * @return {number} 場所
	 */
	/**~en
	 * Get the position of the knob (used only in the library)
	 * @private
	 * @param {MouseEvent} e Mouse event
	 * @return {number} Position
	 */
	_getKnobPos(e) {
		const r = this._scale.getBoundingClientRect();
		//~ja クライアント座標系から計算する必要あり！
		//~en Need to calculate from client coordinate system!
		const p = e.clientY - this._margin - r.top;
		return Math.min(Math.max(0, p), this._railSize);
	}

	/**~ja
	 * マウス・ダウン（ボタンが押された）イベントに対応する（ライブラリ内だけで使用）
	 * @private
	 * @param {MouseEvent} e マウス・イベント
	 */
	/**~en
	 * Handle mouse down events (used only in the library)
	 * @private
	 * @param {MouseEvent} e Mouse event
	 */
	_handleMouseDownEvent(e) {
		if (e.button !== 0) return;
		this.value(this._posToValue(this._getKnobPos(e)));
		this._dragging = true;
		this._scale.style.cursor = '-webkit-grabbing';
		e.preventDefault();
	}

	/**~ja
	 * マウス・ムーブ（ポインターが移動した）イベントに対応する（ライブラリ内だけで使用）
	 * @private
	 * @param {MouseEvent} e マウス・イベント
	 */
	/**~en
	 * Handle mouse move events (used only in the library)
	 * @private
	 * @param {MouseEvent} e Mouse event
	 */
	_handleMouseMoveEvent(e) {
		if (e.button !== 0) return;
		if (!this._dragging) return;
		this.value(this._posToValue(this._getKnobPos(e)));
		e.preventDefault();
	}

	/**~ja
	 * マウス・アップ（ボタンが離された）イベントに対応する（ライブラリ内だけで使用）
	 * @private
	 * @param {MouseEvent} e マウス・イベント
	 */
	/**~en
	 * Handle mouse up events (used only in the library)
	 * @private
	 * @param {MouseEvent} e Mouse event
	 */
	_handleMouseUpEvent(e) {
		if (e.button !== 0) return;
		this._dragging = false;
		this._scale.style.cursor = 'auto';
	}


	/**~ja
	 * 絵をかく（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Draw a picture (used only in the library)
	 * @private
	 */
	_draw() {
		this._drawScale(this._scale, 16);
		this._drawRail(this._scale, 10);
		this._drawFiller(this._scale, 10);
	}

	/**~ja
	 * 中身をかく（ライブラリ内だけで使用）
	 * @private
	 * @param {Canvas} canvas キャンバス
	 * @param {number} width 幅
	 */
	/**~en
	 * Draw a filler (used only in the library)
	 * @private
	 * @param {Canvas} canvas Canvas
	 * @param {number} width Width
	 */
	_drawFiller(canvas, width) {
		const c = canvas.getContext('2d');
		const x = (canvas.width - width) / 2;
		const grad = c.createLinearGradient(x, 0, x + width, 0);
		const cs = '#f00, #f55, #faa, #e55, #e00, #da0000'.split(', ');
		for (let i = 0; i < 6; i += 1) {
			grad.addColorStop(i / 5, cs[i]);
		}
		const st = Math.max(1, this._valueToPos(this._value));
		c.save();
		c.fillStyle = grad;
		c.fillRect(x, this._margin + st, width, canvas.height - this._margin * 2 - 1 - st);
		c.restore();
	}

}