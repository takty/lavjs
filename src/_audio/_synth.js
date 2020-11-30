// ================================================ シンセ・クラス（SYNTH.Synth）


class Synth {

	constructor() {
		this._context = new AudioContext();
		this._patches = [];
		this._sources = [];
		this._id_ps = {};
	}

	/**~ja
	 * オーディオ・コンテキストを返す
	 * @return {CanvasRenderingContext2D} オーディオ・コンテキスト
	 */
	/**~en
	 * Get the audio context
	 * @return {CanvasRenderingContext2D} Audio context
	 */
	context() {
		return this._context;
	}

	speaker() {
		if (!this._speaker) {
			this._speaker = new PATCH.Speaker(this);
			this._patches.push(this._speaker);
		}
		return this._speaker;
	}

	// group(ps) {
	// 	var p = {
	// 		_ps: Array.prototype.slice.call(arguments),
	// 		plug: function (target, opt_param) {
	// 			var tp = target._getTarget(opt_param);
	// 			this._ps.forEach(function (e) { e._targets.push(tp); });
	// 			return target;
	// 		},
	// 		unplug: function () {
	// 			this._ps.forEach(function (e) { e._targets.length = 0; });
	// 		}
	// 	};
	// 	return p;
	// }

	add(type, params) {
		const p = PATCH.Patch.create(this, type, params);
		this._patches.push(p);
		if (p instanceof PATCH.SourcePatch) {
			this._sources.push(p);
		}
		return p;
	}

	connect(...id_ps) {
		let lp = null;
		for (let p of id_ps) {
			let id;
			if (Array.isArray(p)) {
				[id, p] = p;
				this._id_ps[id] = p;
			}
			if (lp) lp.getOutput().connect(p.getInput());
			lp = p;
		}
	}

	newInstrument(...id_ps) {
		return new Instrument(...id_ps);
	}

	get(id) {
		return this._id_ps[id];
	}

	start(time) {
		for (const p of this._sources) {
			p.start(time);
		}
		// if (this.isPlaying || this._isFinished) return this;
		// this.isPlaying = true;
		// var t = (time == null) ? this.context.currentTime : time; // null or undefined
		// var ps = this.patches;

		// this.suppressingCount = 0;
		// for (var i = 0, I = ps.length; i < I; i += 1) {
		// 	if (ps[i]._construct) ps[i]._construct();
		// }
		// for (var i = 0, I = ps.length; i < I; i += 1) {
		// 	var p = ps[i];
		// 	p._targets.forEach(function (e) {
		// 		var t = e(); // 実行すると有効な接続先が得られる
		// 		p._pluged.connect(t);
		// 		if (t.value !== undefined && p.base !== null) {
		// 			t.value = p.base;
		// 		}
		// 	});
		// }
		// for (var i = 0, I = ps.length; i < I; i += 1) {
		// 	if (ps[i]._reserveStart) {
		// 		var c = ps[i]._reserveStart(t);
		// 		if (c) this.suppressingCount += 1;
		// 	}
		// }
		// this._scheduler.start();
		// return this;
	}

	stop(time) {
		for (const p of this._sources) {
			p.stop(time);
		}
		// if (Number.isNaN(time)) return;
		// if (!this.isPlaying) return this;
		// this.isPlaying = false;

		// var t = (time == null) ? this.context.currentTime : time; // null or undefined
		// var ps = this.patches;

		// if (this.suppressingCount > 0) {
		// 	for (var i = 0, I = ps.length; i < I; i += 1) {
		// 		if (ps[i]._keyOff) ps[i]._keyOff(t, this._notifyShutdown.bind(this));
		// 	}
		// } else {
		// 	this._shutdown(t);
		// }
		// return this;
	}

	// _notifyShutdown(time) {
	// 	var t = (time === undefined) ? this.context.currentTime : time;

	// 	this.suppressingCount -= 1;
	// 	if (this.suppressingCount <= 0) {
	// 		this._shutdown(t);
	// 	}
	// }

	// _shutdown(t) {
	// 	var ps = this.patches;
	// 	for (var i = 0, I = ps.length; i < I; i += 1) {
	// 		if (ps[i]._reserveStop) ps[i]._reserveStop(t);
	// 	}
	// 	this._scheduler.nextTick(t, function () {
	// 		for (var i = 0, I = ps.length; i < I; i += 1) {
	// 			ps[i]._destruct();
	// 		}
	// 	});
	// 	this._isFinished = true;
	// 	return this;
	// }

	play(time = null, dur = null) {
		this.start(time);
		if (time != null || dur != null) this.stop(time + dur);
		return this;
	}

}
