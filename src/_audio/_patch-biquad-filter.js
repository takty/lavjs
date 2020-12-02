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
		super();
		this._synth = synth;

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

	set(key, val) {
		key = Patch._NORM_LIST[key] ?? key;
		val = Patch._NORM_LIST[val] ?? val;
		switch (key) {
			case 'type'     : this._f.type            = val; break;
			case 'Q'        : this._f.Q.value         = val; break;
			case 'frequency': this._f.frequency.value = val; break;
		}
	}

}