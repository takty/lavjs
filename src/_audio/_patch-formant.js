/**~ja
 * フォルマント・パッチ
 * @version 2020-12-02
 */
/**~en
 * Formant patch
 * @version 2020-12-02
 */
class FormantPatch extends FilterPatch {

	constructor(synth, params) {
		super();
		this._synth = synth;

		this._i  = this._synth.context().createBiquadFilter();
		this._f1 = this._synth.context().createBiquadFilter();
		this._f2 = this._synth.context().createBiquadFilter();
		this._f3 = this._synth.context().createBiquadFilter();
		this._g  = this._synth.context().createGain();
		this._i.connect(this._f1).connect(this._g);
		this._i.connect(this._f2).connect(this._g);
		this._i.connect(this._f3).connect(this._g);

		this._i.type            = 'lowpass';
		this._i.Q.value         = 1;
		this._i.frequency.value = 800;

		this._f1.type = 'bandpass';
		this._f2.type = 'bandpass';
		this._f3.type = 'bandpass';
		this._f1.frequency.value = params.frequency1 ?? 700;
		this._f2.frequency.value = params.frequency2 ?? 1200;
		this._f3.frequency.value = params.frequency3 ?? 2900;
		this._f1.Q.value = params.Q1 ?? 32;
		this._f2.Q.value = params.Q2 ?? 32;
		this._f3.Q.value = params.Q3 ?? 32;
	}

	getInput(key = null) {
		switch (key) {
			case 'Q1'        : return this._f1.Q;
			case 'Q2'        : return this._f2.Q;
			case 'Q3'        : return this._f3.Q;
			case 'frequency1': return this._f1.frequency;
			case 'frequency2': return this._f2.frequency;
			case 'frequency3': return this._f3.frequency;
		}
		return this._i;
	}

	getOutput(key = null) {
		return this._g;
	}

	set(key, val) {
		switch (key) {
			case 'Q1'        : this._f1.Q.value         = val; break;
			case 'Q2'        : this._f2.Q.value         = val; break;
			case 'Q3'        : this._f3.Q.value         = val; break;
			case 'frequency1': this._f1.frequency.value = val; break;
			case 'frequency2': this._f2.frequency.value = val; break;
			case 'frequency3': this._f3.frequency.value = val; break;
		}
	}

}