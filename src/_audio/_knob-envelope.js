/**~ja
 * エンベロープ・ノブ
 * @version 2020-12-02
 */
/**~en
 * Envelope knob
 * @version 2020-12-02
 */
class EnvelopeKnob extends Knob {

	constructor(synth, audioParam, params) {
		super();
		this._synth = synth;
		this._ap = audioParam;
		this._ap.setValueAtTime(0, 0);

		this._attack  = params.attack  ?? 0.5;
		this._decay   = params.decay   ?? 0.3;
		this._sustain = params.sustain ?? 0.5;
		this._release = params.release ?? 0.5;

		this._running = false;
	}

	set(key, val, time) {
		key = Patch._NORM_LIST[key] ?? key;
		val = Patch._NORM_LIST[val] ?? val;
		switch (key) {
			case 'attack' : this._attack  = val; break;
			case 'decay'  : this._decay   = val; break;
			case 'sustain': this._sustain = val; break;
			case 'release': this._release = val; break;
		}
		return this;
	}

	on(time) {
		time ??= this._synth.now();
		const t = time + this._attack;
		// 0 -> Attack
		this._ap.setValueAtTime(0, time);
		this._ap.linearRampToValueAtTime(1, t);
		// Decay -> Sustain
		this._ap.setTargetAtTime(this._sustain, t, this._decay);
		return this;
	}

	off(time) {
		time ??= this._synth.now();
		this._ap.cancelScheduledValues(time);
		// Release -> 0
		this._ap.setTargetAtTime(0, time, this._release);
		return this;
	}

}