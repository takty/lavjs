/**~ja
 * シーケンサー
 * @version 2021-02-05
 */
/**~en
 * Sequencer
 * @version 2021-02-05
 */
class Sequencer {

	/**~ja
	 * シーケンサーを作る
	 * @param {Synth|AudioContext} ctx シンセ／オーディオ・コンテキスト
	 * @param {object} params パラメーター
	 */
	/**~en
	 * Make a sequencer
	 * @param {Synth|AudioContext} ctx Synth, or audio context
	 * @param {object} params Parameters
	 */
	constructor(ctx, params) {
		const nowFn = (ctx instanceof Synth) ? (() => ctx.time()) : (() => ctx.currentTime);
		this._scheduler = new Scheduler(nowFn);
		this._lastTime = 0;
		this._buf = [];

		params = normalizeParams(params);
		this._inst       = params.instrument ?? null;
		this._play       = params.play       ?? null;
		this._tune       = params.tune       ?? null;
		this._stop       = params.stop       ?? null;
		this._bpm        = params.bpm        ?? 100;
		this._gain       = params.gain       ?? 1;
		this._swingRatio = params.swingRatio ?? 0.5;

		this._octave   = 4;
		this._length   = 4;
		this._volume   = 5;
		this._gateTime = 10;
		this._opts     = [];
	}

	/**~ja
	 * 再生する
	 * @param {number=} delay 遅延時間 [s]
	 */
	/**~en
	 * Play
	 * @param {number=} delay Delay time [s]
	 */
	play(delay = 0.5) {
		const now = this._scheduler.time() + delay;
		for (const b of this._buf) {
			const [t, fn] = b;
			this._scheduler.insert(now + t, fn);
		}
		this._scheduler.start();
	}

	/**~ja
	 * リセットする
	 */
	/**~en
	 * Reset
	 */
	reset() {
		this._scheduler.stop(true);
		this._lastTime = 0;
		this._buf = [];
	}


	// -------------------------------------------------------------------------


	/**~ja
	 * 楽譜をセットする
	 * @param {string} notes 楽譜を表す文字列
	 * @return {Sequencer} このシーケンサー
	 */
	/**~en
	 * Set score
	 * @param {string} notes String representing score
	 * @return {Sequencer} This sequencer
	 */
	setScore(notes) {
		let ps = 0;
		let dur = 0;
		for (let i = 0; i < notes.length; i += 1) {
			const ch = notes[i];
			switch (ch) {
				case 'C': case 'D': case 'E': case 'F': case 'G': case 'A': case 'B':
					[ps,  i] = this._getPitchShift(notes, i + 1);
					[dur, i] = this._getLength(notes, i + 1);
					this._sound(dur, ch, ps);
					this._lastTime += dur;
					break;
				case 'R':
					[dur, i] = this._getLength(notes, i + 1);
					this._lastTime += dur;
					break;
				case 'Q':
					[this._gateTime, i] = this._getNumber(notes, i + 1, this._gateTime);
					break;
				case 'L':
					[this._length, i] = this._getNumber(notes, i + 1, this._length);
					break;
				case 'O':
					[this._octave, i] = this._getNumber(notes, i + 1, this._octave);
					break;
				case 'V':
					[this._volume, i] = this._getNumber(notes, i + 1, this._volume);
					break;
				case 'T':
					[this._bpm, i] = this._getNumber(notes, i + 1, this._bpm);
					break;
				case '>':
					this._octave += 1;
					break;
				case '<':
					this._octave -= 1;
					break;
				case '{':
					[this._opts, i] = this._getOption(notes, i + 1);
					break;
				case ' ': case '|':
					break;
				default:
					throw new Error(`${notes.slice(0, i)} ${notes[i]} ${notes.slice(i + 1)}`);
			}
		}
		return this;
	}

	/**~ja
	 * フラットとシャープを取得する（ライブラリ内だけで使用）
	 * @private
	 * @param {string} str 楽譜を表す文字列
	 * @param {number} idx 調べるインデックス
	 * @return {[number, number]} 音程のズレと調べ終わったインデックス
	 */
	/**~en
	 * Get flats and sharps (used only in the library)
	 * @private
	 * @param {string} str String representing score
	 * @param {number} idx Index to be checked
	 * @return {[number, number]} Pitch shift and checked index
	 */
	_getPitchShift(str, idx) {
		Sequencer.RE_PITCH_SHIFT.lastIndex = idx;
		const res = Sequencer.RE_PITCH_SHIFT.exec(str);
		if (res === null) return [0, idx - 1];
		let v = 0;
		for (const c of res[0]) {
			if (c === '+' || c === '#') v += 1;
			else if (c === '-') v -= 1;
		}
		return [v, Sequencer.RE_PITCH_SHIFT.lastIndex - 1];
	}

	/**~ja
	 * 数値を取得する（ライブラリ内だけで使用）
	 * @private
	 * @param {string} str 楽譜を表す文字列
	 * @param {number} idx 調べるインデックス
	 * @return {[number, number]} 数値と調べ終わったインデックス
	 */
	/**~en
	 * Get number (used only in the library)
	 * @private
	 * @param {string} str String representing score
	 * @param {number} idx Index to be checked
	 * @return {[number, number]} Number and checked index
	 */
	_getNumber(str, idx, def) {
		Sequencer.RE_NUMBER.lastIndex = idx;
		const res = Sequencer.RE_NUMBER.exec(str);
		if (res === null) return [def, idx - 1];
		const v = parseInt(res[0]);
		return [v, Sequencer.RE_NUMBER.lastIndex - 1];
	}

