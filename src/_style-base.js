/**~ja
 * スタイル（ストローク・フィル共通）
 * @version 2019-05-10
 */
/**~en
 * Style (Common to stroke and fill)
 * @version 2019-05-10
 */
class StyleBase {

	/**~ja
	 * スタイルを作る
	 * @param {Stroke=} base 元になるスタイル
	 * @param {string=} color 標準の色
	 */
	/**~en
	 * Make a style
	 * @param {Stroke=} base Original style
	 * @param {string=} color Default color
	 */
	constructor(base, color) {
		this._style       = base ? base._style              : color;
		this._color       = base ? base._color              : color;
		this._rgb         = base ? base._rgb                : null;
		this._hsl         = base ? base._hsl                : null;
		this._gradType    = base ? base._gradType           : null;
		this._gradParams  = base ? base._gradParams         : null;
		this._gradColors  = base ? [...base._gradColors]    : [];
		this._alpha       = base ? base._alpha              : 1;
		this._composition = base ? base._composition        : 'source-over';
		this._shadow      = base ? new Shadow(base._shadow) : new Shadow();
	}

	/**~ja
	 * リセットする
	 * @param {string} color 色
	 * @return {StyleBase} このスタイル
	 */
	/**~en
	 * Reset
	 * @param {string} color Color
	 * @return {StyleBase} This style
	 */
	reset(color) {
		this._style       = color;
		this._color       = color;
		this._rgb         = null;
		this._hsl         = null;
		this._gradType    = null;
		this._gradParams  = null;
		this._gradColors  = [];
		this._alpha       = 1;
		this._composition = 'source-over';
		this._shadow      = new Shadow();
		return this;
	}

	/**~ja
	 * 色の名前を設定する
	 * @param {string=} color 色の名前
	 * @param {number=} [opt_alpha=1] アルファ 0-1
	 * @return {string|StyleBase} 色かこのスタイル
	 */
	/**~en
	 * Set the color name
	 * @param {string=} color Color name
	 * @param {number=} [opt_alpha=1] Alpha 0-1
	 * @return {string|StyleBase} Color or this style
	 */
	color(color, opt_alpha = 1) {
		if (arguments.length === 0) return this._color;
		checkColor(color);
		if (opt_alpha === 1) {
			this._clear();
			this._color = color;
			this._style = this._color;
		} else {
			//@ifdef ja
			if (Number.isNaN(opt_alpha)) throw 'STYLE::color: アルファの数値に間違いがあるようです。';
			//@endif
			//@ifdef en
			if (Number.isNaN(opt_alpha)) throw 'STYLE::color: The alpha value seem to be wrong.';
			//@endif
			const vs = convertColorToRgb(color, opt_alpha);
			this.rgb(...vs);
		}
		return this;
	}

	/**~ja
	 * RGB(A)を設定する
	 * @param {number=} r 赤 0-255
	 * @param {number=} g 緑 0-255
	 * @param {number=} b 青 0-255
	 * @param {number=} [opt_alpha=1] アルファ 0-1
	 * @return {Array<number>|StyleBase} RGBかこのスタイル
	 */
	/**~en
	 * Set RGB(A)
	 * @param {number=} r Red 0-255
	 * @param {number=} g Green 0-255
	 * @param {number=} b Blue 0-255
	 * @param {number=} [opt_alpha=1] Alpha 0-1
	 * @return {Array<number>|StyleBase} RGB or this style
	 */
	rgb(r, g, b, opt_alpha = 1) {
		if (arguments.length === 0) return this._rgb;
		this._clear();
		//~ja rとgとbを四捨五入して整数に
		//~en Round r and g and b to integers
		this._rgb = [Math.round(r), Math.round(g), Math.round(b), opt_alpha];
		this._style = `rgba(${this._rgb.join(', ')})`;
		return this;
	}

	/**~ja
	 * HSL(A)を設定する
	 * @param {number=} h 色相 0-360
	 * @param {number=} s 彩度 0-100
	 * @param {number=} l 明度 0-100
	 * @param {number=} [opt_alpha=1] アルファ 0-1
	 * @return {Array<number>|StyleBase} HSLかこのスタイル
	 */
	/**~en
	 * Set HSL(A)
	 * @param {number=} h Hue 0-360
	 * @param {number=} s Saturation 0-100
	 * @param {number=} l Lightness 0-100
	 * @param {number=} [opt_alpha=1] Alpha 0-1
	 * @return {Array<number>|StyleBase} HSL or this style
	 */
	hsl(h, s, l, opt_alpha = 1) {
		if (arguments.length === 0) return this._hsl;
		this._clear();
		this._hsl = [h, s, l, opt_alpha];
		this._style = `hsla(${h}, ${s}%, ${l}%, ${opt_alpha})`;
		return this;
	}

