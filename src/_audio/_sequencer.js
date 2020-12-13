/**~ja
 * シーケンサー
 * @version 2020-12-13
 */
/**~en
 * Sequencer
 * @version 2020-12-13
 */
class Sequencer {

	constructor(ctx, params) {
		const nowFn = (ctx instanceof Synth) ? (() => ctx.now()) : (() => ctx.currentTime);
		this._scheduler = new Scheduler(nowFn);
		this._lastTime = 0;
		this._buf = [];

		params = normalizeParams(params);
		this._inst       = params.instrument ?? null;
		this._play       = params.play       ?? null;
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

	play(delay = 0.5) {
		const now = this._scheduler.now() + delay;
		for (const b of this._buf) {
			const [t, fn] = b;
			this._scheduler.insert(now + t, fn);
		}
		this._scheduler.start();
	}

	reset() {
		this._lastTime = 0;
		this._buf = [];
	}


	// -------------------------------------------------------------------------


	setNote(notes) {
		let ps = 0;
		let dur = 0;
		for (let i = 0; i < notes.length; i += 1) {
			const ch = notes[i];
			switch (ch) {
				case 'C': case 'D': case 'E': case 'F': case 'G': case 'A': case 'B':
					[ps,  i] = this._getPitchShift(notes, i + 1);
					[dur, i] = this._getLength(notes, i + 1);
					this._note(dur, ch, ps);
					this._lastTime += dur;
					break;
				case 'R':
					[dur, i] = this._getLength(notes, i + 1);
					this._lastTime += dur;
					break;
				case 'Q':
					[this._gateTime, i] = this._getNum(notes, i + 1, this._gateTime);
					break;
				case 'L':
					[this._length, i] = this._getNum(notes, i + 1, this._length);
					break;
				case 'O':
					[this._octave, i] = this._getNum(notes, i + 1, this._octave);
					break;
				case 'V':
					[this._volume, i] = this._getNum(notes, i + 1, this._volume);
					break;
				case 'T':
					[this._bpm, i] = this._getNum(notes, i + 1, this._bpm);
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
	}

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

	_getNum(str, idx, def) {
		Sequencer.RE_NUMBER.lastIndex = idx;
		const res = Sequencer.RE_NUMBER.exec(str);
		if (res === null) return [def, idx - 1];
		const v = parseInt(res[0]);
		return [v, Sequencer.RE_NUMBER.lastIndex - 1];
	}

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

	_note(dur, noteCh, shift) {
		const base = Sequencer.NOTE_TO_BASE_NO[noteCh];
		const nn = base + (this._octave + 1) * 12 + shift;
		const freq = 440 * Math.pow(2, (nn - 69) / 12);

		const gain = this._gain * this._volume / 9;
		dur *= (this._gateTime / 10);
		const fn = (e) => {
			if (this._play) this._play(this._inst, e.time, freq, gain, ...this._opts);
			if (this._stop) this._stop(this._inst, e.time + dur);
		};
		this._buf.push([this._lastTime, fn]);
	}


	// -------------------------------------------------------------------------


	setBeat(beats) {
		beats = beats.replace(/\|/g, '');
		for (let i = 0; i < beats.length; i += 1) {
			const v = (i % 4 < 2) ? 8 / this._swingRatio : 8 / (1 - this._swingRatio);
			const dur = (4 * (60 / this._bpm) * (1 / v));
			
			const ch = beats[i];
			if ('0123456789'.indexOf(ch) !== -1) {
				const vol = parseInt(ch);
				const gain = this._gain * vol / 9;
				const fn = (e) => {
					if (this._play) this._play(this._inst, e.time, 440, gain);
					if (this._stop) this._stop(this._inst, e.time + dur);
				};
				this._buf.push([this._lastTime, fn]);
			}
			this._lastTime += dur;
		}
	}

}

Sequencer.NOTE_TO_BASE_NO = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
Sequencer.RE_PITCH_SHIFT  = /#|\+|-/y;
Sequencer.RE_NUMBER       = /\d+/y;
Sequencer.RE_LENGTH       = /\.+|(\d+)(\.*)/y;
