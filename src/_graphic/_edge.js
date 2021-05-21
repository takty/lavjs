/**~ja
 * エッジ生成関数
 * @author Takuto Yanagida
 * @version 2021-05-21
 */
/**~en
 * Edge generation functions
 * @author Takuto Yanagida
 * @version 2021-05-21
 */


const NORMAL_EDGE = null;


/**~ja
 * 直線のエッジを作る
 * @return {function(number, number):number} 直線のエッジ
 */
/**~en
 * Make a straight edge
 * @return {function(number, number):number} Straight edge
 */
const normalEdge = function () {
	return NORMAL_EDGE;
};

/**~ja
 * サイン波のエッジを作る
 * @param {number=} [length=10] 長さ
 * @param {number=} [amplitude=10] 振幅
 * @param {*=} [opt={}] オプション
 * @return {function(number, number):number} サイン波のエッジ
 */
/**~en
 * Make a sine wave edge
 * @param {number=} [length=10] Length
 * @param {number=} [amplitude=10] Amplitude
 * @param {*=} [opt={}] Options
 * @return {function(number, number):number} Sine wave edge
 */
const sineEdge = function (length = 10, amplitude = 10, opt = {}) {
	return _makeEdge(length, amplitude, opt, function (p) {
		return Math.sin(p * Math.PI * 2);
	}, -0.25, 0.25);
};

/**~ja
 * 矩形波のエッジを作る
 * @param {number=} [length=10] 長さ
 * @param {number=} [amplitude=10] 振幅
 * @param {*=} [opt={}] オプション
 * @return {function(number, number):number} 矩形波のエッジ
 */
/**~en
 * Make a square wave edge
 * @param {number=} [length=10] Length
 * @param {number=} [amplitude=10] Amplitude
 * @param {*=} [opt={}] Options
 * @return {function(number, number):number} Square wave edge
 */
const squareEdge = function (length = 10, amplitude = 10, opt = {}) {
	return _makeEdge(length, amplitude, opt, function (p) {
		if (p < 0.01) return p / 0.01;
		if (p < 0.49) return 1;
		if (p < 0.51) return -(p - 0.5) / 0.01;
		if (p < 0.99) return -1;
		return (p - 1) / 0.01;
	}, -0.01, 0.01);
};

/**~ja
 * 三角波のエッジを作る
 * @param {number=} [length=10] 長さ
 * @param {number=} [amplitude=10] 振幅
 * @param {*=} [opt={}] オプション
 * @return {function(number, number):number} 三角波のエッジ
 */
/**~en
 * Make a triangle wave edge
 * @param {number=} [length=10] Length
 * @param {number=} [amplitude=10] Amplitude
 * @param {*=} [opt={}] Options
 * @return {function(number, number):number} Triangle wave edge
 */
const triangleEdge = function (length = 10, amplitude = 10, opt = {}) {
	return _makeEdge(length, amplitude, opt, function (p) {
		if (p < 0.25) return p / 0.25;
		if (p < 0.75) return -(p - 0.5) / 0.25;
		return (p - 1) / 0.25;
	}, -0.25, 0.25);
};

/**~ja
 * のこぎり波のエッジを作る
 * @param {number=} [length=10] 長さ
 * @param {number=} [amplitude=10] 振幅
 * @param {*=} [opt={}] オプション
 * @return {function(number, number):number} のこぎり波のエッジ
 */
/**~en
 * Make a sawtooth wave edge
 * @param {number=} [length=10] Length
 * @param {number=} [amplitude=10] Amplitude
 * @param {*=} [opt={}] Options
 * @return {function(number, number):number} Sawtooth wave edge
 */
const sawtoothEdge = function (length = 10, amplitude = 10, opt = {}) {
	return _makeEdge(length, amplitude, opt, function (p) {
		if (p < 0.49) return p / 0.49;
		if (p < 0.51) return -(p - 0.5) / 0.01;
		return (p - 1) / 0.49;
	}, -0.49, 0.49);
};

/**~ja
 * サインの絶対値の波形のエッジを作る
 * @param {number=} [length=10] 長さ
 * @param {number=} [amplitude=10] 振幅
 * @param {*=} [opt={}] オプション
 * @return {function(number, number):number} サイン波のエッジ
 */
