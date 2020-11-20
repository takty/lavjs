// ================================================ スピーカー・クラス（PATCH.Speaker）


class Speaker extends Patch {

	constructor(ctx) {
		this._targets = [];
		this.g = ctx.createGain();
		this.g.connect(ctx.destination);
		this._pluged = this.g;
	}

	set(ps_key, undef_val) {
		return this;
	}

	plug(target, opt_param) {
		var t = target._getTarget(opt_param);
		this._targets.push(t);
		return target;
	}

	unplug() {
		this._targets.length = 0;
	}

	_getTarget(opt_param) {
		if (opt_param === undefined) {
			var gain = this.g;
			return function () { return gain; };
		}
	}

	_construct() { }

	_destruct() { }

}
