/**~ja
 * スライダー
 * @author Takuto Yanagida
 * @version 2021-05-21
 */
/**~en
 * Slider
 * @author Takuto Yanagida
 * @version 2021-05-21
 */
class Slider extends SliderBase {

	/**~ja
	 * スライダーを作る
	 * @constructor
	 * @param {number} [min=0] 最小値
	 * @param {number} [max=10] 最大値
	 * @param {number} [value=0] 現在の値
	 * @param {object} [opts={}] オプション
	 * @param {boolean=} [opts.int=false] 整数にする？
	 * @param {boolean=} [opts.reverse=false] 向きを逆にする？
	 * @param {boolean=} [opts.vertical=true] たて向きにする？
	 * @param {number=} [opts.width=null] 横幅
	 * @param {number=} [opts.height=null] たて幅
	 */
	/**~en
	 * Make a slider
	 * @constructor
	 * @param {number} [min=0] Minimum value
	 * @param {number} [max=10] Maximum value
	 * @param {number} [value=0] Current value
	 * @param {object} [opts={}] Options
	 * @param {boolean=} [opts.int=false] Whether to be integer
	 * @param {boolean=} [opts.reverse=false] Whether to reverse
	 * @param {boolean=} [opts.vertical=true] Whether to be vertical
	 * @param {number=} [opts.width=null] Width
	 * @param {number=} [opts.height=null] Height
	 */
	constructor(min = 0, max = 10, value = 0, opts = {}) {
		const { int = false, reverse = false, vertical = true } = opts;
		let { width = null, height = null } = opts;
		if (width  === null) width  = vertical ? 72 : 400;
		if (height === null) height = vertical ? 400 : 72;
		super(width, height, { int, reverse, vertical });

		this._min = min;
		this._max = max;

		if (vertical) {
			this._base.style.flexDirection = 'column';
			this._inner.style.height = 'calc(100% - 30px)';
		} else {
			this._output.style.width = '56px';
			this._inner.style.width = 'calc(100% - 56px)';
		}

		this._scale = document.createElement('canvas');
		this._scale.className = 'lavjs-widget lavjs-widget-full';
		this._inner.appendChild(this._scale);
		//~ja 以下はbaseに追加した後に行うこと（offsetWidth/Heightは追加後でないと取得できない）
		//~en Do the following after adding to base (offsetWidth/Height can not be acquired without adding)
		this._scale.setAttribute('width', '' + this._scale.offsetWidth);
		this._scale.setAttribute('height', '' + this._scale.offsetHeight);

		this._railSize = (this._vertical ? this._scale.height : this._scale.width) - this._margin * 2;
		this._dragging = false;

		this._inner.addEventListener('mousedown', this._handleMouseDownEvent.bind(this));
		this._inner.addEventListener('mousemove', this._handleMouseMoveEvent.bind(this));
		document.addEventListener('mousemove', this._handleMouseMoveEvent.bind(this));
		document.addEventListener('mouseup', this._handleMouseUpEvent.bind(this));
		this._output.addEventListener('keydown', this._handleKeyDownEvent.bind(this));

		this._knob = document.createElement('div');
		this._knob.className = 'lavjs-widget lavjs-widget-slider-knob';
		if (this._vertical) {
			this._knob.style.left = (this._inner.offsetWidth * this._railPosRate) + 'px';
			this._knob.style.top = this._margin + 'px';
		} else {
			this._knob.style.top = (this._inner.offsetHeight * this._railPosRate) + 'px';
			this._knob.style.left = this._margin + 'px';
		}
		this._inner.appendChild(this._knob);

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
		this._output.value = '' + (Math.round(this._value * 100) / 100);
		if (this._vertical) {
			this._knob.style.top = this._margin + this._valueToPos(this._value) + 'px';
		} else {
			this._knob.style.left = this._margin + this._valueToPos(this._value) + 'px';
		}
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
		let p;
		if (this._vertical) {
			p = e.clientY - this._margin - r.top;
		} else {
			p = e.clientX - this._margin - r.left;
		}
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
		this._knob.style.cursor = '-webkit-grabbing';
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
		this._knob.style.cursor = '-webkit-grab';
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
		this._drawScale(this._scale, 12);
		this._drawRail(this._scale, 6);
	}

}