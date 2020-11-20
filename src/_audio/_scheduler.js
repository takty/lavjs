// ================================================ スケジューラー・クラス（Scheduler）


class Scheduler {

	constructor(context) {
		this.TIME_INTERVAL = 0.025;
		this.RESERVATION_SPAN = 0.1;
		this.OFFSET_TIME = 0.005;

		this.context = context;
		this.time = 0;

		this._timerId = 0;
		this._events = [];
	}

	insert(time, callback, args) {
		var es = this._events;
		var e = { time: time, callback: callback, args: args };

		if (es.length === 0 || es[es.length - 1].time <= time) {
			es.push(e);
		} else {
			for (var i = 0, I = es.length; i < I; i += 1) {
				if (time < es[i].time) {
					es.splice(i, 0, e);
					break;
				}
			}
		}
		return this;
	}

	insertLazy(time, callback, args) {
		return this.insert(time + this.RESERVATION_SPAN, callback, args);
	}

	start(callback) {
		var _process = function () {
			var es = this._events;
			var end = this.context.currentTime + this.RESERVATION_SPAN;

			while (es.length && es[0].time < end) {
				var e = es.shift();
				var t = Math.max(this.context.currentTime, e.time) + this.OFFSET_TIME;
				e.callback.apply(this, [{ sender: this, time: t }].concat(e.args));
			}
			this.time = this.context.currentTime;
		};

		if (this._timerId === 0) {
			this._timerId = setInterval(_process.bind(this), this.TIME_INTERVAL * 1000);
		}
		if (callback) {
			this.insert(0, callback);
		}
		return this;
	}

	stop(reset) {
		if (this._timerId !== 0) {
			clearInterval(this._timerId);
			this._timerId = 0;
		}
		if (reset) {
			this._events.splice(0);
		}
		return this;
	}

}
