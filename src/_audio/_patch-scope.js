/**~ja
 * スコープ・パッチ
 * @version 2020-12-02
 */
/**~en
 * Scope patch
 * @version 2020-12-02
 */
class ScopePatch extends Patch {

	constructor(synth, params) {
		super();
		this._synth = synth;

		this._type   = params.type         ?? null;
		this._sync   = params.synchronized ?? true;
		this._widget = params.widget       ?? null;

		this._a = this._synth.context().createAnalyser();

		this._update();
	}

	_update() {
		if (!this._widget) return;
		this._widget.setMode(this._type);
		this._widget.setSynchronized(this._sync);
		this._widget.setAnalyserNode(this._a);
	}

	getInput(key = null) {
		return this._a;
	}

	getOutput(key = null) {
		return this._a;
	}

	set(key, val) {
		key = Patch._NORM_LIST[key] ?? key;
		val = Patch._NORM_LIST[val] ?? val;
		switch (key) {
			case 'type'        : this._type   = val; this._update(); break;
			case 'synchronized': this._sync   = val; this._update(); break;
			case 'widget'      : this._widget = val; this._update(); break;
		}
	}

}