	/**~ja
	 * 色を明るくする
	 * @param {number} [opt_rate=10] 割合 %
	 * @return {StyleBase} このスタイル
	 */
	/**~en
	 * Lighten the color
	 * @param {number} [opt_rate=10] Rate %
	 * @return {StyleBase} This style
	 */
	lighten(opt_rate = 10) {
		if (this._color) {
			this._rgb = convertColorToRgb(this._color);
		}
		const p = opt_rate / 100;
		if (this._rgb) {
			const [r, g, b] = this._rgb;
			this._rgb[0] = Math.round(r + (255 - r) * p);
			this._rgb[1] = Math.round(g + (255 - g) * p);
			this._rgb[2] = Math.round(b + (255 - b) * p);
			this._style = `rgba(${this._rgb.join(', ')})`;
		} else if (this._hsl) {
			const [h, s, l, av] = this._hsl;
			this._hsl[2] = l + (100 - l) * p;
			this._style = `hsla(${h}, ${s}%, ${this._hsl[2]}%, ${av})`;
		}
		return this;
	}

	/**~ja
	 * 色を暗くする
	 * @param {number} [opt_rate=10] 割合 %
	 * @return {StyleBase} このスタイル
	 */
	/**~en
	 * Darken the color
	 * @param {number} [opt_rate=10] Rate %
	 * @return {StyleBase} This style
	 */
	darken(opt_rate = 10) {
		if (this._color) {
			this._rgb = convertColorToRgb(this._color);
		}
		const p = opt_rate / 100;
		if (this._rgb) {
			const [r, g, b] = this._rgb;
			this._rgb[0] = Math.round(r * (1.0 - p));
			this._rgb[1] = Math.round(g * (1.0 - p));
			this._rgb[2] = Math.round(b * (1.0 - p));
			this._style = `rgba(${this._rgb.join(', ')})`;
		} else if (this._hsl) {
			const [h, s, l, av] = this._hsl;
			this._hsl[2] = l * (1.0 - p);
			this._style = `hsla(${h}, ${s}%, ${this._hsl[2]}%, ${av})`;
		}
		return this;
	}

	/**~ja
	 * グラデーションを設定する
	 * - 線形の場合（'linear'、[開始座標x、y]、[終了座標x, y]）
	 * - 円形の場合（'radial'、[中心座標1 x、y]、[開始半径、終了半径]、<[中心座標2 x、y]>）
	 * - その他（'種類'）
	 * @param {string} type 種類（'linear', 'radial', その他）
	 * @param {Array<number>} xy1_dir [開始座標x, y]，または[中心座標1 x、y]
	 * @param {Array<number>} xy2_rs [終了座標x, y]，または[開始半径、終了半径]
	 * @param {Array<number>=} xy2 [中心座標2 x、y]
	 * @return {Array|StyleBase} グラデーションの設定かこのスタイル
	 */
	/**~en
	 * Set the gradation
	 * - Linear ('linear', [Start coordinates x, y], [End coordinates x, y])
	 * - Radial ('radial', [1st center coordinates x、y], [Start radius, End radius], <[2nd center coordinates x, y]>)
	 * - Others ('type')
	 * @param {string} type Type ('linear', 'radial', Others)
	 * @param {Array<number>} xy1_dir [Start coordinates x, y], or [1st center coordinates x、y]
	 * @param {Array<number>} xy2_rs [End coordinates x, y], or [Start radius, End radius]
	 * @param {Array<number>=} xy2 [2nd center coordinates x、y]
	 * @return {Array|StyleBase} Gradation setting or this style
	 */
	gradation(type, xy1_dir, xy2_rs, xy2) {
		if (arguments.length === 0) {
			return this._gradParams ? [this._gradType, ...this._gradParams] : [this._gradType];
		}
		if (!['linear', 'radial', 'vertical', 'horizontal', 'vector', 'inner', 'outer', 'diameter', 'radius'].includes(type)) {
			//@ifdef ja
			throw 'STYLE::gradation: グラデーションの種類が間違っています。';
			//@endif
			//@ifdef en
			throw 'STYLE::gradation: The type of gradation is incorrect.';
			//@endif
		}
		this._clear();
		this._gradType = type;
		if (type === 'linear') {
			this._gradParams = [xy1_dir[0], xy1_dir[1], xy2_rs[0], xy2_rs[1]];
		} else if (type === 'radial') {
			if (xy2 === undefined) {
				this._gradParams = [xy1_dir[0], xy1_dir[1], xy2_rs[0], xy1_dir[0], xy1_dir[1], xy2_rs[1]];
			} else {
				this._gradParams = [xy1_dir[0], xy1_dir[1], xy2_rs[0], xy2[0], xy2[1], xy2_rs[1]];
			}
		}
		return this;
	}

