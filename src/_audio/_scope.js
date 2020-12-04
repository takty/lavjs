/**~ja
 * スコープ
 * @version 2020-12-05
 */
/**~en
 * スコープ
 * @version 2020-12-05
 */
class Scope {

	// スコープを作る（横幅、たて幅）
	constructor(width, height) {
		this._waveMsecMax = 20;
		this._waveMsecInd = 5;
		this._specFreqMax = 4000;
		this._specFreqInd = 1000;
		this._fftSize = 2048;

		this._sampleRate = 48000;
		this._minDb = 0;
		this._maxDb = 0;
	
		this._mode = true;
		this._freeze = false;
		this._isSynchronized = true;

		this._buf = new Float32Array(this._fftSize);
		this._buf.fill(128);
		this._tempBuf = new Uint8Array(this._fftSize);
		this._corr = 0;

		// 描画の設定
		this._innerWidth = width - 16;
		this._innerHeight = height - 16;
		const NS = 'CONTROL-Analyser-';

		const div = document.createElement('div');
		div.className = NS + 'analyser';
		document.body.appendChild(div);
		this.domElement = div;

		const can = document.createElement('canvas');
		can.setAttribute('width', this._innerWidth);
		can.setAttribute('height', this._innerHeight);
		can.className = NS + 'can';
		div.appendChild(can);
		this._canvas = can;
		this._ctx = can.getContext('2d');
		can.onclick = () => {
			this._freeze = !this._freeze;
		};

		addCSS('.' + NS + 'analyser', '\
			position: relative; width: ' + this._innerWidth + 'px; height: ' + this._innerHeight + 'px; margin: 4px; padding: 4px;\
			display: block; vertical-align: middle; border-radius: 4px; background-color: White;\
			box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.5);\
		');
		addCSS('.' + NS + 'can', '\
			border: 0px; font-family: Consolas, Menlo, "Courier New", "メイリオ", Meiryo, monospace;\
		');

		this._fps = 60;
		this._frameLength = 60;
		this._animate(this._update.bind(this));
		this._viewOffset = 0;
	}

	_animate(callback) {
		const loop = () => {
			callback.apply(null);
			if (this._canvas.parentNode !== null) {
				window.requestAnimationFrame(loop);
			}
		};
		window.requestAnimationFrame(loop);
	}

	_update() {
		if (this._freeze) return;
		this._viewOffset = 0;
		let corr = 0;

		if (this._mode) {  // waveform
			if (this.analyser) {
				this.analyser.getByteTimeDomainData(this._tempBuf);
				corr = this._autoCorrelate(this._tempBuf, this._sampleRate);
				this._viewOffset = this._autoOffset(this._tempBuf, this.pulseWidth);
			} else {
				this._tempBuf.fill(128);
			}
			this._setData(this._tempBuf, Math.floor(this._viewOffset), this._tempBuf.length);
			this._drawTime();
		} else {  // spectrum
			if (this.analyser) {
				this.analyser.getByteTimeDomainData(this._tempBuf);
				corr = this._autoCorrelate(this._tempBuf, this._sampleRate);
				this.analyser.getByteFrequencyData(this._tempBuf);
			} else {
				this._tempBuf.fill(0);
			}
			this._setData(this._tempBuf, 0, this._fftSize / 2);
			this._drawFreq();
		}
		this._drawCorr(corr);
	}

	_autoCorrelate(buf, sampleRate) {
		const MAX_SAMPLES = Math.floor(this._fftSize / 2);
		const corrs = new Array(MAX_SAMPLES);
		let best_offset = -1;
		let best_corr = 0;
		let rms = 0;
		let found = false;

		for (let i = 0; i < this._fftSize; i += 1) {
			const val = buf[i];
			rms += val * val;
		}
		rms = Math.sqrt(rms / this._fftSize);
		if (rms < 0.01) return -1;

		let lastCorr = 1;
		for (let offset = 0; offset < MAX_SAMPLES; offset += 1) {
			let corr = 0;
			for (let i = 0; i < MAX_SAMPLES; i += 1) {
				corr += Math.abs((buf[i]) - (buf[i + offset])) / 255;
			}
			corr = 1 - (corr / MAX_SAMPLES);
			corrs[offset] = corr;

			if ((corr > 0.9) && (corr > lastCorr)) {
				found = true;
				if (corr > best_corr) {
					best_corr = corr;
					best_offset = offset;
				}
			} else if (found) {
				const shift = (corrs[best_offset + 1] - corrs[best_offset - 1]) / corrs[best_offset];
				this.pulseWidth = best_offset;
				return sampleRate / (best_offset + (8 * shift));
			}
			lastCorr = corr;
		}
		if (best_corr > 0.01) {
			this.pulseWidth = best_offset;
			return sampleRate / best_offset;
		}
		this.pulseWidth = 0;
		return -1;
	}

	_autoOffset(buf, width) {
		let maxSum = 0, off = 0;

		for (let offset = 0; offset < width * 2; offset += 1) {
			const sum = buf[offset] + buf[offset + width];
			if (maxSum < sum) {
				maxSum = sum;
				off = offset;
			}
		}
		let ret = -1;
		for (let shift = 0; shift < width; shift += 1) {
			const v = buf[off + shift];
			if (v < 128) {
				ret = off + shift;
			}
		}
		return ret;
	}

	_setData(data, off, len) {
		const buf = this._buf;

		if (this._isSynchronized) {
			for (let i = 0; i < len; i += 1) {
				if (len < i + off) break;
				buf[i] = buf[i] * 0.9 + data[i + off] * 0.1;
			}
		} else {
			for (let i = 0; i < len; i += 1) {
				buf[i] = data[i];
			}
		}
	}

