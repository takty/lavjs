/**~ja
 * スコープ・ベース
 * @version 2020-12-17
 */
/**~en
 * Scope base
 * @version 2020-12-17
 */
class ScopeBase {

	/**~ja
	 * スコープ・ベースを作る
	 * @param {number} width 横幅
	 * @param {number} height たて幅
	 */
	/**~en
	 * Make a scope base
	 * @param {number} width Width
	 * @param {number} height Height
	 */
	constructor(width, height) {
		this._size = 0;
		this._buf = [];
		this._temp = [];
		this._sampleRate = 1;
		this._cors = [];

		this._freeze = false;
		this._isSynchronized = true;
		this._cor = 0;
		this._initView(width, height);
		this._animate();
	}

	/**~ja
	 * 表示を初期化する（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Initialize view (used only in the library)
	 * @private
	 */
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

		addStyle(`.${NS}analyser`, {
			position       : 'relative',
			width          : this._width + 'px',
			height         : this._height + 'px',
			margin         : '4px',
			padding        : '4px',
			display        : 'block',
			verticalAlign  : 'middle',
			borderRadius   : '1px',
			backgroundColor: 'White',
			boxShadow      : '1px 1px 8px rgba(0, 0, 0, 0.5)',
		});
		addStyle(`.${NS}can`, {
			border    : '0px',
			fontFamily: 'Consolas, Menlo, "Courier New", "メイリオ", Meiryo, monospace',
		});
	}

	/**~ja
	 * アニメーションする（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Do animation (used only in the library)
	 * @private
	 */
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


	/**~ja
	 * 自動的にコリレーションを求める（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Automatically calculate correlation (used only in the library)
	 * @private
	 */
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

	/**~ja
	 * RMSを計算する（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Calculate RMS (used only in the library)
	 * @private
	 */
	_calcRms(buf) {
		let s = 0;
		for (const v of buf) s += v * v;
		return Math.sqrt(s / buf.length);
	}

	/**~ja
	 * データをセットする（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Set data (used only in the library)
	 * @private
	 */
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


	/**~ja
	 * 水平線を描画する（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Draw horizontal lines (used only in the library)
	 * @private
	 */
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

	/**~ja
	 * 垂直方向のインジケーターを描画する（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Draw vertical indicators (used only in the library)
	 * @private
	 */
	_drawVIndicator(ctx, w, h, x, y, val, unit) {
		ctx.beginPath();
		ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h);
		ctx.stroke();
		ctx.textAlign = 'right';
		ctx.fillText(val, x - 3, y);
		ctx.textAlign = 'left';
		ctx.fillText(unit, x + 3, y);
	}

	/**~ja
	 * コリレーションを描画する（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Draw the correlation (used only in the library)
	 * @private
	 */
	_drawCorr(ctx, w, h, cor, lowLevel) {
		ctx.textBaseline = 'top';
		ctx.textAlign = 'right';
		const text = lowLevel ? '?' : ((0 | cor + 0.5) + '');
		ctx.fillText(text + ' Hz', w, 1);
	}


	// -------------------------------------------------------------------------


	/**~ja
	 * 同期するかどうかを設定する
	 * @param {boolean} enabled 同期するか
	 */
	/**~en
	 * Set whether to be synchronized
	 * @param {boolean} enabled Whether to be synchronized
	 */
	setSynchronized(enabled) {
		this._isSynchronized = enabled;
	}

}