/**~ja
 * スライダー・ベース
 * @author Takuto Yanagida
 * @version 2021-05-21
 */
/**~en
 * Slider base
 * @author Takuto Yanagida
 * @version 2021-05-21
 */
class SliderBase extends Widget {

	/**~ja
	 * スライダー・ベースを作る
	 * @constructor
	 * @param {number=} [width=null] 横幅
	 * @param {number=} [height=null] たて幅
	 * @param {object} [opts={}] オプション
	 * @param {boolean=} [opts.int=false] 整数にする？
	 * @param {boolean=} [opts.reverse=false] 向きを逆にする？
	 * @param {boolean=} [opts.vertical=true] たて向きにする？
	 */
	/**~en
	 * Make a slider base
	 * @constructor
	 * @param {number=} [width=null] Width
	 * @param {number=} [height=null] Height
	 * @param {object} [opts={}] Options
	 * @param {boolean=} [opts.int=false] Whether to be integer
	 * @param {boolean=} [opts.reverse=false] Whether to reverse
	 * @param {boolean=} [opts.vertical=true] Whether to be vertical
	 */
	constructor(width = null, height = null, opts = {}) {
		const { int = false, reverse = false, vertical = true } = opts;
		super(width, height);
		this._int      = int;
		this._reverse  = reverse;
		this._vertical = vertical;

		this._value = 0;
		this._min   = 0;
		this._max   = 0;

		this._margin      = 14;
		this._railSize    = 0;
		this._railPosRate = this._vertical ? 0.5 : 0.45;

		this._output = document.createElement('input');
		this._output.className = 'lavjs-widget-slider-output';
		this._output.type = 'text';
		this._output.readOnly = true;
		this._base.appendChild(this._output);

		this._inner = document.createElement('div');
		this._inner.className = 'lavjs-widget-full';
		this._base.appendChild(this._inner);
	}

	/**~ja
	 * 最小値
	 * @param {number=} val 最小値
	 * @return {number|SliderBase} 最小値／このスライダー・ベース
	 */
	/**~en
	 * Minimum value
	 * @param {number=} val Minimum value
	 * @return Minimum value, or this slider base
	 */
	min(val) {
		if (val === undefined) return this._min;
		this._min = val;
		this._draw();
		this.value(this._value);
		return this;
	}

	/**~ja
	 * 最大値
	 * @param {number=} val
	 * @return {number|SliderBase} 最大値／このスライダー・ベース
	 */
	/**~en
	 * Maximum value
	 * @param {number=} val Maximum value
	 * @return Maximum value, or this slider base
	 */
	max(val) {
		if (val === undefined) return this._max;
		this._max = val;
		this._draw();
		this.value(this._value);
		return this;
	}

	/**~ja
	 * 現在の値
	 * @param {number=} val 現在の値
	 * @return {number|SliderBase} 現在の値／このスライダー・ベース
	 */
	/**~en
	 * Current value
	 * @param {number=} val Current value
	 * @return {number|SliderBase} Current value, or this slider base
	 */
	value(val) {
		if (val === undefined) return this._value;
		val = (val < this._min) ? this._min : ((this._max < val) ? this._max : val);
		this._value = (this._int) ? Math.round(val) : val;
		if (this._onChange) this._onChange(this._value);
		this._valueChanged();
		return this;
	}

	/**~ja
	 * 現在値欄でのキー・ダウン（キーが押された）イベントに対応する（ライブラリ内だけで使用）
	 * @protected
	 * @param {KeyboardEvent} e キーボード・イベント
	 */
	/**~en
	 * Handle key down events in the current value field (used only in the library)
	 * @protected
	 * @param {KeyboardEvent} e Keyboard event
	 */
	_handleKeyDownEvent(e) {
		e.preventDefault();
		const v = this.value();
		if (e.code === 'ArrowDown' || e.code === 'ArrowLeft') {
			const vi = Math.floor(v);
			if (vi === v) this.value(v - 1);
			else this.value(vi);
		} else if (e.code === 'ArrowUp' || e.code === 'ArrowRight') {
			const vi = Math.ceil(v);
			if (vi === v) this.value(v + 1);
			else this.value(vi);
		}
	}

