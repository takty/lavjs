/**~ja
 * オシレーター・パッチ
 * @version 2020-12-03
 */
/**~en
 * Oscillator patch
 * @version 2020-12-03
 */
class OscillatorPatch extends SourcePatch {

	constructor(synth, params) {
		super(synth);

		this._o = this._synth.context().createOscillator();
		this._sw = this._synth.context().createGain();
		this._g = this._synth.context().createGain();
		this._o.connect(this._sw).connect(this._g);

		this._o.type            = params.type      ?? 'sine';
		this._o.frequency.value = params.frequency ?? 440;
		this._o.detune.value    = params.detune    ?? 0;
		this._sw.gain.value     = 0;
		this._g.gain.value      = params.gain      ?? 1;

		this._o.start();
	}

	getInput(key = null) {
		switch (key) {
			case 'frequency': return this._o.frequency;
			case 'detune'   : return this._o.detune;
			case 'gain'     : return this._g.gain;
		}
	}

	getOutput(key = null) {
		return this._g;
	}

	set(key, val, time) {
		key = Patch._NORM_LIST[key] ?? key;
		val = Patch._NORM_LIST[val] ?? val;
		time ??= this._synth.now();
		switch (key) {
			case 'type'     : this._o.type = val; break;
			case 'frequency': this._o.frequency.setValueAtTime(val, time); break;
			case 'detune'   : this._o.detune.setValueAtTime(val, time); break;
			case 'gain'     : this._g.gain.setValueAtTime(val, time); break;
		}
	}

	start(time) {
		time ??= this._synth.now();
		setValueAtTime(this._sw.gain, 1, time);
	}

	stop(time) {
		time ??= this._synth.now();
		setValueAtTime(this._sw.gain, 0, time);
	}

}