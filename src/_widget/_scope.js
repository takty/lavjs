/**~ja
 * スコープ・ベース
 * @version 2020-12-06
 */
/**~en
 * スコープ・ベース
 * @version 2020-12-06
 */
class ScopeBase {

	// スコープを作る（横幅、たて幅）
	constructor(width, height) {
		this._size = 0;
		this._buf = [];
		this._temp = [];
		this._sampleRate = 1;
		this._cors = [];

		this._freeze = false;
		this._isSynchronized = true;
		this._cor = 0;
	}

	// 描画の設定
	_initView(width, height) {
		this._width  = width  - 16;
		this._height = height - 16;
		const NS = 'CONTROL-Analyser-';

		this._outer = document.createElement('div');
		this._outer.className = NS + 'analyser';
		document.body.appendChild(this._outer);

		const can = document.createElement('canvas');
		can.className = NS + 'can';
		can.setAttribute('width', this._width);
		can.setAttribute('height', this._height);
		can.onclick = () => { this._freeze = !this._freeze; };
		this._ctx = can.getContext('2d');
		this._outer.appendChild(can);

		addCSS('.' + NS + 'analyser', '\
			position: relative; width: ' + this._width + 'px; height: ' + this._height + 'px; margin: 4px; padding: 4px;\
			display: block; vertical-align: middle; border-radius: 4px; background-color: White;\
			box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.5);\
		');
		addCSS('.' + NS + 'can', '\
			border: 0px; font-family: Consolas, Menlo, "Courier New", "メイリオ", Meiryo, monospace;\
		');
	}

	_animate() {
		const loop = () => {
			this._update();
			if (this._ctx.canvas.parentNode !== null) {
				window.requestAnimationFrame(loop);
			}
		};
		window.requestAnimationFrame(loop);
	}


	// -------------------------------------------------------------------------


	_autoCorrelate(bufTd, sampleRate, cors) {
		let bestOff = -1;
		let bestCor = 0;
		let found = false;
		let lastCor = 1;

		for (let off = 0; off < cors.length; off += 1) {
			let cor = 0;
			for (let i = 0; i < cors.length; i += 1) {
				cor += Math.abs((bufTd[i]) - (bufTd[i + off])) / 255;
			}
			cor = 1 - (cor / cors.length);
			cors[off] = cor;

			if ((cor > 0.9) && (cor > lastCor)) {
				found = true;
				if (cor > bestCor) {
					bestCor = cor;
					bestOff = off;
				}
			} else if (found) {
				const shift = (cors[bestOff + 1] - cors[bestOff - 1]) / cors[bestOff];
				return [sampleRate / (bestOff + (8 * shift)), bestOff];
			}
			lastCor = cor;
		}
		if (bestCor > 0.01) {
			return [sampleRate / bestOff, bestOff];
		}
		return [-1, 0];
	}

	_calcRms(buf) {
		let s = 0;
		for (const v of buf) s += v * v;
		return Math.sqrt(s / buf.length);
	}

	_setData(buf, data, offset, isSynchronized, len = buf.length) {
		if (isSynchronized) {
			for (let i = 0; i < len; i += 1) {
				if (len < i + offset) break;
				buf[i] = buf[i] * 0.9 + data[i + offset] * 0.1;
			}
		} else {
			for (let i = 0; i < len; i += 1) {
				buf[i] = data[i];
			}
		}
	}


	// -------------------------------------------------------------------------


	_drawHLines(ctx, w, h, indicators) {
		ctx.beginPath();
		ctx.moveTo(0, 0); ctx.lineTo(w, 0);
		for (let i = 0; i < 5; i += 1) {
			const y = (i === 0) ? 0.5 : ((h / 4 * i - 1) + 0.5);
			ctx.moveTo(0, y); ctx.lineTo(w, y);
		}
		ctx.stroke();
		ctx.font = 'bold 14px monospace';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.fillText(indicators[0], 0, 1);
		ctx.fillText(indicators[1], 0, h / 4);
		ctx.fillText(indicators[2], 0, h / 2);
		ctx.textBaseline = 'bottom';
		ctx.fillText(indicators[3], 0, h * 3 / 4);
		ctx.fillText(indicators[4], 0, h);
	}

	_drawVIndicator(ctx, w, h, x, y, val, unit) {
		ctx.beginPath();
		ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h);
		ctx.stroke();
		ctx.textAlign = 'right';
		ctx.fillText(val, x - 3, y);
		ctx.textAlign = 'left';
		ctx.fillText(unit, x + 3, y);
	}

	_drawCorr(ctx, w, h, cor, lowLevel) {
		ctx.textBaseline = 'top';
		ctx.textAlign = 'right';
		const text = lowLevel ? '?' : ((0 | cor + 0.5) + '');
		ctx.fillText(text + ' Hz', w, 1);
	}


	// -------------------------------------------------------------------------


	setSynchronized(enabled) {
		this._isSynchronized = enabled;
	}

}