	/**~ja
	 * チェンジ・イベントに対応する関数
	 * @param {function(number):void=} handler 関数
	 * @return {function(number):void|SliderBase} 関数／このスライダー・ベース
	 */
	/**~en
	 * Function handling to change events
	 * @param {function(number):void=} handler Function
	 * @return {function(number):void|SliderBase} Function, or this slider base
	 */
	onChange(handler) {
		if (handler === undefined) return this._onChange;
		this._onChange = handler;
		return this;
	}

	/**~ja
	 * 現在の値からつまみの場所を計算する（ライブラリ内だけで使用）
	 * @protected
	 * @param {number} v 現在の値
	 * @return {number} 場所
	 */
	/**~en
	 * Calculate the position of the knob from the current value (used only in the library)
	 * @protected
	 * @param {number} v Current value
	 * @return {number} Position
	 */
	_valueToPos(v) {
		v = (this._int) ? Math.round(v) : v;
		const p = (v - this._min) * this._railSize / (this._max - this._min);
		if (this._reverse) return this._railSize - p;
		return p;
	}

	/**~ja
	 * つまみの場所から現在の値を計算する（ライブラリ内だけで使用）
	 * @protected
	 * @param {number} p つまみの場所
	 * @return {number} 現在の値
	 */
	/**~en
	 * Calculate current value from knob position (used only in the library)
	 * @protected
	 * @param {number} p Position
	 * @return {number} Current value
	 */
	_posToValue(p) {
		if (this._reverse) p = this._railSize - p;
		const v = this._min + p * (this._max - this._min) / this._railSize;
		return (this._int) ? Math.round(v) : v;
	}


	// -------------------------------------------------------------------------


	/**~ja
	 * みぞの絵をかく（ライブラリ内だけで使用）
	 * @protected
	 * @param {HTMLCanvasElement} canvas キャンバス
	 * @param {number} width 幅
	 */
	/**~en
	 * Draw a rail (used only in the library)
	 * @protected
	 * @param {HTMLCanvasElement} canvas Canvas
	 * @param {number} width Width
	 */
	_drawRail(canvas, width) {
		const isv = this._vertical, m = this._margin;
		const c = canvas.getContext('2d');
		const x = (isv ? canvas.width : canvas.height) * this._railPosRate - width * 0.5;

		const ga = isv ? [x, 0, x + width, 0] : [0, x, 0, x + width];
		const grad = c.createLinearGradient(...ga);

		const cs = '#dadada, #eee, #eee, #fff, #fafafa, #e0e0e0'.split(', ');
		for (let i = 0; i < 6; i += 1) {
			grad.addColorStop(i / 5, cs[i]);
		}
		c.save();
		c.fillStyle = grad;
		const fra = isv ? [x, m + 1, width, canvas.height - m * 2 - 2] : [m + 1, x, canvas.width - m * 2 - 2, width];
		c.fillRect(...fra);
		c.restore();
	}

