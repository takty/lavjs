/**~ja
 * 温度計
 * @author Takuto Yanagida
 * @version 2019-09-06
 */
/**~en
 * Thermometer
 * @author Takuto Yanagida
 * @version 2019-09-06
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
		super(width, height);

		this._min = 0 | min;
		this._max = 0 | max;
		this._int = true;  // for SliderBase
		this._reverse = true;  // for SliderBase

		this._base.style.flexDirection = 'column';

		this._output = document.createElement('input');
		this._output.className = '__widget-thermometer-output';
		this._output.type = 'text';
		this._base.appendChild(this._output);

		const inner = document.createElement('div');
		inner.className = '__widget-full';
		inner.style.height = 'calc(100% - 30px)';
		this._base.appendChild(inner);

		this._scale = document.createElement('canvas');
		this._scale.className = '__widget __widget-full';
		inner.appendChild(this._scale);
		//~ja 以下はbaseに追加した後に行うこと（offsetWidth/Heightは追加後でないと取得できない）
		//~en Do the following after adding to base (offsetWidth/Height can not be acquired without adding)
		this._scale.setAttribute('width', this._scale.offsetWidth);
		this._scale.setAttribute('height', this._scale.offsetHeight);

		this._railHeight = this._scale.height - this.VMARGIN * 2;
		this._dragging = false;

		inner.addEventListener('mousedown', this._mouseDown.bind(this));
		inner.addEventListener('mousemove', this._mouseMove.bind(this));
		document.addEventListener('mousemove', this._mouseMove.bind(this));
		document.addEventListener('mouseup', this._mouseUp.bind(this));

		this._draw(this._scale, this.VMARGIN);
		this.value(value);
	}

	/**~ja
	 * 値が変更されたときに呼び出される
	 * @private
	 */
	/**~en
	 * Called when the value has changed
	 * @private
	 */
	_valueChanged() {
		this._output.value = this._value + '℃';
		this._draw(this._scale, this.VMARGIN);
	}

	/**~ja
	 * つまみの場所を求める
	 * @private
	 * @param {MouseEvent} e マウス・イベント
	 * @return {number} 場所
	 */
	/**~en
	 * Get the position of the knob
	 * @private
	 * @param {MouseEvent} e Mouse event
	 * @return {number} Position
	 */
	_getKnobPos(e) {
		const r = this._scale.getBoundingClientRect();
		//~ja クライアント座標系から計算する必要あり！
		//~en Need to calculate from client coordinate system!
		const p = e.clientY - this.VMARGIN - r.top;
		return Math.min(Math.max(0, p), this._railHeight);
	}

	/**~ja
	 * マウスのボタンが押されたときに呼び出される
	 * @private
	 * @param {MouseEvent} e マウス・イベント
	 */
	/**~en
	 * Called when the mouse button is pressed
	 * @private
	 * @param {MouseEvent} e Mouse event
	 */
	_mouseDown(e) {
		this.value(this._posToValue(this._getKnobPos(e)));
		this._dragging = true;
		this._scale.style.cursor = '-webkit-grabbing';
		e.preventDefault();
	}

	/**~ja
	 * マウスが移動したときに呼び出される
	 * @private
	 * @param {MouseEvent} e マウス・イベント
	 */
	/**~en
	 * Called when the mouse moves
	 * @private
	 * @param {MouseEvent} e Mouse event
	 */
	_mouseMove(e) {
		if (!this._dragging) return;
		this.value(this._posToValue(this._getKnobPos(e)));
		e.preventDefault();
	}

	/**~ja
	 * マウスのボタンが離されたときに呼び出される
	 * @private
	 * @param {MouseEvent} e マウス・イベント
	 */
	/**~en
	 * Called when the mouse button is released
	 * @private
	 * @param {MouseEvent} e Mouse event
	 */
	_mouseUp(e) {
		this._dragging = false;
		this._scale.style.cursor = 'auto';
	}

	/**~ja
	 * 絵をかく
	 * @private
	 * @param {Canvas} canvas キャンバス
	 * @param {number} verticalMargin たてのすき間
	 */
	/**~en
	 * Draw a picture
	 * @private
	 * @param {Canvas} canvas Canvas
	 * @param {number} verticalMargin Vertical margin
	 */
	_draw(canvas, verticalMargin) {
		this._drawScale(canvas, verticalMargin, 16);
		this._drawRail(canvas, 10, verticalMargin);
		this._drawFiller(canvas, 10, verticalMargin);
	}

	/**~ja
	 * 中身をかく
	 * @private
	 * @param {Canvas} canvas キャンバス
	 * @param {number} width 幅
	 * @param {number} verticalMargin たてのすき間
	 */
	/**~en
	 * Draw a filler
	 * @private
	 * @param {Canvas} canvas Canvas
	 * @param {number} width Width
	 * @param {number} verticalMargin Vertical margin
	 */
	_drawFiller(canvas, width, verticalMargin) {
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
		c.fillRect(x, verticalMargin + st, width, canvas.height - verticalMargin * 2 - 1 - st);
		c.restore();
	}

}