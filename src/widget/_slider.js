/**~ja
 * スライダー
 * @author Takuto Yanagida
 * @version 2019-05-14
 */
/**~en
 * Slider
 * @author Takuto Yanagida
 * @version 2019-05-14
 */
class Slider extends SliderBase {

	/**~ja
	 * スライダーを作る
	 * @param {number} [min=0] 最小値
	 * @param {number} [max=10] 最大値
	 * @param {number} [value=0] 現在の値
	 * @param {*} [{ int = false, reverse = false, width = 72, height = 400 }={}] オプション（整数にする？、向きを逆にする？）
	 */
	/**~en
	 * Make a slider
	 * @param {number} [min=0] Minimum value
	 * @param {number} [max=10] Maximum value
	 * @param {number} [value=0] Current value
	 * @param {*} [{ int = false, reverse = false, width = 72, height = 400 }={}] Options (Whether to integer, whether to reverse)
	 */
	constructor(min = 0, max = 10, value = 0, { int = false, reverse = false, width = 72, height = 400 } = {}) {
		super(width, height);

		this.VMARGIN = 10;
		this._min = min;
		this._max = max;
		this._int = int;
		this._reverse = reverse;

		const inner = document.createElement('div');
		inner.className = '__widget-full';
		this._base.appendChild(inner);

		this._scale = document.createElement('canvas');
		this._scale.className = '__widget __widget-full';
		inner.appendChild(this._scale);
		//~ja 以下はbaseに追加した後に行うこと（offsetWidth/Heightは追加後でないと取得できない）
		//~en Do the following after adding to base (offsetWidth/Height can not be acquired without adding)
		this._scale.setAttribute('width', this._scale.offsetWidth);
		this._scale.setAttribute('height', this._scale.offsetHeight);

		this._knob = document.createElement('div');
		this._knob.className = '__widget __widget-slider-knob';
		this._knob.style.left = (inner.offsetWidth / 2) + 'px';
		this._knob.style.top = this.VMARGIN + 'px';
		inner.appendChild(this._knob);

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
		this._knob.style.top = this.VMARGIN + this._valueToPos(this._value) + 'px';
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
		this._knob.style.cursor = '-webkit-grabbing';
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
		this._knob.style.cursor = '-webkit-grab';
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
		this._drawScale(canvas, verticalMargin);
		this._drawRail(canvas, 6, verticalMargin);
	}

}