/**~ja
 * シンセ
 * @version 2020-12-02
 */
/**~en
 * Synth
 * @version 2020-12-02
 */
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
			this._speaker = new PATCH.SpeakerPatch(this);
			this._patches.push(this._speaker);
		}
		return this._speaker;
	}

	add(params) {
		const p = PATCH.Patch.make(this, params);
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

	makeInstrument(...id_ps) {
		return new Instrument(...id_ps);
	}

	get(id) {
		return this._id_ps[id];
	}

	start(time) {
		for (const p of this._sources) {
			p.start(time);
		}
	}

	stop(time) {
		for (const p of this._sources) {
			p.stop(time);
		}
	}

	play(time = null, dur = null) {
		this.start(time);
		if (time != null || dur != null) this.stop(time + dur);
		return this;
	}

}