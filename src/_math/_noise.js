/**~ja
 * ノイズ
 * 参考: Stefan Gustavson, SimplexNoise1234, http://staffwww.itn.liu.se/~stegu/aqsis/aqsis-newnoise/simplexnoise1234.cpp
 * @author Takuto Yanagida
 * @version 2020-04-29
 */
/**~en
 * Noise
 * Reference: Stefan Gustavson, SimplexNoise1234, http://staffwww.itn.liu.se/~stegu/aqsis/aqsis-newnoise/simplexnoise1234.cpp
 * @author Takuto Yanagida
 * @version 2020-04-29
 */
class Noise {

	constructor() {
		this._perm = [];
		for (let i = 0; i < 256; i += 1) {
			this._perm.push(0 | (Math.random() * 256));
		}
	}

	get(x) {
		return (this._generate(x) + 1) * 0.5;
	}

	_generate(x) {
		const i0 = Math.floor(x);
		const i1 = i0 + 1;
		const x0 = x - i0;
		const x1 = x0 - 1;

		let t0 = 1.0 - x0 * x0;
		t0 *= t0;
		const n0 = t0 * t0 * this._grad(this._perm[i0 & 0xff], x0);

		let t1 = 1.0 - x1 * x1;
		t1 *= t1;
		const n1 = t1 * t1 * this._grad(this._perm[i1 & 0xff], x1);
		return 0.395 * (n0 + n1);
	}

	_grad(hash, x) {
		const h = hash & 15;
		let grad = 1.0 + (h & 7);
		if ((h & 8) !== 0) grad = -grad;
		return (grad * x);
	}

}