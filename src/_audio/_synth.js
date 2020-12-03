/**~ja
 * シンセ
 * @version 2020-12-03
 */
/**~en
 * Synth
 * @version 2020-12-03
 */
class Synth {

	constructor() {
		this._context = new AudioContext();
		this._patches = [];
		this._sources = [];
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

	speaker(params = {}) {
		if (!this._speaker) {
			this._speaker = new PATCH.SpeakerPatch(this, params);
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

	connect(...ps) {
		let lp = null;
		for (let p of ps) {
			p = this._flatten(p);
			if (lp) {
				for (const j of lp) {
					for (const i of p) {
						j.getOutput().connect(i.getInput());
					}
				}
			}
			lp = p;
		}
	}

	_flatten(p, ret = []) {
		const ps = Array.isArray(p) ? p : [p];
		for (let p of ps) {
			if (Array.isArray(p)) this._flatten(p, ret);
			else ret.push(p);
		}
		return ret;
	}

	now() {
		return this._context.currentTime;
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