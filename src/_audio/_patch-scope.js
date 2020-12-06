/**~ja
 * スコープ・パッチ
 * @version 2020-12-06
 */
/**~en
 * Scope patch
 * @version 2020-12-06
 */
class ScopePatch extends Patch {

	constructor(synth, params) {
		super(synth);

		this._type   = params.type         ?? null;
		this._sync   = params.synchronized ?? true;
		this._widget = params.widget       ?? null;

		this._a = this._synth.context().createAnalyser();
		this._a.smoothingTimeConstant = 0.9;

		if (this._widget) this._update();
	}

	_update() {
		this._widget.setSynchronized(this._sync);
		this._widget.setDataSource(new DataSource(this._a));
	}

	getInput() {
		return this._a;
	}

	getOutput() {
		return this._a;
	}

}

assignAlias(ScopePatch);

class DataSource {

	constructor(a) { 
		this._a = a; 
	}

	size() { 
		return this._a.fftSize;
	}

	sampleRate() { 
		return this._a.context.sampleRate; 
	}

	getTimeDomainData(ret) { 
		this._a.getByteTimeDomainData(ret); 
	}

	getFrequencyData(ret) { 
		this._a.getByteFrequencyData(ret); 
	}

	minDecibels() { 
		return this._a.minDecibels; 
	}

	maxDecibels() { 
		return this._a.maxDecibels; 
	}

}