	/**~ja
	 * グラデーションに色の名前を追加する
	 * @param {string} color 色の名前
	 * @param {number=} [opt_alpha=1] アルファ 0-1
	 * @return {StyleBase} このスタイル
	 */
	/**~en
	 * Add a color name to the gradation
	 * @param {string} color Color name
	 * @param {number=} [opt_alpha=1] Alpha 0-1
	 * @return {StyleBase} This style
	 */
	addColor(color, opt_alpha = 1) {
		//~ja キャッシュを無効に
		//~en Disable caching
		this._style = null;
		checkColor(color);
		if (opt_alpha === 1) {
			this._gradColors.push(color);
		} else {
			//@ifdef ja
			if (Number.isNaN(opt_alpha)) throw 'STYLE::addColor: アルファの数値に間違いがあるようです。';
			//@endif
			//@ifdef en
			if (Number.isNaN(opt_alpha)) throw 'STYLE::addColor: The alpha value seem to be wrong.';
			//@endif
			const vs = convertColorToRgb(color, opt_alpha);
			this.addRgb(...vs);
		}
		return this;
	}

	/**~ja
	 * グラデーションにRGB(A)を追加する
	 * @param {number} r 赤 0-255
	 * @param {number} g 緑 0-255
	 * @param {number} b 青 0-255
	 * @param {number=} [opt_alpha=1] アルファ 0-1
	 * @return {StyleBase} このスタイル
	 */
	/**~en
	 * Add RGB(A) to the gradation
	 * @param {number} r Red 0-255
	 * @param {number} g Green 0-255
	 * @param {number} b Blue 0-255
	 * @param {number=} [opt_alpha=1] Alpha 0-1
	 * @return {StyleBase} This style
	 */
	addRgb(r, g, b, opt_alpha = 1) {
		//~ja キャッシュを無効に
		//~en Disable caching
		this._style = null;
		//~ja rとgとbを四捨五入して整数に
		//~en Round r and g and b to integers
		r = Math.round(r), g = Math.round(g), b = Math.round(b);
		//~ja アルファが無かったら
		//~en If the alpha is not assigned
		if (opt_alpha === 1) {
			this._gradColors.push(`rgb(${r}, ${g}, ${b})`);
		} else {
			this._gradColors.push(`rgba(${r}, ${g}, ${b}, ${opt_alpha})`);
		}
		return this;
	}

	/**~ja
	 * グラデーションにHSL(A)を追加する
	 * @param {number} h 色相 0-360
	 * @param {number} s 彩度 0-100
	 * @param {number} l 明度 0-100
	 * @param {number=} [opt_alpha=1] アルファ 0-1
	 * @return {StyleBase} このスタイル
	 */
	/**~en
	 * Add HSL(A) to the gradation
	 * @param {number} h Hue 0-360
	 * @param {number} s Saturation 0-100
	 * @param {number} l Lightness 0-100
	 * @param {number=} [opt_alpha=1] Alpha 0-1
	 * @return {StyleBase} This style
	 */
	addHsl(h, s, l, opt_alpha = 1) {
		//~ja キャッシュを無効に
		//~en Disable caching
		this._style = null;
		//~ja アルファが無かったら
		//~en If the alpha is not assigned
		if (opt_alpha === 1) {
			this._gradColors.push(`hsl(${h}, ${s}%, ${l}%)`);
		} else {
			this._gradColors.push(`hsla(${h}, ${s}%, ${l}%, ${opt_alpha})`);
		}
		return this;
	}

	/**~ja
	 * アルファをセットする
	 * @param {number=} alpha アルファ
	 * @param {string=} op 四則演算記号
	 * @return {number|StyleBase} アルファかこのスタイル
	 */
	/**~en
	 * Set alpha
	 * @param {number=} alpha Alpha
	 * @param {string=} op Arithmetic symbol
	 * @return {number|StyleBase} Alpha or this style
	 */
	alpha(alpha, op) {
		if (alpha === undefined) return this._alpha;
		if (op === undefined) {
			this._alpha = alpha;
		} else {
			switch (op) {
				case '+': this._alpha += alpha; break;
				case '-': this._alpha -= alpha; break;
				case '*': this._alpha *= alpha; break;
				case '/': this._alpha /= alpha; break;
			}
		}
		return this;
	}