	/**~ja
	 * 目もりの絵をかく（ライブラリ内だけで使用）
	 * @protected
	 * @param {HTMLCanvasElement} canvas キャンバス
	 * @param {number} subWidth サブ目もりの幅
	 */
	/**~en
	 * Draw a scale (used only in the library)
	 * @protected
	 * @param {HTMLCanvasElement} canvas Canvas
	 * @param {number} subWidth Width of sub scale
	 */
	_drawScale(canvas, subWidth) {
		const isv = this._vertical;
		const maxInterval = this._calcMaxRange(this._min, this._max, 25);
		const interval = this._calcInterval(maxInterval, 25);
		const minInterval = this._calcInterval(interval, 5);
		const width = (isv ? canvas.width : canvas.height), subX = (width * this._railPosRate - subWidth * 0.5);
		const c = canvas.getContext('2d');
		c.clearRect(0, 0, canvas.width, canvas.height);
		c.textAlign = isv ? 'right' : 'center';
		c.font = '10.5px sans-serif';

		for (let m = this._min; m <= this._max; m += 1) {
			const y = this._valueToPos(m) + this._margin;
			if (m % interval === 0) {
				c.beginPath();
				if (isv) {
					c.moveTo(0, y);
					c.lineTo(width, y);
				} else {
					c.moveTo(y, 0);
					c.lineTo(y, width);
				}
				c.lineWidth = 0.8;
				c.stroke();
				const dta = isv ? [width, y - 3, 3] : [y, width - 1, 5];
				drawText(c, m - (m % interval) + '', ...dta);
			} else if (m % minInterval === 0) {
				c.beginPath();
				if (isv) {
					c.moveTo(subX, y);
					c.lineTo(subX + subWidth, y);
				} else {
					c.moveTo(y, subX);
					c.lineTo(y, subX + subWidth);
				}
				c.lineWidth = 0.8;
				c.stroke();
			}
		}
		function drawText(c, str, x, y, lineWidth) {
			c.lineWidth = lineWidth;
			c.strokeStyle = '#fff';
			c.strokeText(str, x, y);
			c.strokeStyle = '#000';
			c.fillText(str, x, y);
		}
	}

	/**~ja
	 * 最大範囲を計算する（ライブラリ内だけで使用）
	 * @private
	 * @param {number} min 最小値
	 * @param {number} max 最大値
	 * @param {number} minInt 最小の間隔
	 * @return {number} 最大範囲
	 */
	/**~en
	 * Calculate the maximum range (used only in the library)
	 * @private
	 * @param {number} min Minimum value
	 * @param {number} max Maximum value
	 * @param {number} minInt Minimum interval
	 * @return {number} Maximum range
	 */
	_calcMaxRange(min, max, minInt) {
		const is = [5000, 2500, 2000, 1000, 500, 250, 200, 100, 50, 25, 20, 10, 5, 2, 1];
		const len = Math.max(Math.abs(min), Math.abs(max));
		let minM = len, ret = 0;
		for (const i of is) {
			const m = len % i;
			if (m < minM && minInt < this._calcOneInt(i)) {
				ret = i;
				minM = m;
			}
		}
		return (0 | (len / ret)) * ret;
	}

	/**~ja
	 * 間隔を計算する（ライブラリ内だけで使用）
	 * @private
	 * @param {number} baseInt 基準の間隔
	 * @param {number} minInt 最小の間隔
	 * @return {number} 間隔
	 */
	/**~en
	 * Calculate intervals (used only in the library)
	 * @private
	 * @param {number} baseInt Base interval
	 * @param {number} minInt Minimum interval
	 * @return {number} Interval
	 */
	_calcInterval(baseInt, minInt) {
		const is = [5000, 2500, 2000, 1000, 500, 250, 200, 100, 50, 25, 20, 10, 5, 2, 1];
		let ret = baseInt;
		for (const i of is) {
			if (baseInt % i !== 0) continue;
			if (minInt < this._calcOneInt(i)) ret = i;
		}
		if (ret !== baseInt) return ret;
		let minM = baseInt;
		for (const i of is) {
			const m = baseInt % i;
			if (m < minM && minInt < this._calcOneInt(i)) {
				ret = i;
				minM = m;
			}
		}
		return ret;
	}

	/**~ja
	 * 間隔を一つ計算する（ライブラリ内だけで使用）
	 * @private
	 * @param {number} val 値
	 * @return {number} 間隔
	 */
	/**~en
	 * Calculate one interval (used only in the library)
	 * @private
	 * @param {number} val Value
	 * @return {number} Interval
	 */
	_calcOneInt(val) {
		const y1 = this._valueToPos(val), y2 = this._valueToPos(val * 2);
		return Math.abs(y2 - y1);
	}

}