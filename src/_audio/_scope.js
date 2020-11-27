/**~ja
 * アナライザー・ライブラリー（ANALYSER）
 * @author Takuto Yanagida
 * @version 2020-04-23
 */


// ライブラリ用の変数
// var ANALYSER = (function () {

	'use strict';


	//（ライブラリの中だけで使う関数）CSSのスタイルを追加する（セレクター、スタイル）
	var _addCSS = (function () {
		var s = document.createElement('style');
		s.setAttribute('type', 'text/css');
		document.head.appendChild(s);
		var ss = s.sheet;

		return function (selector, style) {
			ss.insertRule(selector + '{' + style + '}', 0);
		};
	})();


	// ================================================ スコープ・クラス (ANALYSER.Scope)


	// スコープを作る（横幅、たて幅）
	// ※必ずnewを付けて呼び出すこと。
	class Scope {

		constructor(width, height) {
			this.waveMsecMax = 20;
			this.waveMsecInd = 5;
			this.specFreqMax = 4000;
			this.specFreqInd = 1000;
			this.mode = true;
			this.fftSize = 2048;
			this._sampleRate = 48000;
			this.minDb = 0;
			this.maxDb = 0;
			this.freeze = false;

			this._isSynchronized = true;

			this.buf = new Float32Array(this.fftSize);
			for (var i = 0, I = this.buf.length; i < I; i += 1) this.buf[i] = 128;
			this.tempBuf = new Uint8Array(this.fftSize);
			this.corr = 0;

			// 描画の設定
			this.innerWidth = width - 16;
			this.innerHeight = height - 16;
			var NS = 'CONTROL-Analyser-';

			var div = document.createElement('div');
			div.className = NS + 'analyser';
			document.body.appendChild(div);
			this.domElement = div;

			var can = document.createElement('canvas');
			can.setAttribute('width', this.innerWidth);
			can.setAttribute('height', this.innerHeight);
			can.className = NS + 'can';
			div.appendChild(can);
			this.canvas = can;
			this.cc = can.getContext('2d');
			can.onclick = () => {
				this.freeze = !this.freeze;
			};

			_addCSS('.' + NS + 'analyser', '\
				position: relative; width: ' + this.innerWidth + 'px; height: ' + this.innerHeight + 'px; margin: 4px; padding: 4px;\
				display: block; vertical-align: middle; border-radius: 4px; background-color: White;\
				box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.5);\
			');
			_addCSS('.' + NS + 'can', '\
				border: 0px; font-family: Consolas, Menlo, "Courier New", "メイリオ", Meiryo, monospace;\
			');

			this._fps = 60;
			this._frameLength = 60;
			this._animate(this._update.bind(this));
			this.viewOffset = 0;
		}

		_animate(callback) {
			var w = window, r = 'equestAnimationFrame',
				func = w['r' + r] || w['webkitR' + r] || w['mozR' + r] || w['msR' + r] || w['oR' + r] || function (c) { w.setTimeout(c, 1000 / 60); },
				reqAnimationFrame = func.bind(w);

			const loop = () => {
				callback.apply(null);
				if (this.canvas.parentNode !== null) {
					reqAnimationFrame(loop);
				}
			};
			reqAnimationFrame(loop);
		}

		_update() {
			if (this.freeze) return;
			var corr = 0;
			var ana = this.analyser;
			this.viewOffset = 0;

			if (this.mode) { // waveform
				if (ana) {
					ana.getByteTimeDomainData(this.tempBuf);
					corr = this._autoCorrelate(this.tempBuf, this._sampleRate);
					this.viewOffset = this._autoOffset(this.tempBuf, this.pulseWidth);
				} else {
					for (var i = 0, I = this.tempBuf.length; i < I; i += 1) this.tempBuf[i] = 128;
				}
				this._setData(this.tempBuf, Math.floor(this.viewOffset), this.tempBuf.length);
				this._drawTime();
			} else { // spectrum
				if (ana) {
					ana.getByteTimeDomainData(this.tempBuf);
					corr = this._autoCorrelate(this.tempBuf, this._sampleRate);
					ana.getByteFrequencyData(this.tempBuf);
				} else {
					for (var i = 0, I = this.tempBuf.length; i < I; i += 1) this.tempBuf[i] = 0;
				}
				this._setData(this.tempBuf, 0, this.fftSize / 2);
				this._drawFreq();
			}
			this._drawCorr(corr);
		}

		_autoCorrelate(buf, sampleRate) {
			var MAX_SAMPLES = Math.floor(this.fftSize / 2);
			var best_offset = -1;
			var best_corr = 0;
			var rms = 0;
			var found = false;
			var corrs = new Array(MAX_SAMPLES);

			for (var i = 0, I = this.fftSize; i < I; i += 1) {
				var val = buf[i];
				rms += val * val;
			}
			rms = Math.sqrt(rms / this.fftSize);
			if (rms < 0.01) return -1;

			var lastCorr = 1;
			for (var offset = 0; offset < MAX_SAMPLES; offset += 1) {
				var corr = 0;
				for (var i = 0; i < MAX_SAMPLES; i += 1) {
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
					var shift = (corrs[best_offset + 1] - corrs[best_offset - 1]) / corrs[best_offset];
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
			var maxSum = 0, off = 0, maxVs = 0;

			for (var offset = 0; offset < width * 2; offset += 1) {
				var sum = buf[offset] + buf[offset + width];
				if (maxSum < sum) {
					maxSum = sum;
					off = offset;
				}
			}
			var ret = -1;
			for (var shift = 0; shift < width; shift += 1) {
				var v = buf[off + shift];
				if (v < 128) {
					ret = off + shift;
				}
			}
			return ret;
		}

		_setData(data, off, len) {
			var buf = this.buf;

			if (this._isSynchronized) {
				for (var i = 0; i < len; i += 1) {
					if (len < i + off) break;
					buf[i] = buf[i] * 0.9 + data[i + off] * 0.1;
				}
			} else {
				for (var i = 0; i < len; i += 1) {
					buf[i] = data[i];
				}
			}
		}

		_drawCorr(corr) {
			this.corr = (corr === -1) ? -1 : (this.corr * 0.75 + corr * 0.25);
			this.cc.textBaseline = 'top';
			this.cc.textAlign = 'right';
			var text = (this.corr === -1) ? '?' : ((0 | this.corr) + '');
			this.cc.fillText(text + ' Hz', this.innerWidth, 0);
		}

		_drawTime() {
			var sr = this._sampleRate;
			var buf = this.buf;
			var len = this.waveMsecMax /*ms*/ * sr / 1000;
			var w = this.innerWidth, h = this.innerHeight;

			this.cc.fillStyle = 'White';
			this.cc.fillRect(0, 0, w, h);

			// 波形描画
			this.cc.strokeStyle = 'rgb(0, 63, 0)';
			this.cc.beginPath();
			for (var i = 0; i < len; i += 1) {
				var x = w * i / len;
				var y = h * (1 - (buf[i] / 255));
				if (i === 0) {
					this.cc.moveTo(0, y);
				} else {
					this.cc.lineTo(x, y);
				}
			}
			this.cc.stroke();

			// 目盛描画
			this.cc.fillStyle = 'rgba(0, 127, 127, 0.75)';
			this._drawHLines(['1.0', '0.5', '', '-0.5', '-1.0']);
			this.cc.textBaseline = 'top';

			for (var i = 1, I = this.waveMsecMax / this.waveMsecInd; i < I; i += 1) {
				var x = w * (i * this.waveMsecInd * sr / 1000) / len;
				this._drawVIndicator(x, h / 2, i * this.waveMsecInd, 'ms');
			}

			// ピッチ描画
			if (this.pulseWidth !== 0) {
				this.cc.fillStyle = 'rgba(255, 0, 0, 0.75)';
				this.cc.fillRect(w * this.pulseWidth / len, 0, 1, h);
			}
			this.cc.fillStyle = 'rgba(0, 127, 127, 0.75)';
		}

		_drawFreq() {
			var sr = this._sampleRate, fs = this.fftSize;
			var buf = this.buf;
			var len = this.specFreqMax * fs / sr;
			var w = this.innerWidth, h = this.innerHeight;

			this.cc.fillStyle = 'White';
			this.cc.fillRect(0, 0, w, h);

			// スペクトル描画
			this.cc.strokeStyle = 'rgb(0, 0, 63)';
			this.cc.beginPath();
			for (var i = 0; i < len; i++) {
				var x = w * i / len;
				var y = (1 - (buf[i] / 255)) * h;
				if (i === 0) {
					this.cc.moveTo(0, y);
				} else {
					this.cc.lineTo(x, y);
				}
			}
			this.cc.stroke();

			// 目盛描画
			this.cc.fillStyle = 'rgba(0, 127, 255, 0.75)';
			this._drawHLines(['' + this.maxDb, '', '', '', '' + this.minDb]);
			this.cc.textBaseline = 'bottom';

			for (var i = 1, I = this.specFreqMax / this.specFreqInd; i < I; i += 1) {
				var x = w * (i * this.specFreqInd * fs / sr) / len;
				this._drawVIndicator(x, h, this.specFreqInd * i / 1000, 'kHz');
			}

			// ピッチ描画
			if (this.corr !== -1) {
				this.cc.fillStyle = 'rgba(255, 0, 0, 0.75)';
				this.cc.fillRect(w * (this.corr * fs / sr) / len, 0, 1, h);
			}
			this.cc.fillStyle = 'rgba(0, 127, 255, 0.75)';
		}

		_drawHLines(indicators) {
			this.cc.fillRect(0, 0, this.innerWidth, 1);
			for (var i = 1; i < 5; i += 1) {
				this.cc.fillRect(0, this.innerHeight / 4 * i - 1, this.innerWidth, 1);
			}
			this.cc.font = 'bold 14px monospace';
			this.cc.textAlign = 'left';
			this.cc.textBaseline = 'top';
			this.cc.fillText(indicators[0], 0, 0);
			this.cc.fillText(indicators[1], 0, this.innerHeight / 4);
			this.cc.fillText(indicators[2], 0, this.innerHeight / 2);
			this.cc.textBaseline = 'bottom';
			this.cc.fillText(indicators[3], 0, this.innerHeight * 3 / 4);
			this.cc.fillText(indicators[4], 0, this.innerHeight);
		}

		_drawVIndicator(x, y, val, unit) {
			var h = this.innerHeight;
			this.cc.fillRect(x, 0, 1, h);
			this.cc.textAlign = 'right';
			this.cc.fillText(val, x - 3, y);
			this.cc.textAlign = 'left';
			this.cc.fillText(unit, x + 3, y);
		}

		getAnalyserNode() {
			return this.analyser;
		}

		setAnalyserNode(analyserNode) {
			this._cleared = false;
			if (this.analyser !== analyserNode) this.analyser = analyserNode;
			if (analyserNode) {
				if (this.analyser.fftSize !== this.fftSize) this.analyser.fftSize = this.fftSize;
				this._sampleRate = analyserNode.context.sampleRate;
				this.minDb = this.analyser.minDecibels;
				this.maxDb = this.analyser.maxDecibels;
			}
		}

		setMode(mode) {
			if (this.mode && (mode === 'spec' || mode === 'spectrum')) {
				this.mode = false;
				for (var i = 0, I = this.buf.length; i < I; i += 1) this.buf[i] = 0;
			} else if (!this.mode && (mode === 'wave' || mode === 'waveform')) {
				this.mode = true;
				for (var i = 0, I = this.buf.length; i < I; i += 1) this.buf[i] = 128;
			}
		}

		setSynchronized(enabled) {
			this._isSynchronized = enabled;
		}

	}


	// ================================================ ライブラリとしてリターン


	// return {
	// 	Scope: Scope,
	// };

// }());
