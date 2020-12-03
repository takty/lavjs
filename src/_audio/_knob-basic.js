/**~ja
 * 基本ノブ
 * @version 2020-12-02
 */
/**~en
 * Basic knob
 * @version 2020-12-02
 */
class BasicKnob extends Knob {

	constructor(synth, audioParam, params) {
		super();
		this._synth = synth;
		this._ap = audioParam;
		this._ap.value = 0;

		this._type     = params.type     ?? 'constant';
		this._duration = params.duration ?? 0;
		this._base     = params.base     ?? 1;
	}

	set(key, val, time) {
		key = Patch._NORM_LIST[key] ?? key;
		val = Patch._NORM_LIST[val] ?? val;
		switch (key) {
			case 'type'    : this._type     = val; break;
			case 'duration': this._duration = val; break;
			case 'base'    : this._base     = val; break;
		}
		return this;
	}

	on(time) {
		time ??= this._synth.now();
		const t = time + this._duration;
		// this._ap.setTargetAtTime(0, time, DELAY);

		switch (this._type) {
			case 'constant': 
				// setValueAtTime(this._ap, this._base, time); 
				cancelAndHoldAtTime(this._ap, time);
				if (DELAY < time - this._lastOffTime) this._ap.setValueAtTime(0, time);
				this._ap.setTargetAtTime(this._base, time, DELAY);
				break;
			case 'linear': 
				cancelAndHoldAtTime(this._ap, time);
				// this._ap.setTargetAtTime(0, time, DELAY);
				this._ap.setValueAtTime(0, time);
				this._ap.linearRampToValueAtTime(this._base, t); 
				break;
			case 'exponential': 
				cancelAndHoldAtTime(this._ap, time);
				this._ap.setValueAtTime(1e-4, time);
				this._ap.exponentialRampToValueAtTime(this._base, t); 
				break;
		}
		return this;
	}

	off(time) {
		time ??= this._synth.now();
		const t = time + this._duration;

		switch (this._type) {
			case 'constant': 
				// setValueAtTime(this._ap, 0, time); 
				cancelAndHoldAtTime(this._ap, time);
				this._ap.setTargetAtTime(0, time, DELAY);
				this._lastOffTime = time;
				break;
			case 'linear': 
				cancelAndHoldAtTime(this._ap, time);
				this._ap.setTargetAtTime(this._base, time, DELAY);
				this._ap.linearRampToValueAtTime(0, t); 
				break;
			case 'exponential': 
				cancelAndHoldAtTime(this._ap, time);
				this._ap.setTargetAtTime(this._base, time, DELAY);
				this._ap.exponentialRampToValueAtTime(0.00001, t);
				break;
		}
		return this;
	}

}