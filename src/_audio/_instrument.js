class Instrument {

	constructor(...id_ps) {
		this._id_ps = {};
		this._sources = [];

		this._addPatches(id_ps);
	}

	_addPatches(id_ps) {
		for (let p of id_ps) {
			let id;
			if (Array.isArray(p)) {
				[id, p] = p;
				this._id_ps[id] = p;
			}
			if (p instanceof AudioScheduledSourceNode) this._sources.push(p);
		}
	}

	get(id) {
		return this._id_ps[id];
	}

	start(time = 0) {
		for (const p of this._sources) {
			p.start(time);
		}
	}

	stop(time = 0) {
		for (const p of this._sources) {
			p.stop(time);
		}
	}

	play(time = null, dur = null) {
		this.start(time);
		if (time !== null || dur !== null) this.stop(time + dur);
		return this;
	}

}