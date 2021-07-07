/**~ja
 * グラフ
 * @author Takuto Yanagida
 * @version 2021-05-21
 */
/**~en
 * Chart
 * @author Takuto Yanagida
 * @version 2021-05-21
 */
class Chart extends Widget {

	/**~ja
	 * グラフを作る
	 * @constructor
	 * @param {number} [width=300] 横幅
	 * @param {number} [height=150] たて幅
	 */
	/**~en
	 * Make a chart
	 * @constructor
	 * @param {number} [width=300] Width
	 * @param {number} [height=150] Height
	 */
	constructor(width = 300, height = 150) {
		super(width, height);

		this._can = document.createElement('canvas');
		this._can.className = 'lavjs-widget lavjs-widget-full lavjs-widget-chart-inner';
		this._can.addEventListener('click', this._handleClickEvent.bind(this));
		this._base.appendChild(this._can);
		//~ja 以下はbaseに追加した後に行うこと（offsetWidth/Heightは追加後でないと取得できない）
		//~en Do the following after adding to base (offsetWidth/Height can not be acquired without adding)
		this._can.setAttribute('width', '' + this._can.offsetWidth);
		this._can.setAttribute('height', '' + this._can.offsetHeight);

		this._allDataMode  = true;
		this._items        = {};
		this._keys         = [];
		this._selectedKeys = [];
		this._data         = {};
		this._mins         = {};
		this._maxes        = {};

		this._legendWidth = 128;
		this._digits      = 1;
	}

	/**~ja
	 * クリック・イベントに対応する（ライブラリ内だけで使用）
	 * @private
	 * @param {MouseEvent} e マウス・イベント
	 */
	/**~en
	 * Handle mouse click events (used only in the library)
	 * @private
	 * @param {MouseEvent} e Mouse event
	 */
	_handleClickEvent(e) {
		if (e.button !== 0) return;
		if (this._legendWidth < e.offsetX) {
			this._allDataMode = !this._allDataMode;
		} else {
			if (16 < e.offsetY % 20) return;
			const idx = 0 | (e.offsetY / 20);
			if (idx < 0 || this._keys.length - 1 < idx) return;
			const cur = this._keys[idx];
			const sks = Object.fromEntries(this._selectedKeys.map(e => [e, true]));
			sks[cur] = sks[cur] ? false : true;
			this._selectedKeys.length = 0;
			for (const k of this._keys) {
				if (sks[k]) this._selectedKeys.push(k);
			}
		}
		this._draw(this._legendWidth);
	}

	/**~ja
	 * 凡例の幅をセットする
	 * @param {number} px 幅
	 */
	/**~en
	 * Set the width of legend
	 * @param {number} px Width
	 */
	setLegendWidth(px) {
		this._legendWidth = px;
	}

	/**~ja
	 * 桁数をセットする
	 * @param {number} num 桁数
	 */
	/**~en
	 * Set digits
	 * @param {number} num Digits
	 */
	setDigits(num) {
		this._digits = num;
	}

	/**~ja
	 * 項目の設定をセットする
	 * @param {dict} items 項目の設定
	 */
	/**~en
	 * Set item configurations
	 * @param {dict} items Item configuration
	 */
	setItems(items) {
		// items = {key1: {name: 'name1', style: 'style1'}, key2: {}, ...}
		this._items = {};
		this._keys  = [];
		this._data  = {};
		this._mins  = {};
		this._maxes = {};

		let ci = 0;
		for (const key in items) {
			const i = items[key];
			const name  = (i !== undefined && i.name  !== undefined) ? i.name  : key;
			const style = (i !== undefined && i.style !== undefined) ? i.style : Chart.ITEM_COLORS[ci];
			this._keys.push(key);
			this._items[key] = { name, style };
			this._data[key]  = [];
			this._mins[key]  = 0;
			this._maxes[key] = 0;

			ci += 1;
			if (Chart.ITEM_COLORS.length <= ci) ci = 0;
		}
		const count = Object.keys(items).length;
		const ch = parseInt(this._can.getAttribute('height'), 10);
		if (ch < count * 20 - 4) {
			const h = count * 20 - 4;
			this._base.style.height = `${h + 16}px`;
			this._can.style.height = `${h}px`;
			this._can.setAttribute('height', '' + h);
		}
	}

