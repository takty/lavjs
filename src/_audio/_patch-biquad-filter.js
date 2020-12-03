/**~ja
 * フィルター・パッチ
 * @version 2020-12-02
 */
/**~en
 * Filter patch
 * @version 2020-12-02
 */
class BiquadFilterPatch extends Patch {

	constructor(synth, params) {
		super(synth);

		this._f = this._synth.context().createBiquadFilter();

		this._f.type            = params.type      ?? 'lowpass';
		this._f.Q.value         = params.Q         ?? 1;
		this._f.frequency.value = params.frequency ?? 1000;
	}

	getInput(key = null) {
		switch (key) {
			case 'Q'        : return this._f.Q;
			case 'frequency': return this._f.frequency;
		}
		return this._f;
	}

	getOutput(key = null) {
		return this._f;
	}

	set(key, val, time) {
		key = Patch._NORM_LIST[key] ?? key;
		val = Patch._NORM_LIST[val] ?? val;
		time ??= this._synth.now();
		switch (key) {
			case 'type'     : this._f.type = val; break;
			case 'Q'        : this._f.Q.setValueAtTime(val, time); break;
			case 'frequency': this._f.frequency.setValueAtTime(val, time); break;
		}
	}

}