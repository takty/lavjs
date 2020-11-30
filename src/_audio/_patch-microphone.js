/**~ja
 * マイク・パッチ
 * @version 2020-11-30
 */
/**~en
 * Microphone patch
 * @version 2020-11-30
 */
class MicrophonePatch extends SourcePatch {

	constructor(synth, params) {
		super();
		this._synth = synth;

		this._s = this._synth.context().createGain();
		this._f = this._synth.context().createBiquadFilter();
		this._g = this._synth.context().createGain();
		this._s.connect(this._f).connect(this._g);

		navigator.getUserMedia({ audio: true, video: false }, (stream) => {
			this._m = this._synth.context.createMediaStreamSource(stream);
			this._m.connect(this._s);
		}, () => {});

		this._s.gain.value      = 0;
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

	getOutput() {
		return this._g;
	}

	set(key, val) {
		switch (key) {
			case 'type'     : this._f.type            = val; break;
			case 'Q'        : this._f.Q.value         = val; break;
			case 'frequency': this._f.frequency.value = val; break;
			case 'gain'     : this._g.gain.value      = val; break;
		}
	}

	start(time) {
		this._s.setValueAtTime(1, time);
	}

	stop(time) {
		this._s.setValueAtTime(0, time);
	}

}