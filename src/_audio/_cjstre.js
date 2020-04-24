/**~ja
 * シストル・ライブラリー（CJSTRE）
 * @author Takuto Yanagida
 * @version 2020-04-23
 *
 * 音を鳴らすための部品を作るライブラリです。
 */


var CJSTRE = (function() {

	'use strict';

	var AUDIO_CONTEXT = (CJSTRE && CJSTRE.AUDIO_CONTEXT) ? CJSTRE.AUDIO_CONTEXT : new AudioContext();
	var AUDIO_CONTEXT_TO_SCHEDULER = {};
	var AUDIO_CONTEXT_TO_SPEAKER = {};


	// ================================================ ライブラリ内使用関数


	// キー文字列正規化リスト（ハッシュ作成用）
	var NORM_LIST = [
		[['osc'], 'oscillator'],
		[['mic'], 'microphone'],
		[['sin'], 'sine'],
		[['tri'], 'triangle'],
		[['saw'], 'sawtooth'],
		[['sq'], 'square'],
		[['const'], 'constant'],
		[['exp'], 'exponential'],
		[['lpf'], 'lowpass'],
		[['hpf'], 'highpass'],
		[['bpf'], 'bandpass'],
		[['wave'], 'waveform'],
		[['spec'], 'spectrum'],
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
			return p[name] ? p[name] : def;
		}
	};


	// ================================================ スケジューラー・クラス（CJSTRE.Scheduler）


	class Scheduler {

		constructor(context) {
			this.TIME_INTERVAL = 0.025;
			this.RESERVATION_SPAN = 0.1;
			this.OFFSET_TIME = 0.005;

			this.context = context || AUDIO_CONTEXT;
			this.time = 0;

			this._timerId = 0;
			this._events = [];
		}

		insert(time, callback, args) {
			var es = this._events;
			var e = { time: time, callback: callback, args: args };

			if (es.length === 0 || es[es.length - 1].time <= time) {
				es.push(e);
			} else {
				for (var i = 0, I = es.length; i < I; i += 1) {
					if (time < es[i].time) {
						es.splice(i, 0, e);
						break;
					}
				}
			}
			return this;
		}

		insertLazy(time, callback, args) {
			return this.insert(time + this.RESERVATION_SPAN, callback, args);
		}

		start(callback) {
			var _process = function () {
				var es = this._events;
				var end = this.context.currentTime + this.RESERVATION_SPAN;

				while (es.length && es[0].time < end) {
					var e = es.shift();
					var t = Math.max(this.context.currentTime, e.time) + this.OFFSET_TIME;
					e.callback.apply(this, [{ sender: this, time: t }].concat(e.args));
				}
				this.time = this.context.currentTime;
			};

			if (this._timerId === 0) {
				this._timerId = setInterval(_process.bind(this), this.TIME_INTERVAL * 1000);
			}
			if (callback) {
				this.insert(0, callback);
			}
			return this;
		}

		stop(reset) {
			if (this._timerId !== 0) {
				clearInterval(this._timerId);
				this._timerId = 0;
			}
			if (reset) {
				this._events.splice(0);
			}
			return this;
		}

	}


	// ================================================ シーケンサー・クラス（CJSTRE.Sequencer）


	class Sequencer {

		constructor(params) {
			this.context    = par(params, ['context', 'ctx'], AUDIO_CONTEXT);
			this.bpm        = par(params, ['bpm', 'tempo'], 100);
			this.amp        = par(params, ['amp'], 1);
			this.inst       = par(params, ['instrument', 'inst'], null);
			this.swingRatio = par(params, ['swingRatio', 'sr'], 0.5);
			this.param      = par(params, ['param'], ['freq', 'amp', 'dur', 'opt']);

			this._scheduler = new Scheduler(this.context);
			this._lastTime  = 0.5;
		}

		set(params) {
			this.context    = par(params, ['context', 'ctx'], this.context);
			this.bpm        = par(params, ['bpm', 'tempo'], this.bpm);
			this.amp        = par(params, ['amp'], this.amp);
			this.inst       = par(params, ['instrument', 'inst'], this.inst);
			this.swingRatio = par(params, ['swingRatio', 'sr'], this.swingRatio);
			this.param      = par(params, ['param'], this.param);
		}

		note(name, val, vel, opt) {
			var wrapper = function (e, f, v, dur, opt) {
				this.inst(f, v, e.time, dur, opt);
			}.bind(this);

			var sch = this._scheduler;
			var spb = 60.0 / this.bpm;
			var dur = (val === undefined) ? spb : (4 * spb * (1 / val));
			var f, v = this.amp * ((vel === undefined) ? 0.5 : vel);
			var h = { freq: f, amp: v, dur: dur, opt: opt };

			if (Array.isArray(name)) {
				for (var i = 0, I = name.length; i < I; i += 1) {
					f = noteNumToFreq(noteNameToNoteNum(name[i]));
					h.freq = f;
					var a = hashToArray(h, this.param);
					sch.insert(sch.time + this._lastTime, wrapper, a);
				}
			} else {
				f = noteNumToFreq(noteNameToNoteNum(name));
				h.freq = f;
				var a = hashToArray(h, this.param);
				sch.insert(sch.time + this._lastTime, wrapper, a);
			}
			this._lastTime += dur;
			sch.start();
			return this;
		}

		rest(val) {
			var spb = 60.0 / this.bpm;
			var dur = (val === undefined) ? spb : (4 * spb * (1 / val));

			this._lastTime += dur;
			this._scheduler.start();
			return this;
		}

		playBeat(beats) {
			var j = 0;
			for (var i = 0, I = beats.length; i < I; i += 1) {
				var c = beats.charAt(i);
				if (c === '|') continue;
				var v = parseInt(c);
				var dur = (j % 4 < 2) ? this.swingRatio / 8 : (1 - this.swingRatio) / 8;
				if (0 <= v && v <= 9) {
					this.note('', 1 / dur, this.amp * (0.1 * (v + 1)));
				} else {
					this.rest(1 / dur);
				}
				j += 1;
			}
		}
	}

	var hashToArray = function (hash, keys) {
		var a = [];
		for (var i = 0; i < keys.length; i += 1) {
			a.push(hash[keys[i]]);
		}
		return a;
	};

	Sequencer.prototype.n = Sequencer.prototype.note;
	Sequencer.prototype.r = Sequencer.prototype.rest;


	// ================================================ シンセ・クラス（CJSTRE.Synth）


	class Synth {

		constructor(context) {
			this.context = context || AUDIO_CONTEXT;
			this.patches = [];

			var s = AUDIO_CONTEXT_TO_SCHEDULER[this.context];
			if (s === undefined) {
				s = new Scheduler(this.context);
				AUDIO_CONTEXT_TO_SCHEDULER[this.context] = s;
			}
			this.scheduler = s;
			this.isPlaying = false;
			this._isFinished = false;
		}

		speaker() {
			var that = this;
			var p = AUDIO_CONTEXT_TO_SPEAKER[this.context];
			if (p === undefined) {
				p = new Speaker(this.context);
				AUDIO_CONTEXT_TO_SPEAKER[this.context] = p;
			}
			this.patches.push(p);
			return p;
		}

		group(ps) {
			var that = this;
			var p = {
				_ps: Array.prototype.slice.call(arguments),
				plug: function (target, opt_param) {
					var tp = target._getTarget(opt_param);
					this._ps.forEach(function (e) { e._targets.push(tp); });
					return target;
				},
				unplug: function () {
					this._ps.forEach(function (e) { e._targets.length = 0; });
				}
			};
			return p;
		}

		add(type, params) {
			var p = null;
			var t = norm(type), ct;

			switch (t) {
				case 'oscillator':
					ct = par(params, 'type', 'sine');
					p = new CJSTRE._OscillatorPatch(this, ct, params);
					break;
				case 'sine':
				case 'triangle':
				case 'sawtooth':
				case 'square':
					p = new CJSTRE._OscillatorPatch(this, t, params);
					break;

				case 'microphone':
					p = new CJSTRE._MicrophonePatch(this, params);
					break;
				case 'noise':
					p = new CJSTRE._NoisePatch(this, params);
					break;
				case 'file':
					p = new CJSTRE._SoundFilePatch(this, params);
					break;

				case 'gain':
					ct = par(params, 'type', 'constant');
					p = new CJSTRE._GainPatch(this, ct, params);
					break;
				case 'constant':
				case 'line':
				case 'exponential':
					p = new CJSTRE._GainPatch(this, t, params);
					break;
				case 'envelope':
					p = new CJSTRE._EnvelopePatch(this, params);
					break;

				case 'biquad':
					ct = par(params, 'type', 'lowpass');
					p = new CJSTRE._BiquadFilterPatch(this, ct, params);
					break;
				case 'lowpass':
				case 'highpass':
				case 'bandpass':
				case 'lowshelf':
				case 'highshelf':
				case 'peaking':
				case 'notch':
				case 'allpass':
					p = new CJSTRE._BiquadFilterPatch(this, t, params);
					break;

				case 'formant':
					p = new CJSTRE._FormantPatch(this, params);
					break;

				case 'scope':
					ct = par(params, 'type', 'waveform');
					p = new CJSTRE._ScopePatch(this, ct, params);
					break;
				case 'spectrum':
				case 'waveform':
					p = new CJSTRE._ScopePatch(this, t, params);
					break;
			}
			if (p === null) {
				throw 'Cannot make \'' + type + '\' patch!';
			}
			this.patches.push(p);
			return p;
		}

		start(time) {
			if (this.isPlaying || this._isFinished) return this;
			this.isPlaying = true;
			var t = (time == null) ? this.context.currentTime : time; // null or undefined
			var ps = this.patches, that = this;

			this.suppressingCount = 0;
			for (var i = 0, I = ps.length; i < I; i += 1) {
				if (ps[i]._construct) ps[i]._construct();
			}
			for (var i = 0, I = ps.length; i < I; i += 1) {
				var p = ps[i];
				p._targets.forEach(function (e) {
					var t = e(); // 実行すると有効な接続先が得られる
					p._pluged.connect(t);
					if (t.value !== undefined && p.base !== null) {
						t.value = p.base;
					}
				});
			}
			for (var i = 0, I = ps.length; i < I; i += 1) {
				if (ps[i]._reserveStart) {
					var c = ps[i]._reserveStart(t);
					if (c) this.suppressingCount += 1;
				}
			}
			this.scheduler.start();
			return this;
		}

		stop(time) {
			if (Number.isNaN(time)) return;
			if (!this.isPlaying) return this;
			this.isPlaying = false;

			var t = (time == null) ? this.context.currentTime : time; // null or undefined
			var ps = this.patches;

			if (this.suppressingCount > 0) {
				for (var i = 0, I = ps.length; i < I; i += 1) {
					if (ps[i]._keyOff) ps[i]._keyOff(t, this._notifyShutdown.bind(this));
				}
			} else {
				this._shutdown(t);
			}
			return this;
		}

		_notifyShutdown(time) {
			var t = (time === undefined) ? this.context.currentTime : time;

			this.suppressingCount -= 1;
			if (this.suppressingCount <= 0) {
				this._shutdown(t);
			}
		}

		_shutdown(t) {
			var ps = this.patches;
			for (var i = 0, I = ps.length; i < I; i += 1) {
				if (ps[i]._reserveStop) ps[i]._reserveStop(t);
			}
			this.scheduler.insertLazy(t, function () {
				for (var i = 0, I = ps.length; i < I; i += 1) {
					ps[i]._destruct();
				}
			});
			this._isFinished = true;
			return this;
		}

		play(time, dur) {
			this.start(time);
			if (time != null || dur != null) this.stop(time + dur);
			return this;
		}

	}


	// ================================================ スピーカー・クラス（CJSTRE.Speaker）


	class Speaker extends Patch {

		constructor(ctx) {
			this._targets = [];
			this.g = ctx.createGain();
			this.g.connect(ctx.destination);
			this._pluged = this.g;
		}

		set(ps_key, undef_val) {
			return this;
		}

		plug(target, opt_param) {
			var t = target._getTarget(opt_param);
			this._targets.push(t);
			return target;
		}

		unplug() {
			this._targets.length = 0;
		}

		_getTarget(opt_param) {
			if (opt_param === undefined) {
				var gain = this.g;
				return function () { return gain; };
			}
		}

		_construct() { }

		_destruct() { }

	}


	// ================================================ ユーティリティ関数


	// ノート名をノート番号に変換する
	var noteNameToNoteNum = function (name) {
		if (!name || name.length === 0) return 69;
		var c = name[0].toUpperCase();
		var n = {'C': 60, 'D': 62, 'E': 64, 'F': 65, 'G': 67, 'A': 69, 'B': 71}[c];
		var o = parseInt(name.substr(1));
		if (!Number.isNaN(o)) n += (o - 4) * 12;
		n += name.split('#').length - 1;
		n -= name.split('b').length - 1;
		return n;
	};

	// ノート番号を周波数に変換する
	var noteNumToFreq = function (num) {
		return 440 * Math.pow(2, (num - 69) / 12);
	};


	// ================================================ ライブラリとしてリターン


	var lib = CJSTRE || {};
	lib.AUDIO_CONTEXT     = AUDIO_CONTEXT;
	lib.Scheduler         = Scheduler;
	lib.Sequencer         = Sequencer;
	lib.Synth             = Synth;
	lib.noteNameToNoteNum = noteNameToNoteNum;
	lib.noteNumToFreq     = noteNumToFreq;
	return lib;

})();
