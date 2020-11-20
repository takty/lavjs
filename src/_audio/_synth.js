// ================================================ シンセ・クラス（CJSTRE.Synth）

var AUDIO_CONTEXT = (CJSTRE && CJSTRE.AUDIO_CONTEXT) ? CJSTRE.AUDIO_CONTEXT : new AudioContext();

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


class Synth {

	constructor() {
		this.context = new AudioContext();
		this.patches = [];

		this._scheduler = new Scheduler(this.context);
		this.isPlaying = false;
		this._isFinished = false;
	}

	speaker() {
		if (!this._speaker) {
			this._speaker = new PATCH.Speaker(this.context);
			this.patches.push(this._speaker);
		}
		return this._speaker;
	}

	group(ps) {
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
				p = new PATCH.OscillatorPatch(this, ct, params);
				break;
			case 'sine':
			case 'triangle':
			case 'sawtooth':
			case 'square':
				p = new PATCH.OscillatorPatch(this, t, params);
				break;

			case 'microphone':
				p = new PATCH.MicrophonePatch(this, params);
				break;
			case 'noise':
				p = new PATCH.NoisePatch(this, params);
				break;
			case 'file':
				p = new PATCH.SoundFilePatch(this, params);
				break;

			case 'gain':
				ct = par(params, 'type', 'constant');
				p = new PATCH.GainPatch(this, ct, params);
				break;
			case 'constant':
			case 'line':
			case 'exponential':
				p = new PATCH.GainPatch(this, t, params);
				break;
			case 'envelope':
				p = new PATCH.EnvelopePatch(this, params);
				break;

			case 'biquad':
				ct = par(params, 'type', 'lowpass');
				p = new PATCH.BiquadFilterPatch(this, ct, params);
				break;
			case 'lowpass':
			case 'highpass':
			case 'bandpass':
			case 'lowshelf':
			case 'highshelf':
			case 'peaking':
			case 'notch':
			case 'allpass':
				p = new PATCH.BiquadFilterPatch(this, t, params);
				break;

			case 'formant':
				p = new PATCH.FormantPatch(this, params);
				break;

			case 'scope':
				ct = par(params, 'type', 'waveform');
				p = new PATCH.ScopePatch(this, ct, params);
				break;
			case 'spectrum':
			case 'waveform':
				p = new PATCH.ScopePatch(this, t, params);
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
		var ps = this.patches;

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
		this._scheduler.start();
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
		this._scheduler.insertLazy(t, function () {
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
