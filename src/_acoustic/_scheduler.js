/**~ja
 * スケジューラー
 * @version 2021-05-21
 */
/**~en
 * Scheduler
 * @version 2021-05-21
 */
class Scheduler {

	/**~ja
	 * スケジューラーを作る
	 * @constructor
	 * @param {function():number} timestampFunction 現在時刻を返す関数
	 */
	/**~en
	 * Make a scheduler
	 * @constructor
	 * @param {function():number} timestampFunction Function returns timestamp
	 */
	constructor(timestampFunction) {
		this._timestamp = timestampFunction;
		this._intId = null;
		this._events = [];
	}

	/**~ja
	 * スケジュールされたタスクを行う（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Process scheduled task (used only in the library)
	 * @private
	 */
	_process() {
		const bgn = this._timestamp();
		const end = bgn + Scheduler.SCHEDULE_SPAN / 1000;

		const es = this._events;
		while (es.length && es[0].time < end) {
			const e = es.shift();
			e.callback({ sender: this, time: e.time }, ...e.args);
		}
	}

	/**~ja
	 * 現在の時刻を返す
	 * @return {number} 時刻
	 */
	/**~en
	 * Get the current time
	 * @return {number} Time
	 */
	time() {
		return this._timestamp();
	}

	/**~ja
	 * タスクを挿入する
	 * @param {number} time 時刻
	 * @param {function} callback タスク
	 * @param {...*} args タスクに渡す引数
	 * @return {Scheduler} このスケジューラー
	 */
	/**~en
	 * Insert a task
	 * @param {number} time Time
	 * @param {function} callback Task
	 * @param {...*} args Arguments for task
	 * @return {Scheduler} This scheduler
	 */
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

	/**~ja
	 * スケジューリングの次のタイミングで処理を行うようにタスクを追加する
	 * @param {number} time 時刻
	 * @param {function} callback タスク
	 * @param {...*} args タスクに渡す引数
	 * @return {Scheduler} このスケジューラー
	 */
	/**~en
	 * Add a task to process at the next timing of scheduling
	 * @param {number} time Time
	 * @param {function} callback Task
	 * @param {...*} args Arguments for task
	 * @return {Scheduler} This scheduler
	 */
	nextTick(time, callback, ...args) {
		const t = time ?? this._timestamp();
		this.insert(t + Scheduler.SCHEDULE_SPAN / 1000, callback, ...args);
		return this;
	}

	/**~ja
	 * スケジューリングを始める
	 * @param {function} callback タスク
	 * @param {...*} args タスクに渡す引数
	 * @return {Scheduler} このスケジューラー
	 */
	/**~en
	 * Start scheduling
	 * @param {function} callback Task
	 * @param {...*} args Arguments for task
	 * @return {Scheduler} This scheduler
	 */
	start(callback = null, ...args) {
		if (this._intId === null) {
			this._intId = setInterval(this._process.bind(this), Scheduler.TICK_INTERVAL);
			if (callback) {
				this.insert(this._timestamp(), callback, args);
				this._process();
			}
		} else if (callback) {
			this.insert(this._timestamp(), callback, args);
		}
		return this;
	}

	/**~ja
	 * スケジューリングを止める
	 * @param {boolean=} reset リセットするか
	 * @return {Scheduler} このスケジューラー
	 */
	/**~en
	 * Stop scheduling
	 * @param {boolean=} reset Whether to reset
	 * @return {Scheduler} This scheduler
	 */
	stop(reset = false) {
		if (this._intId !== null) {
			clearInterval(this._intId);
			this._intId = null;
		}
		if (reset) {
			this._events.splice(0);
		}
		return this;
	}

}

Scheduler.TICK_INTERVAL = 25;
Scheduler.SCHEDULE_SPAN = 100;