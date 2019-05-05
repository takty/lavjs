// -------------------------------------------------------------------------
// スライダー・ベース
// -------------------------------------------------------------------------




class SliderBase extends Widget {

	min(val) {
		if (val === undefined) return this._min;
		this._min = val;
		this._draw(this._scale, this.VMARGIN);
		this.value(this._value);
		return this;
	}

	max(val) {
		if (val === undefined) return this._max;
		this._max = val;
		this._draw(this._scale, this.VMARGIN);
		this.value(this._value);
		return this;
	}

	value(val) {
		if (val === undefined) return this._value;
		val = (val < this._min) ? this._min : ((this._max < val) ? this._max : val);
		this._value = (this._int) ? Math.round(val) : val;
		if (this._onChanged) this._onChanged(this._value);
		this._valueChanged();
		return this;
	}

	// チェンジ・イベントに対応する関数をセットする
	onChanged(handler) {
		if (handler === undefined) return this._onChanged;
		this._onChanged = handler;
		return this;
	}

	_valueToPos(v, reverse = this._reverse) {
		v = (this._int) ? Math.round(v) : v;
		if (reverse) {
			return (this._railHeight - (v - this._min) * this._railHeight / (this._max - this._min));
		}
		return ((v - this._min) * this._railHeight / (this._max - this._min));
	}

	_posToValue(p, reverse = this._reverse) {
		let v = this._min;
		if (reverse) {
			v += (this._railHeight - p) * (this._max - this._min) / this._railHeight;
		} else {
			v += p * (this._max - this._min) / this._railHeight;
		}
		return (this._int) ? Math.round(v) : v;
	}

	_drawRail(canvas, width, verticalMargin) {
		const c = canvas.getContext('2d');
		const x = (canvas.width - width) / 2;
		const grad = c.createLinearGradient(x, 0, x + width, 0);
		const cs = '#dadada, #eee, #eee, #fff, #fafafa, #e0e0e0'.split(', ');
		for (let i = 0; i < 6; i += 1) {
			grad.addColorStop(i / 5, cs[i]);
		}
		c.save();
		c.fillStyle = grad;
		c.fillRect(x, verticalMargin + 1, width, canvas.height - verticalMargin * 2 - 2);
		c.restore();
	}

	_drawScale(canvas, verticalMargin, subWidth = 12) {
		const maxInterval = this._calcMaxRange(this._min, this._max, 25);
		const interval = this._calcInterval(maxInterval, 25);
		const minInterval = this._calcInterval(interval, 5);
		const width = canvas.width, subX = (width - subWidth) / 2;
		const c = canvas.getContext('2d');
		c.clearRect(0, 0, canvas.width, canvas.height);
		c.lineWidth = 0.8;
		c.textAlign = 'right';
		c.font = '10px sans-serif';

		for (let m = this._min; m <= this._max; m += 1) {
			const y = this._valueToPos(m) + verticalMargin;
			if (m % interval === 0) {
				c.beginPath();
				c.moveTo(0, y);
				c.lineTo(width, y);
				c.stroke();
				c.fillText(m - (m % interval) + '', width, y - 3);
			} else if (m % minInterval === 0) {
				c.beginPath();
				c.moveTo(subX, y);
				c.lineTo(subX + subWidth, y);
				c.stroke();
			}
		}
	}

	_calcMaxRange(min, max, minInt) {
		const is = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000];
		const len = Math.max(Math.abs(min), Math.abs(max));
		let minM = len, ret = 0;
		for (let i = is.length - 1; 0 <= i; i -= 1) {
			const m = len % is[i];
			if (m < minM && minInt < this._calcOneInt(is[i])) {
				ret = is[i];
				minM = m;
			}
		}
		return (0 | (len / ret)) * ret;
	}

	_calcInterval(baseInt, minInt) {
		const is = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000];
		let ret = baseInt;
		for (let i = is.length - 1; 0 <= i; i -= 1) {
			if (baseInt % is[i] !== 0) continue;
			if (minInt < this._calcOneInt(is[i])) {
				ret = is[i];
			}
		}
		if (ret !== baseInt) return ret;
		let minM = baseInt;
		for (let i = is.length - 1; 0 <= i; i -= 1) {
			const m = baseInt % is[i];
			if (m < minM && minInt < this._calcOneInt(is[i])) {
				ret = is[i];
				minM = m;
			}
		}
		return ret;
	}

	_calcOneInt(val) {
		const y1 = this._valueToPos(val, false), y2 = this._valueToPos(val * 2, false);
		return Math.abs(y2 - y1);
	}

}