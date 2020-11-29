/**~ja
 * スケジューラー
 * @version 2020-11-29
 */
/**~en
 * Scheduler
 * @version 2020-11-29
 */
class Scheduler {

	constructor(context) {
		this._context = context;
		this._intId = 0;
		this._events = [];
	}

	_process() {
		const bgn = this._context.currentTime;
		const end = bgn + Scheduler.SCHEDULE_SPAN / 1000;

		const es = this._events;
		while (es.length && es[0].time < end) {
			const e = es.shift();
			e.callback({ sender: this, time: e.time }, ...e.args);
		}
	}

	nextTick(time, callback, ...args) {
		const t = time ?? this._context.currentTime;
		this.insert(t + Scheduler.SCHEDULE_SPAN / 1000, callback, ...args);
		return this;
	}

	insert(time, callback, ...args) {
		const e = { time, callback, args };
		
		const es = this._events;
		if (es.length === 0 || es[es.length - 1].time <= time) {
			es.push(e);
			return this;
		}
		for (let i = 0; i < es.length; i += 1) {
			if (time < es[i].time) {
				es.splice(i, 0, e);
				break;
			}
		}
		return this;
	}

	start(callback, ...arg) {
		const fn = this._process.bind(this);
		if (this._intId === 0) {
			this._intId = setInterval(fn, Scheduler.TICK_INTERVAL);
			if (callback) {
				this.insert(this._context.currentTime, callback, arg);
				fn();
			}
		} else if (callback) {
			this.insert(this._context.currentTime, callback, arg);
		}
		return this;
	}

	stop(reset) {
		if (this._intId !== 0) {
			clearInterval(this._intId);
			this._intId = 0;
		}
		if (reset) {
			this._events.splice(0);
		}
		return this;
	}

}

Scheduler.TICK_INTERVAL = 25;
Scheduler.SCHEDULE_SPAN = 100;