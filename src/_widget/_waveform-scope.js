/**~ja
 * 波形スコープ
 * @version 2021-01-29
 */
/**~en
 * Waveform scope
 * @version 2021-01-29
 */
class WaveformScope extends ScopeBase {

	/**~ja
	 * 波形スコープを作る
	 * @constructor
	 * @param {number} width 横幅
	 * @param {number} height たて幅
	 */
	/**~en
	 * Make a waveform scope
	 * @constructor
	 * @param {number} width Width
	 * @param {number} height Height
	 */
	constructor(width, height) {
		super(width, height);
	}

	/**~ja
	 * 更新する（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Update (used only in the library)
	 * @private
	 */
	_update() {
		if (this._freeze) return;
		let cor = -1, pulseW = 0, viewOff = 0, lowLevel = false;

		if (this._source) {
			this._source.getTimeDomainData(this._temp);
			if (Math.abs(128 - this._calcRms(this._temp)) < 0.01) {
				cor = -1;
				lowLevel = true;
			} else {
				[cor, pulseW] = this._autoCorrelate(this._temp, this._sampleRate, this._cors);
				viewOff = this._autoOffset(this._temp, pulseW);
			}
		} else {
			this._temp.fill(128);
		}
		this._setData(this._buf, this._temp, Math.floor(viewOff), this._isSynchronized);
		this._cor = (cor === -1) ? this._cor : (this._cor * 0.9 + cor * 0.1);

		this._drawTime(this._ctx, this._width, this._height, this._buf, this._sampleRate, this._cor, lowLevel);
	}


	// -------------------------------------------------------------------------


	/**~ja
	 * 自動的に波形のオフセットを求める（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Automatically find the waveform offset (used only in the library)
	 * @private
	 */
	_autoOffset(buf, width) {
		let maxSum = 0, o = 0;

		for (let off = 0; off < width * 2; off += 1) {
			const sum = buf[off] + buf[off + width];
			if (maxSum < sum) {
				maxSum = sum;
				o = off;
			}
		}
		let ret = -1;
		for (let shift = 0; shift < width; shift += 1) {
			if (buf[o + shift] < 128) {
				ret = o + shift;
			}
		}
		return ret;
	}


	// -------------------------------------------------------------------------


	/**~ja
	 * 時間軸のグラフを描画する（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Draw a graph on the time axis (used only in the library)
	 * @private
	 */
	_drawTime(ctx, w, h, buf, sampleRate, cor, lowLevel) {
		const len = WaveformScope.WAVE_MSEC_MAX /*ms*/ * sampleRate / 1000;

		ctx.fillStyle = 'White';
		ctx.fillRect(0, 0, w, h);

		//~ja 波形描画
		//~en Drawing waveform
		ctx.strokeStyle = 'rgb(0, 63, 0)';
		ctx.setLineDash([]);
		ctx.beginPath();
		for (let i = 0; i < len; i += 1) {
			const x = w * i / len;
			const y = h * (1 - (buf[i] / 255));
			if (i === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
		}
		ctx.stroke();

		//~ja 目盛描画
		//~en Drawing scales
		ctx.fillStyle = 'rgba(0, 127, 127, 0.75)';
		ctx.strokeStyle = 'rgba(0, 127, 127, 1)';
		ctx.setLineDash([2, 2]);
		this._drawHLines(ctx, w, h, ['1.0', '0.5', '', '-0.5', '-1.0']);

		ctx.textBaseline = 'top';
		const I = WaveformScope.WAVE_MSEC_MAX / WaveformScope.WAVE_MSEC_IND;
		for (let i = 1; i < I; i += 1) {
			const x = w * (i * WaveformScope.WAVE_MSEC_IND * sampleRate / 1000) / len;
			this._drawVIndicator(ctx, w, h, x, h / 2, i * WaveformScope.WAVE_MSEC_IND, 'ms');
		}

		//~ja ピッチ描画
		//~en Drawing pitch
		if (cor !== 0 && !lowLevel) {
			ctx.strokeStyle = 'rgba(255, 0, 0, 0.75)';
			ctx.setLineDash([]);
			const x = w * (sampleRate / cor) / len + 0.5;
			ctx.beginPath();
			ctx.moveTo(x, 0); ctx.lineTo(x, h);
			ctx.stroke();
		}
		ctx.fillStyle = 'rgba(0, 127, 127, 0.75)';
		this._drawCorr(ctx, w, h, cor, lowLevel);
	}


	// -------------------------------------------------------------------------


	/**~ja
	 * データ・ソースをセットする
	 * @param {DataSource} dataSource データ・ソース
	 */
	/**~en
	 * Set a data source
	 * @param {DataSource} dataSource Data source
	 */
	setDataSource(dataSource) {
		if (this._source !== dataSource) this._source = dataSource;
		if (dataSource) {
			this._size = dataSource.size();
			this._buf = new Float32Array(this._size);
			this._buf.fill(128);
			this._temp = new Uint8Array(this._size);
			this._sampleRate = dataSource.sampleRate();
			this._cors = new Array(Math.floor(this._size / 2));
		}
	}

}

WaveformScope.WAVE_MSEC_MAX = 20;
WaveformScope.WAVE_MSEC_IND = 5;