	/**~ja
	 * データを追加する
	 * @param {object} data データ
	 */
	/**~en
	 * Add data
	 * @param {object} data Data
	 */
	addData(data) {
		for (const key of this._keys) {
			const v = data[key];
			this._data[key].push(v);
			if (v < this._mins[key])  this._mins[key]  = v;
			if (this._maxes[key] < v) this._maxes[key] = v;
		}
		this._draw(this._legendWidth);
	}

	/**~ja
	 * 絵をかく
	 * @private
	 * @param {number} legendWidth 凡例の幅
	 */
	/**~en
	 * Draw a picture
	 * @private
	 * @param {number} legendWidth Width of legend
	 */
	_draw(legendWidth) {
		const c = this._can.getContext('2d');
		c.clearRect(0, 0, this._can.width, this._can.height);

		this._drawLegend(c, legendWidth);
		const cx = this._can.width - legendWidth, cy = this._can.height;

		const keys = this._selectedKeys.length ? this._selectedKeys : this._keys;
		const min = Math.min(...keys.map(k => this._mins[k]));
		const max = Math.max(...keys.map(k => this._maxes[k]));

		this._drawFrame(c, legendWidth, cx, cy, min, max);
		if (this._allDataMode) {
			this._drawAllDataMode(c, legendWidth, cx, cy, min, max, keys);
		} else {
			this._drawScrollMode(c, legendWidth, cx, cy, min, max, keys);
		}
	}

	/**~ja
	 * 凡例をかく
	 * @private
	 * @param {Paper|CanvasRenderingContext2D} ctx 紙／キャンバス・コンテキスト
	 * @param {number} legendWidth 凡例の幅
	 */
	/**~en
	 * Draw a legend
	 * @private
	 * @param {Paper|CanvasRenderingContext2D} ctx Paper or canvas context
	 * @param {number} legendWidth Width of legend
	 */
	_drawLegend(ctx, legendWidth) {
		ctx.font = '12px sans-serif';
		ctx.globalAlpha = 1;
		let y = 0;
		for (const key of this._keys) {
			if (this._selectedKeys.length) {
				ctx.globalAlpha = this._selectedKeys.includes(key) ? 1 : 0.5;
			}
			const { name, style } = this._items[key];
			ctx.fillStyle = style;
			ctx.save();
			ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
			ctx.shadowOffsetY = 1;
			ctx.shadowBlur = 6;
			ctx.fillRect(0, y, 16, 16);
			ctx.restore();

			ctx.fillStyle = 'Black';
			ctx.textAlign = 'left';
			ctx.fillText(name, 16 + 8, y + 13);

			const ds = this._data[key];
			const v = ds[ds.length - 1];
			ctx.textAlign = 'right';
			ctx.fillText(this._format(this._digits, v), legendWidth - 8, y + 13);

			y += 20;
		}
		ctx.globalAlpha = 1;
	}

	/**~ja
	 * フォーマットする
	 * @private
	 * @param {number} digits 桁数
	 * @param {number} val 値
	 * @return {string} フォーマットされた文字列
	 */
	/**~en
	 * Format
	 * @private
	 * @param {number} digits Number of digits
	 * @param {number} val Value
	 * @return {string} Formatted string
	 */
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

	/**~ja
	 * わくをかく
	 * @private
	 * @param {Paper|CanvasRenderingContext2D} ctx 紙／キャンバス・コンテキスト
	 * @param {number} left 横の場所
	 * @param {number} cx 横の幅
	 * @param {number} cy たての幅
	 * @param {number} min 最小値
	 * @param {number} max 最大値
	 */
	/**~en
	 * Draw a frame
	 * @private
	 * @param {Paper|CanvasRenderingContext2D} ctx Paper or canvas context
	 * @param {number} left X coordinate
	 * @param {number} cx Width
	 * @param {number} cy Height
	 * @param {number} min Minimum value
	 * @param {number} max Maximum value
	 */
	_drawFrame(ctx, left, cx, cy, min, max) {
		ctx.strokeStyle = 'Black';
		ctx.beginPath();
		ctx.moveTo(left, 0);
		ctx.lineTo(left, cy);
		ctx.lineTo(left + cx, cy);
		ctx.stroke();
		if (min !== 0 || max !== 0) {
			const y = (max - 0) / (max - min) * cy;
			ctx.beginPath();
			ctx.moveTo(left, y);
			ctx.lineTo(left + cx, y);
			ctx.stroke();
		}
	}