	/**~ja
	 * 音符と休符の長さを取得する（ライブラリ内だけで使用）
	 * @private
	 * @param {string} str 楽譜を表す文字列
	 * @param {number} idx 調べるインデックス
	 * @return {[number, number]} 長さと調べ終わったインデックス
	 */
	/**~en
	 * Get length of notes and rests (used only in the library)
	 * @private
	 * @param {string} str String representing score
	 * @param {number} idx Index to be checked
	 * @return {[number, number]} Length and checked index
	 */
	_getLength(str, idx) {
		const def = (4 * (60 / this._bpm) * (1 / this._length));
		Sequencer.RE_LENGTH.lastIndex = idx;
		const res = Sequencer.RE_LENGTH.exec(str);
		if (res === null) return [def, idx - 1];
		let dur = null;
		let dots = null;
		if (!res[1]) {
			dur = def;
			dots = res[0];
		} else {
			const v = parseInt(res[1]);
			dur = (4 * (60 / this._bpm) * (1 / v));
			if (res[2]) dots = res[2];
		}
		if (dots) {
			let hl = dur / 2;
			for (let i = 0; i < dots.length; i += 1) {
				dur += hl;
				hl /= 2;
			}
		}
		return [dur, Sequencer.RE_LENGTH.lastIndex - 1];
	}

	/**~ja
	 * オプションを取得する（ライブラリ内だけで使用）
	 * @private
	 * @param {string} str 楽譜を表す文字列
	 * @param {number} idx 調べるインデックス
	 * @return {[Array, number]} オプションと調べ終わったインデックス
	 */
	/**~en
	 * Get option (used only in the library)
	 * @private
	 * @param {string} str String representing score
	 * @param {number} idx Index to be checked
	 * @return {[Array, number]} Option and checked index
	 */
	_getOption(str, idx) {
		let o = null;
		let i = idx;
		for (; i < str.length; i += 1) {
			const ch = str[i];
			if (ch === '}') {
				o = str.substr(idx, i - idx);
				break;
			}
		}
		if (o === null) throw new Error(`${str.slice(0, idx - 1)} ${str[idx - 1]} ${str.slice(idx)}`);
		const opts = [];
		if (o) {
			const os = o.split(',');
			for (const o of os) {
				const v = parseFloat(o);
				if (Number.isNaN(v)) opts.push(o);
				else opts.push(v);
			}
		}
		return [opts, i];
	}

	/**~ja
	 * 音を鳴らす（ライブラリ内だけで使用）
	 * @private
	 * @param {number} dur 音の継続時間 [s]
	 * @param {string} noteCh 音程を表す文字
	 * @param {number} shift 音程のズレ
	 */
	/**~en
	 * Play sound (used only in the library)
	 * @private
	 * @param {number} dur Duration of sound [s]
	 * @param {string} noteCh Character representing pitch
	 * @param {number} shift Pitch shift
	 */
	_sound(dur, noteCh, shift) {
		const base = Sequencer.NOTE_TO_BASE_NO[noteCh];
		const nn = base + (this._octave + 1) * 12 + shift;
		const freq = 440 * Math.pow(2, (nn - 69) / 12);

		const gain = this._gain * this._volume / 9;
		dur *= (this._gateTime / 10);
		const opts = this._opts;
		const fn = (e) => {
			if (this._tune) this._tune(this._inst, e.time, gain, freq, ...opts);
			if (this._play) this._play(this._inst, e.time);
			if (this._stop) this._stop(this._inst, e.time + dur);
		};
		this._buf.push([this._lastTime, fn]);
	}


	// -------------------------------------------------------------------------


	/**~ja
	 * リズムをセットする
	 * @param {string} rhythm リズムを表す文字列
	 * @return {Sequencer} このシーケンサー
	 */
	/**~en
	 * Set rhythm
	 * @param {string} rhythm String representing rhythm
	 * @return {Sequencer} This sequencer
	 */
	setRhythm(rhythm) {
		rhythm = rhythm.replace(/\|/g, '');
		for (let i = 0; i < rhythm.length; i += 1) {
			const v = (i % 4 < 2) ? 8 / this._swingRatio : 8 / (1 - this._swingRatio);
			const dur = (4 * (60 / this._bpm) * (1 / v));

			const ch = rhythm[i];
			if ('0123456789'.indexOf(ch) !== -1) {
				const vol = parseInt(ch);
				const gain = this._gain * vol / 9;
				const fn = (e) => {
					if (this._tune) this._tune(this._inst, e.time, gain, 440);
					if (this._play) this._play(this._inst, e.time);
					if (this._stop) this._stop(this._inst, e.time + dur);
				};
				this._buf.push([this._lastTime, fn]);
			}
			this._lastTime += dur;
		}
		return this;
	}

}

Sequencer.NOTE_TO_BASE_NO = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
Sequencer.RE_PITCH_SHIFT  = /#|\+|-/y;
Sequencer.RE_NUMBER       = /\d+/y;
Sequencer.RE_LENGTH       = /\.+|(\d+)(\.*)/y;
