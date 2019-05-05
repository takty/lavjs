// -------------------------------------------------------------------------
// ストローク・フィル共通
// -------------------------------------------------------------------------




class StyleBase {

	// （<元になるぬりスタイル>、標準の色）
	constructor(base, color) {
		this._style = base ? base._style : color;
		this._color = base ? base._color : color;
		this._rgb = base ? base._rgb : null;
		this._hsl = base ? base._hsl : null;
		this._gradType = base ? base._gradType : null;
		this._gradParams = base ? base._gradParams : null;
		this._gradColors = base ? [...base._gradColors] : [];
		this._alpha = base ? base._alpha : 1;
		this._composition = base ? base._composition : 'source-over';
		this._shadow = base ? new Shadow(base._shadow) : new Shadow();
	}

	// 設定を全てリセットする
	reset(color) {
		this._style = color;
		this._color = color;
		this._rgb = null;
		this._hsl = null;
		this._gradType = null;
		this._gradParams = null;
		this._gradColors = [];
		this._alpha = 1;
		this._composition = 'source-over';
		this._shadow = new Shadow();
		return this;
	}

	// 色の名前を設定する（色の名前、<アルファ0~1>）
	color(color, opt_alpha = 1) {
		if (arguments.length === 0) return this._color;
		checkColor(color);
		if (opt_alpha === 1) {
			this._clear();
			this._color = color;
			this._style = this._color;
		} else {
			if (Number.isNaN(opt_alpha)) throw 'アルファの数値に間違いがあるようです。';
			const vs = convertColorToRgb(color, opt_alpha);
			this.rgb(...vs);
		}
		return this;
	}

	// RGB(A)を設定する（赤0~255、緑0~255、青0~255、<アルファ0~1>）
	rgb(r, g, b, opt_alpha = 1) {
		if (arguments.length === 0) return this._rgb;
		this._clear();
		this._rgb = [Math.round(r), Math.round(g), Math.round(b), opt_alpha];  // rとgとbを四捨五入して整数に
		this._style = `rgba(${this._rgb.join(', ')})`;
		return this;
	}

	// HSL(A)を設定する（色相0~360、彩度0~100、明度0~100、<アルファ0~1>）
	hsl(h, s, l, opt_alpha = 1) {
		if (arguments.length === 0) return this._hsl;
		this._clear();
		this._hsl = [h, s, l, opt_alpha];
		this._style = `hsla(${h}, ${s}%, ${l}%, ${opt_alpha})`;
		return this;
	}

	// 色を明るくする（<割合%>）
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

	// 色を暗くする（<割合%>）
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

	// グラデーションを設定する
	// ・線形の場合（'linear'、[開始座標x, y]、[終了座標x, y]）
	// ・円形の場合（'radial'、[中心座標1 x、y]、[開始半径、終了半径]、<[中心座標2 x、y]>）
	// ・その他（'種類'）
	gradation(type, xy1_dir, xy2_rs, xy2) {
		if (arguments.length === 0) {
			return this._gradParams ? [this._gradType, ...this._gradParams] : [this._gradType];
		}
		if (!['linear', 'radial', 'vertical', 'horizontal', 'vector', 'inner', 'outer', 'diameter', 'radius'].includes(type)) {
			throw 'グラデーションの種類が間違っています。';
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

	// グラデーションに色の名前を追加する（色の名前、<アルファ0~1>）
	addColor(color, opt_alpha = 1) {
		this._style = null;  // キャッシュを無効に
		checkColor(color);
		if (opt_alpha === 1) {
			this._gradColors.push(color);
		} else {
			if (Number.isNaN(opt_alpha)) throw 'アルファの数値に間違いがあるようです。';
			const vs = convertColorToRgb(color, opt_alpha);
			this.addRgb(...vs);
		}
		return this;
	}

	// グラデーションにRGB(A)を追加する（赤0~255、緑0~255、青0~255、<アルファ0~1>）
	addRgb(r, g, b, opt_alpha = 1) {
		this._style = null;  // キャッシュを無効に
		r = Math.round(r), g = Math.round(g), b = Math.round(b);  // rとgとbを四捨五入して整数に直す
		if (opt_alpha === 1) {  // アルファが無かったら
			this._gradColors.push(`rgb(${r}, ${g}, ${b})`);
		} else {
			this._gradColors.push(`rgba(${r}, ${g}, ${b}, ${opt_alpha})`);
		}
		return this;
	}

	// グラデーションにHSL(A)を追加する（色相0~360、彩度0~100、明度0~100、<アルファ0~1>）
	addHsl(h, s, l, opt_alpha = 1) {
		this._style = null;  // キャッシュを無効に
		if (opt_alpha === 1) {  // アルファが無かったら
			this._gradColors.push(`hsl(${h}, ${s}%, ${l}%)`);
		} else {
			this._gradColors.push(`hsla(${h}, ${s}%, ${l}%, ${opt_alpha})`);
		}
		return this;
	}

	// アルファをセットする（アルファ、四則演算記号）
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

	// コンポジション（合成方法）をセットする（コンポジション）
	composition(composition) {
		if (composition === undefined) return this._composition;
		this._composition = composition;
		return this;
	}

	// 影をセットする（ぼかし量、色、影のずれx、y）
	shadow(blur, color, x, y) {
		if (blur === undefined) return this._shadow.get();
		if (blur === false || blur === null) {
			this._shadow.clear();
		} else {
			this._shadow.set(blur, color, x, y);
		}
		return this;
	}

	// （ライブラリ内だけで使用）設定をクリアする
	_clear() {
		this._style = null;
		this._color = null;
		this._rgb = null;
		this._hsl = null;
		this._gradType = null;
		this._gradParams = null;
		this._gradColors = [];
		this._gradBsCache = null;
	}

	// （ライブラリ内だけで使用）スタイルを作る
	_makeStyle(ctx, gradArea) {
		this._gradOpt = {};
		if (this._gradType !== null) {  // グラデーションの時
			if (this._style === null || (this._gradType !== 'linear' && this._gradType !== 'radial')) {
				this._style = this._makeGrad(ctx, gradArea, this._gradType, this._gradParams, this._gradColors, this._gradOpt);
			}
		}
		return this._style;
	}

	// （ライブラリ内だけで使用）グラデーションを作る
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
			style.addColorStop(i / (I - 1), cs[i]);  // 色を追加する
		}
		return style;
	}

	// （ライブラリ内だけで使用）線形グラデーションのパラメターを作る
	_makeLinearGradParams(ctx, type, bs) {
		const ERROR_STR = 'STYLE::_makeLinerGradParams: Gradation bounds are not correct.';
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

	// （ライブラリ内だけで使用）円形グラデーションを作る
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

	// （ライブラリ内だけで使用）円形グラデーションのオプションをセットする
	_setGradOpt(ctx, opt) {
		ctx.translate(opt.center[0], opt.center[1]);
		ctx.scale(opt.scale[0], opt.scale[1]);
		ctx.translate(-opt.center[0], -opt.center[1]);
	}

}

StyleBase.prototype.grad = StyleBase.prototype.gradation;