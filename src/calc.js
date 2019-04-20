//
// 計算ライブラリ（CALC）
// 日付: 2018-10-01
// 作者: 柳田拓人（Space-Time Inc.）
//
// 参考: http://easings.net/ja
//
// 範囲を決められるランダム関数や、ある範囲の数を別の範囲の数に変えるマッピング、
// 単純ではない動きを作るのに使うイージング関数が使えるようになるライブラリです。
//


// ライブラリ変数
const CALC = (function () {

	'use strict';


	// ================================ ライブラリ中だけで使用するユーティリティ


	// テキトウな数（乱数）を返す関数を作る（シード値）
	const createGenerator = function (seed) {
		let y = seed;
		const fn = () => {
			y = y ^ (y << 13);
			y = y ^ (y >> 17);
			y = y ^ (y << 15);
			return (y + 2147483648) / 4294967295;
		};
		fn.reset = () => {
			y = seed;
		};
		const stack = [];
		fn.save = () => {
			stack.push(y);
		};
		fn.restore = () => {
			y = stack.pop();
		};
		return fn;
	}


	// ================================ サイコロ (CALC.Dice)


	class Dice {

		// サイコロを作る
		constructor() {
			this._r = createGenerator(0 | (Math.random() * 1000));
		}

		// リセットする
		reset() {
			this._r.reset();
		}

		// 今の状態を保存する
		save() {
			this._r.save();
		}

		// 前の状態を復元する
		restore() {
			this._r.restore();
		}

		// minからmaxまでのテキトウな数（乱数）を返す（最小値、最大値、<イージング関数>）
		random(min, max, opt_fn) {
			if (opt_fn === undefined) {
				return this._r() * (max - min) + min;
			}
			return opt_fn(this._r()) * (max - min) + min;
		}

		// 0からn_minまで、あるいはminからmaxまでのテキトウな整数（乱数）を返す（整数n / 整数min、整数max）
		rand(n_min, max) {
			if (max === undefined) {
				return Math.floor(this._r() * (n + 1));
			} else {
				return Math.floor(this._r() * (max + 1 - n_min) + n_min);
			}
		}

		// パーセントで指定した確率で起こる（パーセント）
		isLikely(percent) {
			return (this._r() * 10000 % 100) <= percent;
		}

	}


	// ================================ 乱数関数


	// （ライブラリ内だけで使用）ライブラリ内で使う基本ランダム関数
	let _r = Math.random;

	// （ライブラリ内だけで使用）ランダム関数のシード値
	let _seed = 0 | (Math.random() * 1000);

	// ランダム関数にシード値を指定する（シード値）
	// 同じシード値では同じランダムの値の組み合わせが作られます。
	const setRandomSeed = function (seed) {
		if (seed < 1) seed *= 1000;
		_seed = 0 | seed;
		_r = createGenerator(_seed);
	};

	// ランダム関数をリセットする
	const resetRandomSeed = function () {
		_r = createGenerator(_seed);
	};

	// ランダム関数の今の状態を保存する
	const saveRandomState = function () {
		if (_r.save) _r.save();
	};

	// ランダム関数の前の状態を復元する
	const restoreRandomState = function () {
		if (_r.restore) _r.restore();
	};

	// minからmaxまでのテキトウな数（乱数）を返す（最小値、最大値、<イージング関数>）
	const random = function (min, max, opt_fn) {
		if (opt_fn === undefined) {
			return _r() * (max - min) + min;
		}
		return opt_fn(_r()) * (max - min) + min;
	};

	// 0からn_minまで、あるいはminからmaxまでのテキトウな整数（乱数）を返す（整数n / 整数min、整数max）
	const rand = function (n_min, max) {
		if (max === undefined) {
			return Math.floor(_r() * (n + 1));
		} else {
			return Math.floor(_r() * (max + 1 - n_min) + n_min);
		}
	};

	// パーセントで指定した確率で起こる（パーセント）
	const isLikely = function (percent) {
		return (_r() * 10000 % 100) <= percent;
	};


	// ================================ ユーティリティ関数


	// 数をある範囲の中に制限する（数、最小値、最大値、<タイプ>）
	const constrain = function (val, min, max, type) {
		if (type === 'loop') {
			if (val < min) return max;
			if (max < val) return min;
		} else {
			if (val < min) return min;
			if (max < val) return max;
		}
		if (val === undefined || Number.isNaN(val)) return min;
		return val;
	};

	// ある範囲の数を別の範囲の数を計算して返す（元の数、元の範囲の初め、終わり、別の範囲の初め、終わり、<イージング関数>）
	const map = function (val, from1, to1, from2, to2, opt_fn) {
		if (from1 < to1) {
			if (val < from1) val = from1;
			if (val > to1)   val = to1;
		} else {
			if (val > from1) val = from1;
			if (val < to1)   val = to1;
		}
		if (opt_fn === undefined) {
			return (val - from1) * (to2 - from2) / (to1 - from1) + from2;
		}
		return opt_fn((val - from1) / (to1 - from1)) * (to2 - from2) + from2;
	};


	// ================================ イージング関数（アルゴリズム）


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


	// ================================ ライブラリを作る


	// ライブラリとして返す
	return {
		Dice,
		setRandomSeed,
		resetRandomSeed,
		saveRandomState,
		restoreRandomState,

		random, rand, isLikely,
		constrain, map,
		easingRandom, easingMap,

		linear,
		easeInSine, easeOutSine, easeInOutSine,
		easeInQuad, easeOutQuad, easeInOutQuad,
		easeInCubic, easeOutCubic, easeInOutCubic,
		easeInQuart, easeOutQuart, easeInOutQuart,
		easeInQuint, easeOutQuint, easeInOutQuint,
		easeInExpo, easeOutExpo, easeInOutExpo,
		easeInCirc, easeOutCirc, easeInOutCirc,
	};

}());
