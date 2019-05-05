// -------------------------------------------------------------------------
// グラフ（WIDGET.Chart)
// -------------------------------------------------------------------------




const CHART_ITEM_COLORS = [
	'rgb(91, 155, 213)',
	'rgb(237, 125, 49)',
	'rgb(165, 165, 165)',
	'rgb(255, 192, 0)',
	'rgb(68, 114, 196)',
	'rgb(112, 173, 71)',
	'rgb(37, 94, 145)',
	'rgb(158, 72, 14)',
	'rgb(99, 99, 99)',
	'rgb(153, 115, 0)',
	'rgb(38, 68, 120)',
	'rgb(67, 104, 43)',
];

// グラフ（横幅、縦幅）
class Chart extends Widget {

	constructor(width = 300, height = 150) {
		super(width, height);

		this._can = document.createElement('canvas');
		this._can.className = '__widget __widget-full __widget-chart-inner';
		this._can.onclick = () => {
			this._allDataMode = !this._allDataMode;
			this._draw(this._legendWidth);
		};
		this._base.appendChild(this._can);
		// 以下はbaseに追加した後に行うこと（offsetWidth/Heightは追加後でないと取得できない）
		this._can.setAttribute('width', this._can.offsetWidth);
		this._can.setAttribute('height', this._can.offsetHeight);

		this._allDataMode = true;
		this._items = {};
		this._keys = [];
		this._data = {};
		this._min = 0;
		this._max = 0;

		this._legendWidth = 128;
		this._digits = 1;
	}

	setLegendWidth(px) {
		this._legendWidth = px;
	}

	setDigits(num) {
		this._digits = num;
	}

	setItems(items) {
		// items = {key1: {name: 'name1', style: 'style1'}, key2: {}, ...}
		this._items = {};
		this._keys = [];
		this._data = {};

		let ci = 0;
		for (let key in items) {
			const i = items[key];
			const name = (i !== undefined && i.name !== undefined) ? i.name : key;
			const style = (i !== undefined && i.style !== undefined) ? i.style : CHART_ITEM_COLORS[ci];
			this._keys.push(key);
			this._items[key] = { name, style };
			this._data[key] = [];

			ci += 1;
			if (CHART_ITEM_COLORS.length <= ci) ci = 0;
		}
	}

	addData(data) {
		for (let key of this._keys) {
			const v = data[key];
			this._data[key].push(v);
			if (v < this._min) this._min = v;
			if (this._max < v) this._max = v;
		}
		this._draw(this._legendWidth);
	}

	_draw(legendWidth) {
		const c = this._can.getContext('2d');
		c.clearRect(0, 0, this._can.width, this._can.height);

		this._drawLegend(c, legendWidth);
		const cx = this._can.width - legendWidth, cy = this._can.height;
		this._drawFrame(c, legendWidth, cx, cy, this._min, this._max);
		if (this._allDataMode) {
			this._drawAllDataMode(c, legendWidth, cx, cy, this._min, this._max);
		} else {
			this._drawScrollMode(c, legendWidth, cx, cy, this._min, this._max);
		}
	}

	_drawLegend(c, legendWidth) {
		c.font = '16px sans-serif';
		let y = 0;
		for (let key of this._keys) {
			const { name, style } = this._items[key];
			c.fillStyle = style;
			c.fillRect(0, y, 16, 16);

			c.fillStyle = 'Black';
			c.textAlign = 'left';
			c.fillText(name, 16 + 8, y + 14);

			const ds = this._data[key];
			const v = ds[ds.length - 1];
			c.textAlign = 'right';
			c.fillText(this._format(this._digits, v), legendWidth - 8, y + 14);

			y += 22;
		}
	}

	_format(digits, val) {
		if (digits === 0) {
			return (0 | val) + '';
		}
		const dv = Number.parseInt('1' + '0'.repeat(digits));
		const nv = (0 | val * dv) / dv;
		const sv = nv + '';
		const idx = sv.indexOf('.');
		if (idx === -1) {
			return sv + '.' + '0'.repeat(digits);
		} else {
			return sv + '0'.repeat(digits - (sv.length - idx - 1));
		}
	}

	_drawFrame(c, left, cx, cy, min, max) {
		c.strokeStyle = 'Black';
		c.beginPath();
		c.moveTo(left, 0);
		c.lineTo(left, cy);
		c.lineTo(left + cx, cy);
		c.stroke();
		if (this._min !== 0 || this._max !== 0) {
			const y = (max - 0) / (max - min) * cy;
			c.beginPath();
			c.moveTo(left, y);
			c.lineTo(left + cx, y);
			c.stroke();
		}
	}

	_drawAllDataMode(c, left, cx, cy, min, max) {
		for (let key of this._keys) {
			const ds = this._data[key];
			const len = ds.length;
			if (len === 0) continue;

			c.strokeStyle = this._items[key].style;
			c.beginPath();
			c.moveTo(left, cy - ds[0] * cy / max);

			let prevX = 0, prevY = 0;
			for (let i = 1, I = ds.length; i < I; i += 1) {
				const x = left + cx / len * i;
				const dx = x - prevX;
				if (0.5 < dx) {
					const y = (max - ds[i]) / (max - min) * cy;
					if (1.0 < dx || cy * 0.5 < Math.abs(y - prevY)) {
						c.lineTo(x, y);
						prevX = x;
						prevY = y;
					}
				}
			}
			c.stroke();
		}
	}

	_drawScrollMode(c, left, cx, cy, min, max) {
		for (let key of this._keys) {
			const ds = this._data[key];
			let len = ds.length;
			if (len === 0) continue;
			const st = Math.max(0, len - cx);
			len -= st;

			c.strokeStyle = this._items[key].style;
			c.beginPath();
			c.moveTo(left, cy - ds[st] * cy / max);

			for (let i = st + 1, I = ds.length; i < I; i += 1) {
				const x = left + (i - st);
				const y = (max - ds[i]) / (max - min) * cy;
				c.lineTo(x, y);
			}
			c.stroke();
		}
	}

}