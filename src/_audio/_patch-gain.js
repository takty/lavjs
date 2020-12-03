/**~ja
 * ゲイン・パッチ
 * @version 2020-12-03
 */
/**~en
 * Gain patch
 * @version 2020-12-03
 */
class GainPatch extends Patch {

	constructor(synth, params) {
		super(synth);

		this._g = this._synth.context().createGain();
		this._g.gain.value = params.gain ?? 1;
	}

	getInput(key = null) {
		switch (key) {
			case 'gain': return this._g.gain;
		}
		return this._g;
	}

	getOutput() {
		return this._g;
	}

	set(key, val, time) {
		key = Patch._NORM_LIST[key] ?? key;
		val = Patch._NORM_LIST[val] ?? val;
		time ??= this._synth.now();
		switch (key) {
			case 'gain': this._g.gain.setValueAtTime(val, time); break;
		}
	}

}