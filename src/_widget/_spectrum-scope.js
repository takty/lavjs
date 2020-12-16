/**~ja
 * スペクトル・スコープ
 * @version 2020-12-16
 */
/**~en
 * Spectrum scope
 * @version 2020-12-16
 */
class SpectrumScope extends ScopeBase {

	/**~ja
	 * スペクトル・スコープを作る
	 * @param {number} width 横幅
	 * @param {number} height たて幅
	 */
	/**~en
	 * Make a spectrum scope
	 * @param {number} width Width
	 * @param {number} height Height
	 */
	constructor(width, height) {
		super(width, height);
		this._minDb = 0;
		this._maxDb = 0;
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
		let cor = 0, lowLevel = false;

		if (this._source) {
			this._source.getTimeDomainData(this._temp);
			if (Math.abs(128 - this._calcRms(this._temp)) < 0.01) {
				cor = -1;
				lowLevel = true;
			} else {
				[cor, ] = this._autoCorrelate(this._temp, this._sampleRate, this._cors);
			}
			this._source.getFrequencyData(this._temp);
		} else {
			this._temp.fill(0);
		}
		this._setData(this._buf, this._temp, 0, this._isSynchronized, this._size / 2);
		this._cor = (cor === -1) ? this._cor : (this._cor * 0.9 + cor * 0.1);

		this._drawFreq(this._ctx, this._width, this._height, this._buf, this._sampleRate, this._cor, lowLevel);
	}


	// -------------------------------------------------------------------------


	/**~ja
	 * 周波数軸のグラフを描画する（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Draw a graph on the frequency axis (used only in the library)
	 * @private
	 */
	_drawFreq(ctx, w, h, buf, sampleRate, cor, lowLevel) {
		const fs = buf.length;
		const len = SpectrumScope.SPEC_FREQ_MAX * fs / sampleRate;

		ctx.fillStyle = 'White';
		ctx.fillRect(0, 0, w, h);

		//~ja スペクトル描画
		//~en Drawing spectrum
		ctx.strokeStyle = 'rgb(0, 0, 63)';
		ctx.setLineDash([]);
		ctx.beginPath();
		for (let i = 0; i < len; i++) {
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
		ctx.fillStyle = 'rgba(0, 127, 255, 0.75)';
		ctx.strokeStyle = 'rgba(0, 127, 255, 1)';
		ctx.setLineDash([2, 2]);
		this._drawHLines(ctx, w, h, ['' + this._maxDb, '', '', '', '' + this._minDb]);
		
		ctx.textBaseline = 'bottom';
		const I = SpectrumScope.SPEC_FREQ_MAX / SpectrumScope.SPEC_FREQ_IND;
		for (let i = 1; i < I; i += 1) {
			const x = w * (i * SpectrumScope.SPEC_FREQ_IND * fs / sampleRate) / len;
			this._drawVIndicator(ctx, w, h, x, h, i * SpectrumScope.SPEC_FREQ_IND / 1000, 'kHz');
		}

		//~ja ピッチ描画
		//~en Drawing pitch
		if (cor !== 0 && !lowLevel) {
			ctx.strokeStyle = 'rgba(255, 0, 0, 0.75)';
			ctx.setLineDash([]);
			const x = w * (cor * fs / sampleRate) / len + 0.5;
			ctx.beginPath();
			ctx.moveTo(x, 0); ctx.lineTo(x, h);
			ctx.stroke();
		}
		ctx.fillStyle = 'rgba(0, 127, 255, 0.75)';
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
			this._size = this._source.size();
			this._buf = new Float32Array(this._size);
			this._buf.fill(0);
			this._temp = new Uint8Array(this._size);
			this._sampleRate = dataSource.sampleRate();
			this._cors = new Array(Math.floor(this._size / 2));
			this._minDb = dataSource.minDecibels();
			this._maxDb = dataSource.maxDecibels();
		}
	}

}

SpectrumScope.SPEC_FREQ_MAX = 4000;
SpectrumScope.SPEC_FREQ_IND = 1000;