	/**~ja
	 * 全データ表示モードの絵をかく
	 * @private
	 * @param {Paper|CanvasRenderingContext2D} ctx 紙／キャンバス・コンテキスト
	 * @param {number} left 横の場所
	 * @param {number} cx 横の幅
	 * @param {number} cy たての幅
	 * @param {number} min 最小値
	 * @param {number} max 最大値
	 * @param {string[]} keys データ・キーの配列
	 */
	/**~en
	 * Draw a picture on all data mode
	 * @private
	 * @param {Paper|CanvasRenderingContext2D} ctx Paper or canvas context
	 * @param {number} left X coordinate
	 * @param {number} cx Width
	 * @param {number} cy Height
	 * @param {number} min Minimum value
	 * @param {number} max Maximum value
	 * @param {string[]} keys Array of data keys
	 */
	_drawAllDataMode(ctx, left, cx, cy, min, max, keys) {
		for (const key of keys) {
			const ds = this._data[key];
			const len = ds.length;
			if (len === 0) continue;

			ctx.strokeStyle = this._items[key].style;
			ctx.beginPath();
			ctx.moveTo(left, cy - ds[0] * cy / max);

			let prevX = 0, prevY = 0;
			for (let i = 1, I = ds.length; i < I; i += 1) {
				const x = left + cx / len * i;
				const dx = x - prevX;
				if (0.5 < dx) {
					const y = (max - ds[i]) / (max - min) * cy;
					if (1.0 < dx || cy * 0.5 < Math.abs(y - prevY)) {
						ctx.lineTo(x, y);
						prevX = x;
						prevY = y;
					}
				}
			}
			ctx.stroke();
		}
	}

	/**~ja
	 * スクロール・モードの絵をかく
	 * @private
	 * @param {Paper|CanvasRenderingContext2D} ctx 紙／キャンバス・コンテキスト
	 * @param {number} left 横の場所
	 * @param {number} cx 横の幅
	 * @param {number} cy たての幅
	 * @param {number} min 最小値
	 * @param {number} max 最大値
	 * @param {string[]} keys データ・キーの配列
	 */
	/**~en
	 * Draw a picture on scroll mode
	 * @private
	 * @param {Paper|CanvasRenderingContext2D} ctx Paper or canvas context
	 * @param {number} left X coordinate
	 * @param {number} cx Width
	 * @param {number} cy Height
	 * @param {number} min Minimum value
	 * @param {number} max Maximum value
	 * @param {string[]} keys Array of data keys
	 */
	_drawScrollMode(ctx, left, cx, cy, min, max, keys) {
		for (const key of keys) {
			const ds = this._data[key];
			let len = ds.length;
			if (len === 0) continue;
			const st = Math.max(0, len - cx);
			len -= st;

			ctx.strokeStyle = this._items[key].style;
			ctx.beginPath();
			ctx.moveTo(left, cy - ds[st] * cy / max);

			for (let i = st + 1, I = ds.length; i < I; i += 1) {
				const x = left + (i - st);
				const y = (max - ds[i]) / (max - min) * cy;
				ctx.lineTo(x, y);
			}
			ctx.stroke();
		}
	}

}

Chart.ITEM_COLORS = [
	'rgb( 91, 155, 213)',
	'rgb(237, 125,  49)',
	'rgb(165, 165, 165)',
	'rgb(255, 192,   0)',
	'rgb( 68, 114, 196)',
	'rgb(112, 173,  71)',
	'rgb( 37,  94, 145)',
	'rgb(158,  72,  14)',
	'rgb( 99,  99,  99)',
	'rgb(153, 115,   0)',
	'rgb( 38,  68, 120)',
	'rgb( 67, 104,  43)',
];