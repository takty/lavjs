/**~ja
 * パッチ・ライブラリー（CJSTRE）
 * @author Takuto Yanagida
 * @version 2020-04-23
 *
 * 音を鳴らすための部品を作るライブラリです。
 */


var CJSTRE = (function(){

	'use strict';


	// ================================================ パッチ共通メソッド


	class Patch {

		set(ps_key, undef_val) {
			var setVal = function (key, val) {
				if (typeof val === 'number' || typeof val === 'string' || typeof val === 'boolean') {
					if (this[key] === undefined) throw 'Parameter name "' + key + '" is wrong.';
					this[key] = val;
				} else if (val.output !== undefined) {
					val.plug(this._getTarget(key));
				}
			}.bind(this);

			if (undef_val === undefined) {
				for (var key in ps_key) setVal(key, ps_key[key]);
			} else {
				setVal(ps_key, undef_val);
			}
			this._update();
			return this;
		}

		plug(target, opt_param) {
			this._targets.push(target._getTarget(opt_param));
			return target;
		}

		unplug() {
			this._targets.length = 0;
		}

	}


	// ================================================ オシレーター・パッチ


	class OscillatorPatch extends Patch {

		constructor(quilt, type, params) {
			this._quilt = quilt;
			this._targets = [];
			this._pluged = null;

			this.type = par(params, 'type', type);
			this.freq = par(params, 'freq', 440);
			this.detune = par(params, 'detune', 0);
			this.amp = par(params, 'amp', 0.5);
			this.base = par(params, 'base', 0);

			this.start = par(params, 'start', 0);
			this.stop = par(params, 'stop', 0);
		}

		_update() {
			if (this.o && this.o.type !== this.type) this.o.type = this.type;
			if (this.o && this.o.frequency.value !== this.freq) this.o.frequency.value = this.freq;
			if (this.o && this.o.detune.value !== this.detune) this.o.detune.value = this.detune;
			if (this.a && this.a.gain.value !== this.amp) this.a.gain.value = this.amp;
			if (this.base) {
				for (var i = 0, I = this._targets.length; i < I; i += 1) {
					var t = this._targets[i]();  // 実行すると有効な接続先が得られる
					if (t.value !== undefined) {
						t.value = this.base;
					}
				}
			}
		}

		_getTarget(opt_param) {
			if (opt_param === 'freq') {
				return function () { return this.o.frequency; }.bind(this);
			} else if (opt_param === 'detune') {
				return function () { return this.o.detune; }.bind(this);
			} else if (opt_param === 'amp') {
				return function () { return this.a.gain; }.bind(this);
			}
		}

		_construct() {
			this.o = this._quilt.context.createOscillator();
			this.o.type = this.type;
			this.o.frequency.value = this.freq;
			this.o.detune.value = this.detune;

			this.a = this._quilt.context.createGain();
			this.a.gain.value = this.amp;

			this.o.connect(this.a);
			this._pluged = this.a;
		}

		_reserveStart(t) {
			if (this.o) this.o.start(t + this.start);
		}

		_reserveStop(t) {
			if (this.o) this.o.stop(t + this.stop);
			if (this.a) this.a.gain.setValueAtTime(0, t + this.stop);
		}

		_destruct() {
			disconnect(this.o, this.a);
			this.o = this.a = null;
		}
	}


	// ================================================ ノイズ・パッチ


	class NoisePatch extends Patch {

		constructor(quilt, params) {
			this._quilt = quilt;
			this._targets = [];
			this._pluged = null;

			this.amp = par(params, 'amp', 0.5);
		}

		_update() {
			if (this.a && this.a.gain.value !== this.amp) this.a.gain.value = this.amp;
		}

		_getTarget(opt_param) {
			if (opt_param === 'amp') {
				return function () { return this.a.gain; }.bind(this);
			}
		}

		_construct() {
			this.sp = this._quilt.context.createScriptProcessor(2048, 0, 1);
			this.sp.onaudioprocess = function (e) {
				var output = e.outputBuffer.getChannelData(0);
				for (var i = 0; i < this.bufferSize; i += 1) {
					output[i] = 2 * (Math.random() - 0.5);
				}
			};
			this.a = this._quilt.context.createGain();
			this.a.gain.value = this.amp;

			this.sp.connect(this.a);
			this._pluged = this.a;
		}

		_destruct() {
			disconnect(this.sp, this.a);
			this.sp = this.a = null;
		}

	}


	// ================================================ マイク・パッチ


	class MicrophonePatch extends Patch {

		constructor(quilt, params) {
			this._quilt = quilt;
			this._targets = [];
			this._pluged = null;

			this.amp    = par(params, 'amp', 10);
			this.afFreq = par(params, 'afFreq', 0);
			this.afQ    = par(params, 'afQ', 12);
		}

		_update() {
			if (this.a && this.a.gain.value !== this.amp) this.a.gain.value = this.amp;
			if (this.f && this.f.frequency.value !== this.afFreq) this.f.frequency.value = this.afFreq;
			if (this.f && this.f.Q.value !== this.afQ) this.f.Q.value = this.afQ;
		}

		_getTarget(opt_param) {
			if (opt_param === 'amp') {
				return function () { return this.a.gain; }.bind(this);
			}
			if (opt_param === 'afFreq') {
				return function () { return this.f.frequency; }.bind(this);
			}
			if (opt_param === 'afQ') {
				return function () { return this.f.Q; }.bind(this);
			}
		}

		_construct() {
			this.a = this._quilt.context.createGain();
			this.a.gain.value = this.amp;

			this.f = null;
			if (typeof this.afFreq !== 0) {
				this.f = this._quilt.context.createBiquadFilter();
				this.f.type = 'notch';
				this.f.Q.value = this.afQ;
				this.f.frequency.value = this.afFreq;
			}
			var that = this;
			navigator.webkitGetUserMedia({ audio: true, video: false }, function (stream) {
				that.m = that._quilt.context.createMediaStreamSource(stream);
				if (that.f) {
					that.m.connect(that.f);
					that.f.connect(that.a);
				}
				else {
					that.m.connect(that.a);
				}
			}, function () {
			});
			this._pluged = this.a;
		}

		_destruct() {
			disconnect(this.a, this.f, this.m);
			this.a = this.f = this.m = null;
		}

	}


	// ================================================ 音声ファイル・パッチ


	class SoundFilePatch extends Patch {

		constructor(quilt, params) {
			this._quilt = quilt;
			this._targets = [];
			this._pluged = null;

			this.begin = par(params, 'begin', 0);
			this.end = par(params, 'end', 0);

			var that = this;
			this._buf = par(params, 'buf', null);
			if (this._buf) {
				this._buf.getBuffer(function (audioBuf) {
					that.audioBuf = audioBuf;
				});
			}
		}

		_update() {
		}

		_getTarget(opt_param) {
		}

		_construct() {
			this.src = this._quilt.context.createBufferSource();
			if (this.audioBuf) this.src.buffer = this.audioBuf;
			this._pluged = this.src;
		}

		_reserveStart(t) {
			if (this.src && this.audioBuf) {
				this.src.loop               = false;
				this.src.loopStart          = 0;
				this.src.loopEnd            = (this.audioBuf) ? this.audioBuf.duration : 0;
				this.src.playbackRate.value = 1.0;
				this.src.start(t, this.begin, this.end || this.audioBuf.duration);
				this.isStarted = true;
			}
		}

		_reserveStop(t) {
			if (this.isStarted && this.src) {
				this.src.stop(t);
				this.isStarted = false;
			}
		}

		_destruct() {
		}

	}

	class SoundFile {

		constructor(url) {
			this._url = url;
			this._audioBuf = null;
			this.getBuffer();
		}

		getBuffer(fn) {
			if (this._audioBuf) {
				if (fn) fn(this._audioBuf);
				return;
			}
			var that = this;
			var r = new XMLHttpRequest();
			r.open('GET', this._url, true);
			r.responseType = 'arraybuffer';
			r.onload = function () {
				console.log('SoundFile - loaded');
				CJSTRE.AUDIO_CONTEXT.decodeAudioData(r.response, function (audioBuf) {
					that._audioBuf = audioBuf;
					console.log('SoundFile - decoded');
					if (fn)
						fn(that._audioBuf);
					return;
				}, function (err) {
					console.log('SoundFile - error');
				});
			};
			r.send();
		}
	}


	// ================================================ ゲイン・パッチ


	class GainPatch extends Patch {

		constructor(quilt, type, params) {
			this._quilt = quilt;
			this._targets = [];
			this._pluged = null;

			this.type = type;
			if (type === 'constant') {
				this.amp = par(params, 'amp', 1.0);
			} else {
				this.begin = par(params, 'begin', 0.5);
				this.end = par(params, 'end', 0.00001);
				if (this.end === 0) this.end = 1e-6;
				this.dur = par(params, 'dur', 0.1);
				this.base = par(params, 'base', 0);

				this.start = par(params, 'start', 0);
				this.stop = par(params, 'stop', 0);
			}
		}

		_update() {
			if (this.a && this.a.gain.value !== this.amp) this.a.gain.value = this.amp;
		}

		_getTarget(opt_param) {
			if (opt_param === undefined) {
				return function () { return this.g; }.bind(this);
			} else {
				if (opt_param === 'amp') {
					return function () { return this.g.gain; }.bind(this);
				}
			}
		}

		_construct() {
			this.g = this._quilt.context.createGain();
			this.g.gain.value = (this.amp === undefined) ? 0 : this.amp;
			this._pluged = this.g;
		}

		_reserveStart(t) {
			if (this.type !== 'constant') {
				this.g.gain.setValueAtTime(this.begin, t + this.start);
				if (this.type === 'line') {
					this.g.gain.linearRampToValueAtTime(this.end, t + this.start + this.dur);
				} else if (this.type === 'exponential') {
					this.g.gain.exponentialRampToValueAtTime(this.end, t + this.start + this.dur);
				}
				return true;
			}
		}

		_keyOff(t, notifyShutdown) {
			if (this.type !== 'constant' && this.g) {
				var g = this.g;
				g.gain.setValueAtTime(this.end, t + this.stop);
				var id = window.setInterval(function () {
					if (g.gain.value < 1e-3) {
						window.clearInterval(id);
						notifyShutdown();
					}
				}, (t - this._quilt.context.currentTime) * 1000);
			}
		}

		_reserveStop(t) {
			if (this.g && this.type === 'constant') {
				this.g.gain.setValueAtTime(0, t);
			}
		}

		_destruct() {
			disconnect(this.g);
			this.g = null;
		}

	}


	// ================================================ フィルター・パッチ


	class BiquadFilterPatch extends Patch {

		constructor(quilt, type, params) {
			this._quilt = quilt;
			this._targets = [];
			this._pluged = null;

			this.type = par(params, 'type', type);
			this.freq = par(params, 'freq', 1000);
			this.q = par(params, 'q', 1);
		}

		_update() {
			if (this.f && this.f.type !== this.type) this.f.type = this.type;
			if (this.f && this.f.frequency.value !== this.freq) this.f.frequency.value = this.freq;
			if (this.f && this.f.Q.value !== this.q) this.f.Q.value = this.q;
		}

		_getTarget(opt_param) {
			if (opt_param === undefined) {
				return function () { return this.f; }.bind(this);
			}
		}

		_construct() {
			this.f = this._quilt.context.createBiquadFilter();
			this.f.type = this.type;
			this.f.frequency.value = this.freq;
			this.f.Q.value = this.q;
			this._pluged = this.f;
		}

		_destruct() {
			disconnect(this.f);
			this.f = null;
		}

	}


	// ================================================ スコープ・パッチ


	class ScopePatch extends Patch {

		constructor(quilt, type, params) {
			this._quilt = quilt;
			this._targets = [];
			this._pluged = null;

			this.obj = par(params, 'obj', null);
			this.sync = par(params, 'sync', true);
			if (this.obj) {
				this.obj.setMode(type);
				this.obj.setSynchronized(this.sync);
			}
		}

		_update() {
			if (this.obj) {
				if (this.ana) this.obj.setAnalyserNode(this.ana);
				this.obj.setSynchronized(this.sync);
			}
		}

		_getTarget(opt_param) {
			if (opt_param === undefined) {
				return function () { return this.ana; }.bind(this);
			}
		}

		_construct() {
			this.ana = this._quilt.context.createAnalyser();
			if (this.obj) this.obj.setAnalyserNode(this.ana);
			this._pluged = this.ana;

			// for generating dummy signal
			var gain = this._quilt.context.createGain();
			gain.gain.value = 0;
			gain.connect(this.ana);
			var osc = this._quilt.context.createOscillator();
			osc.connect(gain);
			osc.start();
		}

		_destruct() {
			// 他のノードが割り当てられていないかチェック
			if (this.obj && this.obj.getAnalyserNode() === this.ana) {
				this.obj.setAnalyserNode(null);
			}
			if (this.ana) this.ana.disconnect();
			this.ana = null;
		}

	}


	// ================================================ エンベロープ・パッチ


	class EnvelopePatch extends Patch {

		constructor(quilt, params) {
			this._quilt = quilt;
			this._targets = [];
			this._pluged = null;

			this.attack = par(params, ['attack', 'at'], 0.5);
			this.decay = par(params, ['decay', 'dt'], 0.3);
			this.sustain = par(params, ['sustain', 'sl'], 0.5);
			this.release = par(params, ['release', 'rt'], 0.5);

			this._running = false;
		}

		_getTarget(opt_param) {
			if (opt_param === undefined) {
				return function () { return this.a; }.bind(this);
			}
		}

		_construct() {
			this.a = this._quilt.context.createGain();
			this.a.gain.setValueAtTime(0, 0);
			this._pluged = this.a;
		}

		_reserveStart(t) {
			var tp = t + this.attack;

			// 0 -> Attack
			this.a.gain.setValueAtTime(0, t);
			this.a.gain.linearRampToValueAtTime(1, tp);

			// Decay -> Sustain
			this.a.gain.setTargetAtTime(this.sustain, tp, this.decay);

			this._running = true;
			return true;
		}

		_keyOff(t, notifyShutdown) {
			// Cancel, just in case
			this.a.gain.cancelScheduledValues(t);
			// this.a.gain.setValueAtTime(this.sustain, t);

			// Release -> 0
			this.a.gain.setTargetAtTime(0, t, this.release);

			var a = this.a, that = this;
			var id = window.setInterval(function () {
				if (that._running && a.gain.value < 1e-3) {
					window.clearInterval(id);
					that._running = false;
					notifyShutdown();
				}
			}, (t - this._quilt.context.currentTime) * 1000);
		}

		_destruct() {
			disconnect(this.a);
			this.a = null;
		}

	}


	// ================================================ ユーティリティ関数


	// キー文字列正規化リスト（ハッシュ作成用）
	var NORM_LIST = [
	];

	// キー文字列正規化ハッシュ
	var NORM = (function () {
		var ret = {};
		for (var i = 0, I = NORM_LIST.length; i < I; i += 1) {
			var keys = NORM_LIST[i][0], full = NORM_LIST[i][1];
			ret[full] = full;
			for (var j = 0, J = keys.length; j < J; j += 1) {
				ret[keys[0]] = full;
			}
		}
		return ret;
	})();

	// キー文字列正規化関数
	var norm = function (str) {
		var ret = NORM[str];
		if (ret) return ret;
		return str;
	};

	// パラメーター処理
	var par = function (p, name, def) {
		if (!p) return def;
		if (Array.isArray(name)) {
			for (var i = 0; i < name.length; i += 1) {
				if (p[name[i]]) return p[name[i]];
			}
			return def;
		} else {
			return p[name] !== undefined ? p[name] : def;
		}
	};

	var disconnect = function () {
		for (var i = 0, I = arguments.length; i < I; i += 1) {
			var n = arguments[i];
			if (n && n.toString() === '[object GainNode]') {
				n.gain.value = 0;
			}
			if (n) setTimeout(function () {n.disconnect()}, 50);
		}
	};


	// ================================================ ライブラリとしてリターン


	var lib = CJSTRE || {};
	lib._OscillatorPatch   = OscillatorPatch;
	lib._MicrophonePatch   = MicrophonePatch;
	lib._SoundFilePatch    = SoundFilePatch;
	lib.SoundFile          = SoundFile;
	lib._NoisePatch        = NoisePatch;
	lib._GainPatch         = GainPatch;
	lib._EnvelopePatch     = EnvelopePatch;
	lib._BiquadFilterPatch = BiquadFilterPatch;
	lib._ScopePatch        = ScopePatch;
	return lib;

})();
