/**~ja
 * イージング関数（アルゴリズム）
 * 参考: http://easings.net/
 * @author Takuto Yanagida
 * @version 2021-02-04
 */
/**~en
 * Easing functions (algorithms)
 * Reference: http://easings.net/
 * @author Takuto Yanagida
 * @version 2021-02-04
 */


/**~ja
 * リニア（変化なし）
 * @param {number} t 0～1の数
 * @return {number} 数
 */
/**~en
 * Linear (no change)
 * @param {number} t A number from 0 to 1
 * @return {number} A number
 */
const linear = function (t) {
	return t;
};

/**~ja
 * サイン関数（イーズ・イン）
 * @param {number} t 0～1の数
 * @return {number} 数
 */
/**~en
 * Sine function (ease-in)
 * @param {number} t A number from 0 to 1
 * @return {number} A number
 */
const easeInSine = function (t) {
	return -Math.cos(t * (Math.PI / 2)) + 1;
};

/**~ja
 * サイン関数（イーズ・アウト）
 * @param {number} t 0～1の数
 * @return {number} 数
 */
/**~en
 * Sine function (ease-out)
 * @param {number} t A number from 0 to 1
 * @return {number} A number
 */
const easeOutSine = function (t) {
	return Math.sin(t * (Math.PI / 2));
};

/**~ja
 * サイン関数（イーズ・インとイーズ・アウト）
 * @param {number} t 0～1の数
 * @return {number} 数
 */
/**~en
 * Sine function (ease-in/out)
 * @param {number} t A number from 0 to 1
 * @return {number} A number
 */
const easeInOutSine = function (t) {
	return -0.5 * (Math.cos(Math.PI * t) - 1);
};

/**~ja
 * 二次関数（イーズ・イン）
 * @param {number} t 0～1の数
 * @return {number} 数
 */
/**~en
 * Quadratic function (ease-in)
 * @param {number} t A number from 0 to 1
 * @return {number} A number
 */
const easeInQuad = function (t) {
	return t * t;
};

/**~ja
 * 二次関数（イーズ・アウト）
 * @param {number} t 0～1の数
 * @return {number} 数
 */
/**~en
 * Quadratic function (ease-out)
 * @param {number} t A number from 0 to 1
 * @return {number} A number
 */
const easeOutQuad = function (t) {
	return -t * (t - 2);
};

/**~ja
 * 二次関数（イーズ・インとイーズ・アウト）
 * @param {number} t 0～1の数
 * @return {number} 数
 */
/**~en
 * Quadratic function (ease-in/out)
 * @param {number} t A number from 0 to 1
 * @return {number} A number
 */
const easeInOutQuad = function (t) {
	t *= 2;
	if (t < 1) {
		return 0.5 * t * t;
	}
	t -= 1;
	return -0.5 * (t * (t - 2) - 1);
};

/**~ja
 * 三次関数（イーズ・イン）
 * @param {number} t 0～1の数
 * @return {number} 数
 */
/**~en
 * Cubic function (ease-in)
 * @param {number} t A number from 0 to 1
 * @return {number} A number
 */
const easeInCubic = function (t) {
	return t * t * t;
};

/**~ja
 * 三次関数（イーズ・アウト）
 * @param {number} t 0～1の数
 * @return {number} 数
 */
/**~en
 * Cubic function (ease-out)
 * @param {number} t A number from 0 to 1
 * @return {number} A number
 */
const easeOutCubic = function (t) {
	t -= 1;
	return (t * t * t + 1);
};

/**~ja
 * 三次関数（イーズ・インとイーズ・アウト）
 * @param {number} t 0～1の数
 * @return {number} 数
 */
/**~en
 * Cubic function (ease-in/out)
 * @param {number} t A number from 0 to 1
 * @return {number} A number
 */
const easeInOutCubic = function (t) {
	t *= 2;
	if (t < 1) {
		return 0.5 * t * t * t;
	}
	t -= 2;
	return 0.5 * (t * t * t + 2);
};

/**~ja
 * 四次関数（イーズ・イン）
 * @param {number} t 0～1の数
 * @return {number} 数
 */
/**~en
 * Quartic function (ease-in)
 * @param {number} t A number from 0 to 1
 * @return {number} A number
 */
const easeInQuart = function (t) {
	return t * t * t * t;
};

/**~ja
 * 四次関数（イーズ・アウト）
 * @param {number} t 0～1の数
 * @return {number} 数
 */
