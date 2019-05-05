// -------------------------------------------------------------------------
// イージング関数（アルゴリズム）
// -------------------------------------------------------------------------




// minからmaxまでの「かたより」のあるテキトウな数（乱数）を返す（最小値、最大値、イージング関数）
const easingRandom = function (min, max, fn) {
	return random(min, max, fn);
};

// ある範囲の数を別の範囲の「かたより」のある数に直して返す（元の数、元の範囲の初め、終わり、別の範囲の初め、終わり、イージング関数）
const easingMap = function (val, from1, to1, from2, to2, fn) {
	return map(val, from1, to1, from2, to2, fn);
};


// リニア（0～1の数）　※変化なし
const linear = function (t) {
	return t;
};


// サイン関数（0～1の数）　※イーズ・イン
const easeInSine = function (t) {
	return -Math.cos(t * (Math.PI / 2)) + 1;
};

// サイン関数（0～1の数）　※イーズ・アウト
const easeOutSine = function (t) {
	return Math.sin(t * (Math.PI / 2));
};

// サイン関数（0～1の数）　※イーズ・インとイーズ・アウト
const easeInOutSine = function (t) {
	return -0.5 * (Math.cos(Math.PI * t) - 1);
};


// 二乗関数（0～1の数）　※イーズ・イン
const easeInQuad = function (t) {
	return t * t;
};

// 二乗関数（0～1の数）　※イーズ・アウト
const easeOutQuad = function (t) {
	return -t * (t - 2);
};

// 二乗関数（0～1の数）　※イーズ・インとイーズ・アウト
const easeInOutQuad = function (t) {
	t *= 2;
	if (t < 1) {
		return 0.5 * t * t;
	}
	t -= 1;
	return -0.5 * (t * (t - 2) - 1);
};


// 三乗関数（0～1の数）　※イーズ・イン
const easeInCubic = function (t) {
	return t * t * t;
};

// 三乗関数（0～1の数）　※イーズ・アウト
const easeOutCubic = function (t) {
	t -= 1;
	return (t * t * t + 1);
};

// 三乗関数（0～1の数）　※イーズ・インとイーズ・アウト
const easeInOutCubic = function (t) {
	t *= 2;
	if (t < 1) {
		return 0.5 * t * t * t;
	}
	t -= 2;
	return 0.5 * (t * t * t + 2);
};


// 四乗関数（0～1の数）　※イーズ・イン
const easeInQuart = function (t) {
	return t * t * t * t;
};

// 四乗関数（0～1の数）　※イーズ・アウト
const easeOutQuart = function (t) {
	t -= 1;
	return -(t * t * t * t - 1);
};

// 四乗関数（0～1の数）　※イーズ・インとイーズ・アウト
const easeInOutQuart = function (t) {
	t *= 2;
	if (t < 1) {
		return 0.5 * t * t * t * t;
	}
	t -= 2;
	return -0.5 * (t * t * t * t - 2);
};


// 五乗関数（0～1の数）　※イーズ・イン
const easeInQuint = function (t) {
	return t * t * t * t * t;
};

// 五乗関数（0～1の数）　※イーズ・アウト
const easeOutQuint = function (t) {
	t -= 1;
	return (t * t * t * t * t + 1);
};

// 五乗関数（0～1の数）　※イーズ・インとイーズ・アウト
const easeInOutQuint = function (t) {
	t *= 2;
	if (t < 1) {
		return 0.5 * t * t * t * t * t;
	}
	t -= 2;
	return 0.5 * (t * t * t * t * t + 2);
};


// 指数関数（0～1の数）　※イーズ・イン
const easeInExpo = function (t) {
	return Math.pow(2, 10 * (t - 1));
};

// 指数関数（0～1の数）　※イーズ・アウト
const easeOutExpo = function (t) {
	return -Math.pow(2, -10 * t) + 1;
};

// 指数関数（0～1の数）　※イーズ・インとイーズ・アウト
const easeInOutExpo = function (t) {
	t *= 2;
	if (t < 1) {
		return 0.5 * Math.pow(2, 10 * (t - 1));
	}
	t -= 1;
	return 0.5 * (-Math.pow(2, -10 * t) + 2);
};


// 円関数（0～1の数）　※イーズ・イン
const easeInCirc = function (t) {
	return -(Math.sqrt(1 - t * t) - 1);
};

// 円関数（0～1の数）　※イーズ・アウト
const easeOutCirc = function (t) {
	t -= 1;
	return Math.sqrt(1 - t * t);
};

// 円関数（0～1の数）　※イーズ・インとイーズ・アウト
const easeInOutCirc = function (t) {
	t *= 2;
	if (t < 1) {
		return -0.5 * (Math.sqrt(1 - t * t) - 1);
	}
	t -= 2;
	return 0.5 * (Math.sqrt(1 - t * t) + 1);
};