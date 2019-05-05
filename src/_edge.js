// -------------------------------------------------------------------------
// エッジ生成関数
// -------------------------------------------------------------------------




const NORMAL_EDGE = null;

// 直線のエッジを作る
const normalEdge = function () {
	return NORMAL_EDGE;
};

// サイン波のエッジを作る（<長さ>、<振幅>、<オプション>）
const sineEdge = function (length = 10, amplitude = 10, opt = {}) {
	return makeEdge(length, amplitude, opt, function (p) {
		return Math.sin(p * Math.PI * 2);
	}, -0.25, 0.25);
};

// 矩形波のエッジを作る（<長さ>、<振幅>、<オプション>）
const squareEdge = function (length = 10, amplitude = 10, opt = {}) {
	return makeEdge(length, amplitude, opt, function (p) {
		if (p < 0.01) return p / 0.01;
		if (p < 0.49) return 1;
		if (p < 0.51) return -(p - 0.5) / 0.01;
		if (p < 0.99) return -1;
		return (p - 1) / 0.01;
	}, -0.01, 0.01);
};

// 三角波のエッジを作る（<長さ>、<振幅>、<オプション>）
const triangleEdge = function (length = 10, amplitude = 10, opt = {}) {
	return makeEdge(length, amplitude, opt, function (p) {
		if (p < 0.25) return p / 0.25;
		if (p < 0.75) return -(p - 0.5) / 0.25;
		return (p - 1) / 0.25;
	}, -0.25, 0.25);
};

// のこぎり波のエッジを作る（<長さ>、<振幅>、<オプション>）
const sawtoothEdge = function (length = 10, amplitude = 10, opt = {}) {
	return makeEdge(length, amplitude, opt, function (p) {
		if (p < 0.49) return p / 0.49;
		if (p < 0.51) return -(p - 0.5) / 0.01;
		return (p - 1) / 0.49;
	}, -0.49, 0.49);
};

// サインの絶対値の波形のエッジを作る（<長さ>、<振幅>、<オプション>）
const absSineEdge = function (length = 10, amplitude = 10, opt = {}) {
	return makeEdge(length, amplitude, opt, function (p) {
		return Math.abs(Math.sin(p * Math.PI + Math.PI / 6)) * 2 - 1;
	}, -1 / 6, 1 / 3);
};

// （ライブラリ内だけで使用）エッジを作る（長さ、振幅、オプション、関数（原点を通り振幅±1）、最小値フェーズ、最大値フェーズ）
const makeEdge = function (length, amplitude, opt, func, minPhase, maxPhase) {
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
		return (func(p) * rev + off) * amp;
	};
};