/**~en
 * Quartic function (ease-out)
 * @param {number} t A number from 0 to 1
 * @return {number} A number
 */
const easeOutQuart = function (t) {
	t -= 1;
	return -(t * t * t * t - 1);
};

/**~ja
 * 四次関数（イーズ・インとイーズ・アウト）
 * @param {number} t 0～1の数
 * @return {number} 数
 */
/**~en
 * Quartic function (ease-in/out)
 * @param {number} t A number from 0 to 1
 * @return {number} A number
 */
const easeInOutQuart = function (t) {
	t *= 2;
	if (t < 1) {
		return 0.5 * t * t * t * t;
	}
	t -= 2;
	return -0.5 * (t * t * t * t - 2);
};

/**~ja
 * 五次関数（イーズ・イン）
 * @param {number} t 0～1の数
 * @return {number} 数
 */
/**~en
 * Quintic function (ease-in)
 * @param {number} t A number from 0 to 1
 * @return {number} A number
 */
const easeInQuint = function (t) {
	return t * t * t * t * t;
};

/**~ja
 * 五次関数（イーズ・アウト）
 * @param {number} t 0～1の数
 * @return {number} 数
 */
/**~en
 * Quintic function (ease-out)
 * @param {number} t A number from 0 to 1
 * @return {number} A number
 */
const easeOutQuint = function (t) {
	t -= 1;
	return (t * t * t * t * t + 1);
};

/**~ja
 * 五次関数（イーズ・インとイーズ・アウト）
 * @param {number} t 0～1の数
 * @return {number} 数
 */
/**~en
 * Quintic function (ease-in/out)
 * @param {number} t A number from 0 to 1
 * @return {number} A number
 */
const easeInOutQuint = function (t) {
	t *= 2;
	if (t < 1) {
		return 0.5 * t * t * t * t * t;
	}
	t -= 2;
	return 0.5 * (t * t * t * t * t + 2);
};

/**~ja
 * 指数関数（イーズ・イン）
 * @param {number} t 0～1の数
 * @return {number} 数
 */
/**~en
 * Exponential function (ease-in)
 * @param {number} t A number from 0 to 1
 * @return {number} A number
 */
const easeInExpo = function (t) {
	return Math.pow(2, 10 * (t - 1));
};

/**~ja
 * 指数関数（イーズ・アウト）
 * @param {number} t 0～1の数
 * @return {number} 数
 */
/**~en
 * Exponential function (ease-out)
 * @param {number} t A number from 0 to 1
 * @return {number} A number
 */
const easeOutExpo = function (t) {
	return -Math.pow(2, -10 * t) + 1;
};

/**~ja
 * 指数関数（イーズ・インとイーズ・アウト）
 * @param {number} t 0～1の数
 * @return {number} 数
 */
/**~en
 * Exponential function (ease-in/out)
 * @param {number} t A number from 0 to 1
 * @return {number} A number
 */
const easeInOutExpo = function (t) {
	t *= 2;
	if (t < 1) {
		return 0.5 * Math.pow(2, 10 * (t - 1));
	}
	t -= 1;
	return 0.5 * (-Math.pow(2, -10 * t) + 2);
};

/**~ja
 * 円関数（イーズ・イン）
 * @param {number} t 0～1の数
 * @return {number} 数
 */
/**~en
 * Circular function (ease-in)
 * @param {number} t A number from 0 to 1
 * @return {number} A number
 */
const easeInCirc = function (t) {
	return -(Math.sqrt(1 - t * t) - 1);
};

/**~ja
 * 円関数（イーズ・アウト）
 * @param {number} t 0～1の数
 * @return {number} 数
 */
/**~en
 * Circular function (ease-out)
 * @param {number} t A number from 0 to 1
 * @return {number} A number
 */
const easeOutCirc = function (t) {
	t -= 1;
	return Math.sqrt(1 - t * t);
};

/**~ja
 * 円関数（イーズ・インとイーズ・アウト）
 * @param {number} t 0～1の数
 * @return {number} 数
 */
/**~en
 * Circular function (ease-in/out)
 * @param {number} t A number from 0 to 1
 * @return {number} A number
 */
const easeInOutCirc = function (t) {
	t *= 2;
	if (t < 1) {
		return -0.5 * (Math.sqrt(1 - t * t) - 1);
	}
	t -= 2;
	return 0.5 * (Math.sqrt(1 - t * t) + 1);
};