	/**~ja
	 * コンポジション（合成方法）をセットする
	 * @param {string=} composition コンポジション
	 * @return {string|StyleBase} コンポジションかこのスタイル
	 */
	/**~en
	 * Set composition (composition method)
	 * @param {string=} composition Composition
	 * @return {string|StyleBase} Composition or this style
	 */
	composition(composition) {
		if (composition === undefined) return this._composition;
		this._composition = composition;
		return this;
	}

	/**~ja
	 * 影をセットする
	 * @param {number?} blur ぼかし量
	 * @param {string?} color 色
	 * @param {number?} x 影のずれx
	 * @param {number?} y 影のずれy
	 * @return {Shadow|StyleBase} 影かこのスタイル
	 */
	/**~en
	 * Set shadow
	 * @param {number?} blur Blur amount
	 * @param {string?} color Color
	 * @param {number?} x Shadow offset x
	 * @param {number?} y Shadow offset y
	 * @return {Shadow|StyleBase} Shadow or this style
	 */
	shadow(blur, color, x, y) {
		if (blur === undefined) return this._shadow.get();
		if (blur === false || blur === null) {
			this._shadow.clear();
		} else {
			this._shadow.set(blur, color, x, y);
		}
		return this;
	}

	/**~ja
	 * 設定をクリアする（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Clear settings (used only in the library)
	 * @private
	 */
	_clear() {
		this._style       = null;
		this._color       = null;
		this._rgb         = null;
		this._hsl         = null;
		this._gradType    = null;
		this._gradParams  = null;
		this._gradColors  = [];
		this._gradBsCache = null;
	}

	/**~ja
	 * スタイルを作る（ライブラリ内だけで使用）
	 * @private
	 * @param {CanvasRenderingContext2D} ctx キャンバス・コンテキスト
	 * @param {Array<number>} gradArea グラデーション範囲
	 * @return {string} スタイル文字列
	 */
	/**~en
	 * Make the style (used only in the library)
	 * @private
	 * @param {CanvasRenderingContext2D} ctx Canvas context
	 * @param {Array<number>} gradArea Gradation area
	 * @return {string} Style string
	 */
	_makeStyle(ctx, gradArea) {
		this._gradOpt = {};
		//~ja グラデーションの時
		//~en When gradation
		if (this._gradType !== null) {
			if (this._style === null || (this._gradType !== 'linear' && this._gradType !== 'radial')) {
				this._style = this._makeGrad(ctx, gradArea, this._gradType, this._gradParams, this._gradColors, this._gradOpt);
			}
		}
		return this._style;
	}

	/**~ja
	 * グラデーションを作る（ライブラリ内だけで使用）
	 * @private
	 * @param {CanvasRenderingContext2D} ctx キャンバス・コンテキスト
	 * @param {dict} bs 範囲
	 * @param {string} type 種類
	 * @param {Array} params パラメター
	 * @param {Array<string>} cs 色の配列
	 * @param {dict} opt オプション
	 * @return {string} スタイル文字列
	 */
	/**~en
	 * Make a gradation (used only in the library)
	 * @private
	 * @param {CanvasRenderingContext2D} ctx Canvas context
	 * @param {dict} bs Bounds
	 * @param {string} type Type
	 * @param {Array} params Parameters
	 * @param {Array<string>} cs Colors
	 * @param {dict} opt Options
	 * @return {string} String of style
	 */
	_makeGrad(ctx, bs, type, params, cs, opt) {
		if (cs.length === 0) return 'Black';
		if (cs.length === 1) return cs[0];

		let style;
		switch (type) {
			case 'linear':
				style = ctx.createLinearGradient.apply(ctx, params);
				break;
			case 'vertical': case 'horizontal': case 'vector': default:
				style = ctx.createLinearGradient.apply(ctx, this._makeLinearGradParams(ctx, type, bs));
				break;
			case 'radial':
				style = ctx.createRadialGradient.apply(ctx, params);
				break;
			case 'inner': case 'outer': case 'diameter': case 'radius':
				style = ctx.createRadialGradient.apply(ctx, this._makeRadialGradParams(ctx, type, bs, opt));
				break;
		}
		for (let i = 0, I = cs.length; i < I; i += 1) {
			style.addColorStop(i / (I - 1), cs[i]);
		}
		return style;
	}

