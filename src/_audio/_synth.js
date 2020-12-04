/**~ja
 * シンセ
 * @version 2020-12-05
 */
/**~en
 * Synth
 * @version 2020-12-05
 */
class Synth {

	constructor() {
		this._context = new AudioContext();
		this._patches = [];
		this._sources = [];
	}

	/**~ja
	 * オーディオ・コンテキストを返す
	 * @return {AudioContext} オーディオ・コンテキスト
	 */
	/**~en
	 * Get the audio context
	 * @return {AudioContext} Audio context
	 */
	context() {
		return this._context;
	}

	now() {
		return this._context.currentTime;
	}

	speaker(params = {}) {
		if (!this._speaker) {
			this._speaker = new PATCH.SpeakerPatch(this, params);
			this._patches.push(this._speaker);
		}
		return this._speaker;
	}

	make(type, params = {}) {
		const p = PATCH.Patch.make(this, type, params);
		this._patches.push(p);
		if (p instanceof PATCH.SourcePatch) {
			this._sources.push(p);
		}
		return p;
	}

	connect(...ps) {
		let lp = null;
		for (let p of ps) {
			p = Array.isArray(p) ? p : [p];
			if (lp) {
				for (const j of lp) {
					for (const i of p) j.getOutput().connect(i.getInput());
				}
			}
			lp = p;
		}
	}

	start(time = this._context.currentTime) {
		for (const p of this._sources) {
			p.start(time);
		}
	}

	stop(time = this._context.currentTime) {
		for (const p of this._sources) {
			p.stop(time);
		}
	}

}