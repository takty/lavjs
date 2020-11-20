// ================================================ エンベロープ・パッチ


class EnvelopePatch extends Patch {

	constructor(synth, params) {
		this._synth = synth;
		this._targets = [];
		this._pluged = null;

		this.attack = par(params, ['attack', 'at'], 0.5);
		this.decay = par(params, ['decay', 'dt'], 0.3);
		this.sustain = par(params, ['sustain', 'sl'], 0.5);
		this.release = par(params, ['release', 'rt'], 0.5);

		this._running = false;
	}

	_getTarget(opt_param) {
		if (opt_param === undefined) {
			return function () { return this.a; }.bind(this);
		}
	}

	_construct() {
		this.a = this._synth.context.createGain();
		this.a.gain.setValueAtTime(0, 0);
		this._pluged = this.a;
	}

	_reserveStart(t) {
		var tp = t + this.attack;

		// 0 -> Attack
		this.a.gain.setValueAtTime(0, t);
		this.a.gain.linearRampToValueAtTime(1, tp);

		// Decay -> Sustain
		this.a.gain.setTargetAtTime(this.sustain, tp, this.decay);

		this._running = true;
		return true;
	}

	_keyOff(t, notifyShutdown) {
		// Cancel, just in case
		this.a.gain.cancelScheduledValues(t);
		// this.a.gain.setValueAtTime(this.sustain, t);

		// Release -> 0
		this.a.gain.setTargetAtTime(0, t, this.release);

		var a = this.a;
		var id = window.setInterval(() => {
			if (this._running && a.gain.value < 1e-3) {
				window.clearInterval(id);
				this._running = false;
				notifyShutdown();
			}
		}, (t - this._synth.context.currentTime) * 1000);
	}

	_destruct() {
		disconnect(this.a);
		this.a = null;
	}

}
