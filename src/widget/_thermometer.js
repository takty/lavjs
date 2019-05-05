// -------------------------------------------------------------------------
// 温度計（WIDGET.Thermometer)
// -------------------------------------------------------------------------




// 温度計（最小温度、最大温度、現在の温度）
class Thermometer extends SliderBase {

	constructor(min = -10, max = 50, value = 25, { width = 72, height = 400 } = {}) {
		super(width, height);

		this.VMARGIN = 10;
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
		// 以下はbaseに追加した後に行うこと（offsetWidth/Heightは追加後でないと取得できない）
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

	_valueChanged() {
		this._output.value = this._value + '℃';
		this._draw(this._scale, this.VMARGIN);
	}

	_getKnobPos(e) {
		const r = this._scale.getBoundingClientRect();
		const p = e.clientY - this.VMARGIN - r.top;  // クライアント座標系から計算する必要あり！
		return Math.min(Math.max(0, p), this._railHeight);
	}

	_mouseDown(e) {
		this.value(this._posToValue(this._getKnobPos(e)));
		this._dragging = true;
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
		this._scale.style.cursor = 'auto';
	}

	_draw(canvas, verticalMargin) {
		this._drawScale(canvas, verticalMargin, 16);
		this._drawRail(canvas, 10, verticalMargin);
		this._drawFiller(canvas, 10, verticalMargin);
	}

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