/**~en
 * Make an edge of the absolute value of the sine function
 * @param {number=} [length=10] Length
 * @param {number=} [amplitude=10] Amplitude
 * @param {*=} [opt={}] Options
 * @return {function(number, number):number} Edge of the absolute value of the sine function
 */
const absSineEdge = function (length = 10, amplitude = 10, opt = {}) {
	return _makeEdge(length, amplitude, opt, function (p) {
		return Math.abs(Math.sin(p * Math.PI + Math.PI / 6)) * 2 - 1;
	}, -1 / 6, 1 / 3);
};

/**~ja
 * ノイズのエッジを作る
 * @param {number=} [length=10] 長さ
 * @param {number=} [amplitude=10] 振幅
 * @param {*=} [opt={}] オプション
 * @return {function(number, number):number} ノイズのエッジ
 */
/**~en
 * Make a noise edge
 * @param {number=} [length=10] Length
 * @param {number=} [amplitude=10] Amplitude
 * @param {*=} [opt={}] Options
 * @return {function(number, number):number} Noise edge
 */
const noiseEdge = function (length = 10, amplitude = 10, opt = {}) {
	//@ifdef ja
	if (typeof CALC === 'undefined') throw new Error('Calcライブラリが必要です。');
	//@endif
	//@ifdef en
	if (typeof CALC === 'undefined') throw new Error('Calc library is needed.');
	//@endif
	const amp = 2 * amplitude;

	const p = (CROQUJS.currentPaper()) ? CROQUJS.currentPaper() : null;
	let lastFrame = 0;
	let off = 0;

	return function (x, max) {
		max = Math.round(max * 100) / 100;
		const l = 1 / Math.min(length, max);
		let d = (0 | (max * l)) / max;
		if (d === (0 | d)) d += 0.01;
		let s = d * x;
		if (Math.abs(x - max) < 0.01) {
			s = 0 | s;
			if (p) off += d * max;
		}
		if (p && p.totalFrame() !== lastFrame) {
			lastFrame = p.totalFrame();
			off = 0;
		}
		return (CALC.noise(s + off) - 0.5) * amp;
	};
};

/**~ja
 * いくつかのエッジを混ぜたエッジを作る
 * @param {function(number, number):number} func エッジ
 * @param {...function(number, number):number} fs いくつかのエッジ
 * @return {function(number, number):number} 混ざったエッジ
 */
/**~en
 * Make a mixture edge
 * @param {function(number, number):number} func Edge
 * @param {...function(number, number):number} fs Edges
 * @return {function(number, number):number} Mixed edge
 */
const mixEdge = function (func, ...fs) {
	return function (x, max) {
		let v = func(x, max);
		for (const f of fs) v += f(x, max);
		return v;
	};
};

/**~ja
 * エッジを作る（ライブラリ内だけで使用）
 * @private
 * @param {number} length 長さ
 * @param {number} amplitude 振幅
 * @param {*} opt オプション
 * @param {function(number):number} func 関数（原点を通り振幅±1）
 * @param {number} minPhase 最小値フェーズ
 * @param {number} maxPhase 最大値フェーズ
 * @return {function(number, number):number} エッジ
 */
/**~en
 * Make an edge (used only in the library)
 * @private
 * @param {number} length Length
 * @param {number} amplitude Amplitude
 * @param {*} opt Options
 * @param {function(number):number} fn Function (Amplitude 1 through the origin)
 * @param {number} minPhase Minimum phase
 * @param {number} maxPhase Maximum phase
 * @return {function(number, number):number} Edge
 */
const _makeEdge = function (length, amplitude, opt, fn, minPhase, maxPhase) {
	let amp = 0.5 * amplitude;
	let phase = minPhase, off = 1, rev = 1;

	if (opt.centering) {
		phase = 0;
		off = 0;
	}
	if (opt.reverse) {
		phase = maxPhase;
		rev = -1;
	}
	if (opt.flip) {
		amp *= -1;
	}
	return function (x, max) {
		const l = max / Math.max(1, (~~(max / length)));
		let p = x % l / l + phase;
		if (p < 0) p += 1;
		return (fn(p) * rev + off) * amp;
	};
};