// -------------------------------------------------------------------------
// スライダー（WIDGET.Slider)
// -------------------------------------------------------------------------




// スライダー（最小値、最大値、現在の値、整数にする？、向きを逆にする？）
class Slider extends SliderBase {

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
		// 以下はbaseに追加した後に行うこと（offsetWidth/Heightは追加後でないと取得できない）
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

	_valueChanged() {
		this._knob.style.top = this.VMARGIN + this._valueToPos(this._value) + 'px';
	}

	_getKnobPos(e) {
		const r = this._scale.getBoundingClientRect();
		const p = e.clientY - this.VMARGIN - r.top;  // クライアント座標系から計算する必要あり！
		return Math.min(Math.max(0, p), this._railHeight);
	}

	_mouseDown(e) {
		this.value(this._posToValue(this._getKnobPos(e)));
		this._dragging = true;
		this._knob.style.cursor = '-webkit-grabbing';
		this._scale.style.cursor = '-webkit-grabbing';
		e.preventDefault();
	}

	_mouseMove(e) {
		if (!this._dragging) return;
		this.value(this._posToValue(this._getKnobPos(e)));
		e.preventDefault();
	}

	_mouseUp(e) {
		this._dragging = false;
		this._knob.style.cursor = '-webkit-grab';
		this._scale.style.cursor = 'auto';
	}

	_draw(canvas, verticalMargin) {
		this._drawScale(canvas, verticalMargin);
		this._drawRail(canvas, 6, verticalMargin);
	}

}