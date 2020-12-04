/**~ja
 * フィルター・パッチ
 * @version 2020-12-04
 */
/**~en
 * Filter patch
 * @version 2020-12-04
 */
class BiquadFilterPatch extends Patch {

	constructor(synth, params) {
		super(synth);

		this._f = this._synth.context().createBiquadFilter();

		this._f.type            = params.type      ?? 'lowpass';
		this._f.frequency.value = params.frequency ?? 1000;
		this._f.Q.value         = params.Q         ?? 1;
	}

	getInput() {
		return this._f;
	}

	getOutput() {
		return this._f;
	}


	// -------------------------------------------------------------------------


	frequency(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._f.frequency;
		setParam(this._f.frequency, value, time, type);
		return this;
	}

	Q(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._f.Q;
		setParam(this._f.Q, value, time, type);
		return this;
	}

}

assignAlias(BiquadFilterPatch);