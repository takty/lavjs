/**~ja
 * エンベロープ・ノブ
 * @version 2020-12-02
 */
/**~en
 * Envelope knob
 * @version 2020-12-02
 */
class EnvelopeKnob extends Knob {

	constructor(audioParam, params) {
		super();
		this._ap = audioParam;
		this._ap.setValueAtTime(0, 0);

		this._attack  = params.attack  ?? 0.5;
		this._decay   = params.decay   ?? 0.3;
		this._sustain = params.sustain ?? 0.5;
		this._release = params.release ?? 0.5;

		this._running = false;
	}

	set(key, val) {
		switch (key) {
			case 'attack' : this._attack  = val; break;
			case 'decay'  : this._decay   = val; break;
			case 'sustain': this._sustain = val; break;
			case 'release': this._release = val; break;
		}
	}

	on(time) {
		const t = time + this._attack;
		// 0 -> Attack
		this._ap.setValueAtTime(0, time);
		this._ap.linearRampToValueAtTime(1, t);
		// Decay -> Sustain
		this._ap.setTargetAtTime(this._sustain, t, this._decay);
	}

	off(time) {
		this._ap.cancelScheduledValues(time);
		// Release -> 0
		this._ap.setTargetAtTime(0, time, this._release);
	}

}