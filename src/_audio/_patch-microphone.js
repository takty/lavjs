/**~ja
 * マイク・パッチ
 * @version 2020-12-03
 */
/**~en
 * Microphone patch
 * @version 2020-12-03
 */
class MicrophonePatch extends SourcePatch {

	constructor(synth, params) {
		super(synth);

		this._sw = this._synth.context().createGain();
		this._f = this._synth.context().createBiquadFilter();
		this._g = this._synth.context().createGain();
		this._sw.connect(this._f).connect(this._g);

		navigator.getUserMedia({ audio: true, video: false }, (stream) => {
			this._m = this._synth.context().createMediaStreamSource(stream);
			this._m.connect(this._sw);
		}, () => {});

		this._sw.gain.value     = 0;
		this._f.type            = 'notch';
		this._f.Q.value         = params.Q         ?? 12;
		this._f.frequency.value = params.frequency ?? 0;
		this._g.gain.value      = params.gain      ?? 10;
	}

	getInput(key = null) {
		switch (key) {
			case 'Q'        : return this._f.Q;
			case 'frequency': return this._f.frequency;
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
			case 'type'     : this._f.type            = val; break;
			case 'Q'        : this._f.Q.setValueAtTime(val, time); break;
			case 'frequency': this._f.frequency.setValueAtTime(val, time); break;
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