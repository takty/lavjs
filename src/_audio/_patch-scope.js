// ================================================ スコープ・パッチ


class ScopePatch extends Patch {

	constructor(synth, type, params) {
		super();
		this._synth = synth;
		this._targets = [];
		this._pluged = null;

		this.obj = par(params, 'obj', null);
		this.sync = par(params, 'sync', true);
		if (this.obj) {
			this.obj.setMode(type);
			this.obj.setSynchronized(this.sync);
		}
	}

	_update() {
		if (this.obj) {
			if (this.ana) this.obj.setAnalyserNode(this.ana);
			this.obj.setSynchronized(this.sync);
		}
	}

	_getTarget(opt_param) {
		if (opt_param === undefined) {
			return function () { return this.ana; }.bind(this);
		}
	}

	_construct() {
		this.ana = this._synth.context.createAnalyser();
		if (this.obj) this.obj.setAnalyserNode(this.ana);
		this._pluged = this.ana;

		// for generating dummy signal
		var gain = this._synth.context.createGain();
		gain.gain.value = 0;
		gain.connect(this.ana);
		var osc = this._synth.context.createOscillator();
		osc.connect(gain);
		osc.start();
	}

	_destruct() {
		// 他のノードが割り当てられていないかチェック
		if (this.obj && this.obj.getAnalyserNode() === this.ana) {
			this.obj.setAnalyserNode(null);
		}
		if (this.ana) this.ana.disconnect();
		this.ana = null;
	}

}