	/**~ja
	 * 線形グラデーションのパラメターを作る（ライブラリ内だけで使用）
	 * @private
	 * @param {CanvasRenderingContext2D} ctx キャンバス・コンテキスト
	 * @param {string} type 種類
	 * @param {dict} bs 範囲
	 * @return {Array<number>} 線形グラデーションのパラメター
	 */
	/**~en
	 * Make linear gradation parameters (used only in the library)
	 * @private
	 * @param {CanvasRenderingContext2D} ctx Canvas context
	 * @param {string} type Type
	 * @param {dict} bs Bounds
	 * @return {Array<number>} Linear gradation parameters
	 */
	_makeLinearGradParams(ctx, type, bs) {
		//@ifdef ja
		const ERROR_STR = 'STYLE::_makeLinerGradParams: グラデーションの範囲が正しくありません。';
		//@endif
		//@ifdef en
		const ERROR_STR = 'STYLE::_makeLinerGradParams: Gradation bounds are not correct.';
		//@endif
		if (type === 'vertical') {
			if (bs && (bs.left == null || bs.top == null || bs.right == null || bs.bottom == null)) throw new Error(ERROR_STR);
			if (bs) return [bs.left, bs.top, bs.left, bs.bottom];
			else return [0, 0, 0, ctx.canvas.height];
		} else if (type === 'horizontal') {
			if (bs && (bs.left == null || bs.top == null || bs.right == null || bs.bottom == null)) throw new Error(ERROR_STR);
			if (bs) return [bs.left, bs.top, bs.right, bs.top];
			else return [0, 0, ctx.canvas.width, 0];
		} else {  // type === 'vector'
			if (bs && (bs.fromX == null || bs.fromY == null || bs.toX == null || bs.toY == null)) throw new Error(ERROR_STR);
			if (bs) return [bs.fromX, bs.fromY, bs.toX, bs.toY];
			else return [0, 0, ctx.canvas.width, ctx.canvas.height];
		}
	}

	/**~ja
	 * 円形グラデーションのパラメターを作る（ライブラリ内だけで使用）
	 * @private
	 * @param {CanvasRenderingContext2D} ctx キャンバス・コンテキスト
	 * @param {string} type 種類
	 * @param {dict} bs 範囲
	 * @param {dict} opt オプション
	 * @return {Array<number>} 円形グラデーションのパラメター
	 */
	/**~en
	 * Make radial gradation parameters (used only in the library)
	 * @private
	 * @param {CanvasRenderingContext2D} ctx Canvas context
	 * @param {string} type Type
	 * @param {dict} bs Bounds
	 * @param {dict} opt Options
	 * @return {Array<number>} Radial gradation parameters
	 */
	_makeRadialGradParams(ctx, type, bs, opt) {
		const SQRT2 = 1.41421356237;
		const cw = ctx.canvas.width, ch = ctx.canvas.height;
		const bb = bs ? bs : { left: 0, top: 0, right: cw, bottom: ch, fromX: 0, fromY: 0, toX: cw, toY: ch };
		const _f = (x0, y0, x1, y1) => {
			return { w: Math.abs(x0 - x1), h: Math.abs(y0 - y1), cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
		};
		let r, p;
		if (type === 'inner' || type === 'outer') {
			p = _f(bb.left, bb.top, bb.right, bb.bottom);
			opt.scale = ((p.w < p.h) ? [p.w / p.h, 1] : [1, p.h / p.w]);
			opt.center = [p.cx, p.cy];
			r = ((p.w < p.h) ? p.h : p.w) / 2;
			if (type === 'outer') r *= SQRT2;
		} else {  // type === 'diameter' || type === 'radius'
			p = _f(bb.fromX, bb.fromY, bb.toX, bb.toY);
			r = Math.sqrt(p.w * p.w + p.h * p.h);
			if (type === 'diameter') {
				r /= 2;
			} else {  // type === 'radius'
				p.cx = bb.fromX; p.cy = bb.fromY;
			}
		}
		return [p.cx, p.cy, 0, p.cx, p.cy, r];
	}

	/**~ja
	 * 円形グラデーションのオプションをセットする（ライブラリ内だけで使用）
	 * @private
	 * @param {CanvasRenderingContext2D} ctx キャンバス・コンテキスト
	 * @param {Array<number>} opt オプション
	 */
	/**~en
	 * Set radial gradation options (used only in the library)
	 * @private
	 * @param {CanvasRenderingContext2D} ctx Canvas context
	 * @param {Array<number>} opt Options
	 */
	_setGradOpt(ctx, opt) {
		ctx.translate(opt.center[0], opt.center[1]);
		ctx.scale(opt.scale[0], opt.scale[1]);
		ctx.translate(-opt.center[0], -opt.center[1]);
	}

}

StyleBase.prototype.grad = StyleBase.prototype.gradation;