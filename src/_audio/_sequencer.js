/**~ja
 * シーケンサー
 * @version 2020-12-11
 */
/**~en
 * Sequencer
 * @version 2020-12-11
 */
class Sequencer {

	// ノート名をノート番号に変換する
	static noteNameToNoteNum(name) {
		if (!name || name.length === 0) return 69;
		const c = name[0].toUpperCase();
		const o = parseInt(name.substr(1));
		let n = { 'C': 60, 'D': 62, 'E': 64, 'F': 65, 'G': 67, 'A': 69, 'B': 71 }[c];
		if (!Number.isNaN(o)) n += (o - 4) * 12;
		n += name.split('#').length - 1;
		n -= name.split('b').length - 1;
		return n;
	}

	constructor(context, params) {
		this._scheduler = new Scheduler(() => { return context.currentTime; });
		this._lastTime = this._scheduler.now() + 1;

		params = normalizeParams(params);
		this._bpm        = params.bpm        ?? 100;
		this._gain       = params.gain       ?? 1;
		this._inst       = params.instrument ?? null;
		this._play       = params.play       ?? null;
		this._stop       = params.stop       ?? null;
		this._swingRatio = params.swingRatio ?? 0.5;
	}

	note(name, len, vel, ...opt) {
		const spb = 60 / this._bpm;
		const dur = (len === undefined) ? spb : (4 * spb * (1 / len));
		const v = this._gain * ((vel === undefined) ? 0.5 : vel);

		if (!Array.isArray(name)) name = [name];

		for (const n of name) {
			const f = noteNumToFreq(Sequencer.noteNameToNoteNum(n));
			const fn = (e) => {
				if (this._play) this._play(this._inst, e.time, f, v, ...opt);
				if (this._stop) this._stop(this._inst, e.time + dur);
			};
			this._scheduler.insert(this._lastTime, fn);
		}
		this._lastTime += dur;
		this._scheduler.start();
		return this;
	}

	rest(len) {
		const spb = 60 / this._bpm;
		const dur = (len === undefined) ? spb : (4 * spb * (1 / len));

		this._lastTime += dur;
		this._scheduler.start();
		return this;
	}

	playNote(notes) {
		const ni = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
		let bpm = this._bpm;
		let oct = 4;
		let shift = 0;
		let len = 4;
		let vel = 5;
		let l = 0;
		const numRe = new RegExp('\d+');
		const lenRe = new RegExp('\.|\d+\.?');
		for (let i = 0; i < notes.length; i += 1) {
			const c = notes[i];
			switch (c) {
				case 'C': case 'D': case 'E': case 'F': case 'G': case 'A': case 'B':
					const nn = ni[c] + (oct + 1) * 12 + shift;
					shift = 0;
					[l, i] = this._getLength(notes, i + 1, len);
					console.log(c, nn, l);
					break;
				case '#': case '+':
					shift += 1;
					break;
				case '-':
					shift -= 1;
					break;
				case 'R':
					[l, i] = this._getLength(notes, i + 1, len);
					console.log(c, l);
					break;
				case 'L':
					[len, i] = this._getLength(notes, i + 1, len);
					console.log('LEN', len);
					break;
				case 'O':
					[oct, i] = this._getNum(notes, i + 1, oct);
					console.log('OCT', oct);
					break;
				case 'V':
					[vel, i] = this._getNum(notes, i + 1, vel);
					console.log('VEL', vel);
					break;
				case 'T':
					[bpm, i] = this._getNum(notes, i + 1, bpm);
					console.log('BPM', bpm, i);
					break;
				case '>':
					oct += 1;
					break;
				case '<':
					oct -= 1;
					break;
			}
		}
	}

	_getNum(str, idx, def) {
		const re = /\d+/y;
		re.lastIndex = idx;
		const res = re.exec(str);
		if (res === null) return [def, idx];
		const v = parseInt(res[0]);
		const i = re.lastIndex - 1;
		return [v, i];
	}

	_getLength(str, idx, def) {
		const re = /\.+|(\d+)(\.*)/y;
		re.lastIndex = idx;
		const res = re.exec(str);
		if (res === null) return [def, idx];
		let l = def
		if (!res[1]) {
			let hl = l / 2;
			for (let i = 0; i < res[0].length; i += 1) {
				l += hl;
				hl /= 2;
			}
		} else {
			const v = parseInt(res[1]);
			l = (4 * (60 / this._bpm) * (1 / v));
			if (res[2]) {
				let hl = l / 2;
				for (let i = 0; i < res[2].length; i += 1) {
					l += hl;
					hl /= 2;
				}
			}
		}
		const i = re.lastIndex - 1;
		return [l, i];
	}

	playBeat(beats) {
		beats = beats.replace(/\|/g, '');
		for (let i = 0; i < beats.length; i += 1) {
			const c = beats.charAt(i);
			const v = parseInt(c);
			const dur = (i % 4 < 2) ? this._swingRatio / 8 : (1 - this._swingRatio) / 8;
			if (0 <= v && v <= 9) {
				this.note('', 1 / dur, this._gain * (0.1 * (v + 1)));
			} else {
				this.rest(1 / dur);
			}
		}
	}
}

Sequencer.prototype.n = Sequencer.prototype.note;
Sequencer.prototype.r = Sequencer.prototype.rest;