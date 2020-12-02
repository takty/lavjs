/**~ja
 * 基本ノブ
 * @version 2020-12-02
 */
/**~en
 * Basic knob
 * @version 2020-12-02
 */
class BasicKnob extends Knob {

	constructor(audioParam, params) {
		super();
		this._ap = audioParam;
		this._ap.setValueAtTime(0, 0);

		this._type     = params.type     ?? 'constant';
		this._duration = params.duration ?? 0;
	}

	set(key, val) {
		switch (key) {
			case 'type'    : this._type     = val; break;
			case 'duration': this._duration = val; break;
		}
	}

	on(time) {
		const t = time + this._duration;
		switch (this._type) {
			case 'constant'   : this._ap.setValueAtTime(1, t);               break;
			case 'line'       : this._ap.linearRampToValueAtTime(1, t);      break;
			case 'exponential': this._ap.exponentialRampToValueAtTime(1, t); break;
		}
	}

	off(time) {
		const t = time + this._duration;
		switch (this._type) {
			case 'constant'   : this._ap.setValueAtTime(0, t);               break;
			case 'line'       : this._ap.linearRampToValueAtTime(0, t);      break;
			case 'exponential': this._ap.exponentialRampToValueAtTime(0, t); break;
		}
	}

}