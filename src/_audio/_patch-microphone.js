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

		this._f = this._synth.context().createBiquadFilter();
		this._g = this._synth.context().createGain();
		this._f.connect(this._g).connect(this._sw);

		navigator.getUserMedia({ audio: true, video: false }, (stream) => {
			this._m = this._synth.context().createMediaStreamSource(stream);
			this._m.connect(this._f);
		}, () => {});

		this._f.type            = params.type      ?? 'notch';
		this._f.Q.value         = params.Q         ?? 12;
		this._f.frequency.value = params.frequency ?? 0;
		this._g.gain.value      = params.gain      ?? 10;
	}


	// -------------------------------------------------------------------------


	frequency(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._o.frequency;
		setParam(this._o.frequency, value, time, type);
		return this;
	}

	Q(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._o.Q;
		setParam(this._o.Q, value, time, type);
		return this;
	}

	gain(value = null, time = this._synth.now(), type = null) {
		if (!value) return this._g.gain;
		setParam(this._g.gain, value, time, type);
		return this;
	}

}

assignAlias(MicrophonePatch);