	_drawCorr(corr) {
		this._corr = (corr === -1) ? -1 : (this._corr * 0.5 + corr * 0.5);
		this._ctx.textBaseline = 'top';
		this._ctx.textAlign = 'right';
		const text = (this._corr === -1) ? '?' : ((0 | this._corr + 0.5) + '');
		this._ctx.fillText(text + ' Hz', this._innerWidth, 0);
	}

	_drawTime() {
		const sr = this._sampleRate;
		const buf = this._buf;
		const len = this._waveMsecMax /*ms*/ * sr / 1000;
		const w = this._innerWidth, h = this._innerHeight;

		this._ctx.fillStyle = 'White';
		this._ctx.fillRect(0, 0, w, h);

		// 波形描画
		this._ctx.strokeStyle = 'rgb(0, 63, 0)';
		this._ctx.beginPath();
		for (let i = 0; i < len; i += 1) {
			const x = w * i / len;
			const y = h * (1 - (buf[i] / 255));
			if (i === 0) {
				this._ctx.moveTo(0, y);
			} else {
				this._ctx.lineTo(x, y);
			}
		}
		this._ctx.stroke();

		// 目盛描画
		this._ctx.fillStyle = 'rgba(0, 127, 127, 0.75)';
		this._drawHLines(['1.0', '0.5', '', '-0.5', '-1.0']);
		this._ctx.textBaseline = 'top';

		for (let i = 1, I = this._waveMsecMax / this._waveMsecInd; i < I; i += 1) {
			const x = w * (i * this._waveMsecInd * sr / 1000) / len;
			this._drawVIndicator(x, h / 2, i * this._waveMsecInd, 'ms');
		}

		// ピッチ描画
		if (this.pulseWidth !== 0) {
			this._ctx.fillStyle = 'rgba(255, 0, 0, 0.75)';
			this._ctx.fillRect(w * this.pulseWidth / len, 0, 1, h);
		}
		this._ctx.fillStyle = 'rgba(0, 127, 127, 0.75)';
	}

	_drawFreq() {
		const sr = this._sampleRate, fs = this._fftSize;
		const buf = this._buf;
		const len = this._specFreqMax * fs / sr;
		const w = this._innerWidth, h = this._innerHeight;

		this._ctx.fillStyle = 'White';
		this._ctx.fillRect(0, 0, w, h);

		// スペクトル描画
		this._ctx.strokeStyle = 'rgb(0, 0, 63)';
		this._ctx.beginPath();
		for (let i = 0; i < len; i++) {
			const x = w * i / len;
			const y = (1 - (buf[i] / 255)) * h;
			if (i === 0) {
				this._ctx.moveTo(0, y);
			} else {
				this._ctx.lineTo(x, y);
			}
		}
		this._ctx.stroke();

		// 目盛描画
		this._ctx.fillStyle = 'rgba(0, 127, 255, 0.75)';
		this._drawHLines(['' + this._maxDb, '', '', '', '' + this._minDb]);
		this._ctx.textBaseline = 'bottom';

		for (let i = 1, I = this._specFreqMax / this._specFreqInd; i < I; i += 1) {
			const x = w * (i * this._specFreqInd * fs / sr) / len;
			this._drawVIndicator(x, h, this._specFreqInd * i / 1000, 'kHz');
		}

		// ピッチ描画
		if (this._corr !== -1) {
			this._ctx.fillStyle = 'rgba(255, 0, 0, 0.75)';
			this._ctx.fillRect(w * (this._corr * fs / sr) / len, 0, 1, h);
		}
		this._ctx.fillStyle = 'rgba(0, 127, 255, 0.75)';
	}

	_drawHLines(indicators) {
		this._ctx.fillRect(0, 0, this._innerWidth, 1);
		for (let i = 1; i < 5; i += 1) {
			this._ctx.fillRect(0, this._innerHeight / 4 * i - 1, this._innerWidth, 1);
		}
		this._ctx.font = 'bold 14px monospace';
		this._ctx.textAlign = 'left';
		this._ctx.textBaseline = 'top';
		this._ctx.fillText(indicators[0], 0, 0);
		this._ctx.fillText(indicators[1], 0, this._innerHeight / 4);
		this._ctx.fillText(indicators[2], 0, this._innerHeight / 2);
		this._ctx.textBaseline = 'bottom';
		this._ctx.fillText(indicators[3], 0, this._innerHeight * 3 / 4);
		this._ctx.fillText(indicators[4], 0, this._innerHeight);
	}

	_drawVIndicator(x, y, val, unit) {
		this._ctx.fillRect(x, 0, 1, this._innerHeight);
		this._ctx.textAlign = 'right';
		this._ctx.fillText(val, x - 3, y);
		this._ctx.textAlign = 'left';
		this._ctx.fillText(unit, x + 3, y);
	}

	getAnalyserNode() {
		return this.analyser;
	}

	setAnalyserNode(analyserNode) {
		this._cleared = false;
		if (this.analyser !== analyserNode) this.analyser = analyserNode;
		if (analyserNode) {
			if (this.analyser.fftSize !== this._fftSize) this.analyser.fftSize = this._fftSize;
			this._sampleRate = analyserNode.context.sampleRate;
			this._minDb = this.analyser.minDecibels;
			this._maxDb = this.analyser.maxDecibels;
		}
	}

	setMode(mode) {
		if (this._mode && (mode === 'spec' || mode === 'spectrum')) {
			this._mode = false;
			this._buf.fill(0);
		} else if (!this._mode && (mode === 'wave' || mode === 'waveform')) {
			this._mode = true;
			this._buf.fill(128);
		}
	}

	setSynchronized(enabled) {
		this._isSynchronized = enabled;
	}

}