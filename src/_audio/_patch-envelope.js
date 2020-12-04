/**~ja
 * エンベロープ・パッチ
 * @version 2020-12-04
 */
/**~en
 * Envelope patch
 * @version 2020-12-04
 */
class EnvelopePatch extends Patch {

	constructor(synth, params) {
		super(synth);

		this._g = this._synth.context().createGain();
		this._g.gain.value = 0;

		this._attack  = params.attack  ?? 0.02;
		this._decay   = params.decay   ?? 0.4;
		this._sustain = params.sustain ?? 0.05;
		this._release = params.release ?? 0.8;
	}

	getInput() {
		return this._g;
	}

	getOutput() {
		return this._g;
	}


	// -------------------------------------------------------------------------


	on(time = this._synth.now()) {
		// Reset to 0;
		this._g.gain.setTargetAtTime(0, time, DELAY);

		// 0 -> Attack
		this._g.gain.linearRampToValueAtTime(1, time + this._attack);
		// Decay -> Sustain
		this._g.gain.setTargetAtTime(this._sustain, time + this._attack, this._decay);
		return this;
	}

	off(time = this._synth.now()) {
		this._g.gain.cancelScheduledValues(time);
		// Release -> 0
		this._g.gain.setTargetAtTime(0, time, this._release);
		return this;
	}

}

assignAlias(EnvelopePatch);