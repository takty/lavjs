// ================================================ ノイズ・パッチ


class NoisePatch extends Patch {

	constructor(synth, params) {
		this._synth = synth;
		this._targets = [];
		this._pluged = null;

		this.amp = par(params, 'amp', 0.5);
	}

	_update() {
		if (this.a && this.a.gain.value !== this.amp) this.a.gain.value = this.amp;
	}

	_getTarget(opt_param) {
		if (opt_param === 'amp') {
			return function () { return this.a.gain; }.bind(this);
		}
	}

	_construct() {
		this.sp = this._synth.context.createScriptProcessor(2048, 0, 1);
		this.sp.onaudioprocess = function (e) {
			var output = e.outputBuffer.getChannelData(0);
			for (var i = 0; i < this.bufferSize; i += 1) {
				output[i] = 2 * (Math.random() - 0.5);
			}
		};
		this.a = this._synth.context.createGain();
		this.a.gain.value = this.amp;

		this.sp.connect(this.a);
		this._pluged = this.a;
	}

	_destruct() {
		disconnect(this.sp, this.a);
		this.sp = this.a = null;
	}

}
