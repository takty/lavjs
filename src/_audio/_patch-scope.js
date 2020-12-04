/**~ja
 * スコープ・パッチ
 * @version 2020-12-05
 */
/**~en
 * Scope patch
 * @version 2020-12-05
 */
class ScopePatch extends Patch {

	constructor(synth, params) {
		super(synth);

		this._type   = params.type         ?? null;
		this._sync   = params.synchronized ?? true;
		this._widget = params.widget       ?? null;

		this._a = this._synth.context().createAnalyser();

		if (this._widget) this._update();
	}

	_update() {
		this._widget.setMode(this._type);
		this._widget.setSynchronized(this._sync);
		this._widget.setAnalyserNode(this._a);
	}

	getInput() {
		return this._a;
	}

	getOutput() {
		return this._a;
	}

}

assignAlias(ScopePatch);