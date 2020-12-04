// ================================================ シーケンサー・クラス（Sequencer）


// パラメーター処理
const par = function (p, name, def) {
	if (!p) return def;
	if (Array.isArray(name)) {
		for (const n of name) {
			if (p[n]) return p[n];
		}
		return def;
	} else {
		return p[name] ?? def;
	}
};


// ノート名をノート番号に変換する
var noteNameToNoteNum = function (name) {
	if (!name || name.length === 0) return 69;
	var c = name[0].toUpperCase();
	var n = { 'C': 60, 'D': 62, 'E': 64, 'F': 65, 'G': 67, 'A': 69, 'B': 71 }[c];
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

class Sequencer {

	constructor(context, params) {
		this.context = context;
		this.bpm = par(params, ['bpm', 'tempo'], 100);
		this.amp = par(params, ['amp'], 1);
		this.inst = par(params, ['instrument', 'inst'], null);
		this.play = par(params, ['play'], null);
		this.stop = par(params, ['stop'], null);
		this.swingRatio = par(params, ['swingRatio', 'sr'], 0.5);
		this.param = par(params, ['param'], ['freq', 'amp', 'dur', 'opt']);

		this._scheduler = new Scheduler(this.context);
		this._lastTime = context.currentTime + 0.5;
	}

	set(params) {
		this.context = par(params, ['context', 'ctx'], this.context);
		this.bpm = par(params, ['bpm', 'tempo'], this.bpm);
		this.amp = par(params, ['amp'], this.amp);
		this.inst = par(params, ['instrument', 'inst'], this.inst);
		this.play = par(params, ['play'], this.play);
		this.stop = par(params, ['stop'], this.stop);
		this.swingRatio = par(params, ['swingRatio', 'sr'], this.swingRatio);
		this.param = par(params, ['param'], this.param);
	}

	note(name, val, vel, opt) {
		var wrapper = function (e, f, v, dur, opt) {
			// this.inst(f, v, e.time, dur, opt);
			this.play(this.inst, e.time, f, v, opt);
			if (this.stop) this.stop(this.inst, e.time + dur);
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
				// sch.insert(sch.getCurrentTime() + this._lastTime, wrapper, ...a);
				sch.insert(this._lastTime, wrapper, ...a);
			}
		} else {
			f = noteNumToFreq(noteNameToNoteNum(name));
			h.freq = f;
			var a = hashToArray(h, this.param);
			// sch.insert(sch._time + this._lastTime, wrapper, ...a);
			sch.insert(this._lastTime, wrapper, ...a);
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