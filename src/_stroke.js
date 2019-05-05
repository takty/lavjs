// -------------------------------------------------------------------------
// ストローク (STYLE.Stroke)
// -------------------------------------------------------------------------




class Stroke extends StyleBase {

	// 線スタイルを作る（<元になる線スタイル>）
	constructor(base) {
		super(base, 'Black');

		this._width = base ? base._width : 1;
		this._cap = base ? base._cap : 'butt';
		this._join = base ? base._join : 'bevel';
		this._miterLimit = base ? base._miterLimit : 10;

		this._dash = base ? base._dash : null;
		this._dashOffset = base ? base._dashOffset : 0;
	}

	// 設定を全てリセットする
	reset(color) {
		super.reset(color);

		this._width = 1;
		this._cap = 'butt';
		this._join = 'bevel';
		this._miterLimit = 10;

		this._dash = null;
		this._dashOffset = 0;
		return this;
	}

	// 線の太さを設定する（線の太さ）
	width(width) {
		if (width === undefined) return this._width;
		this._width = width;
		return this;
	}

	// 線のはしを設定する（線のはし）
	cap(cap) {
		if (cap === undefined) return this._cap;
		this._cap = cap;
		return this;
	}

	// 線のつなぎを設定する（線のつなぎ）
	join(join) {
		if (join === undefined) return this._join;
		this._join = join;
		return this;
	}

	// 線の角の出っ張りの上限を設定する（線の角の出っ張りの上限）
	miterLimit(miterLimit) {
		if (miterLimit === undefined) return this._miterLimit;
		this._miterLimit = miterLimit;
		return this;
	}

	// 点線のパターンを設定する（点線のパターン）
	dash(...dash) {
		if (dash === undefined) return this._dash.concat();
		if (Array.isArray(dash[0])) {
			this._dash = [...dash[0]];
		} else {
			this._dash = [...dash];
		}
		return this;
	}

	// 点線のパターンのずれを設定する（点線のパターンのずれ）
	dashOffset(dashOffset) {
		if (dashOffset === undefined) return this._dashOffset;
		this._dashOffset = dashOffset;
		return this;
	}

	// gradArea = {fromX, fromY, toX, toY, left, top, right, bottom}

	// キャンバス・コンテキストに線スタイルを設定する（キャンバス・コンテキスト、グラデーション範囲）
	assign(ctx, gradArea) {
		ctx.strokeStyle = this._makeStyle(ctx, gradArea);
		ctx.globalAlpha *= this._alpha;
		ctx.globalCompositeOperation = this._composition;
		this._shadow.assign(ctx);
		if (this._gradOpt.scale) this._setGradOpt(ctx, this._gradOpt);

		ctx.lineWidth = this._width;
		ctx.lineCap = this._cap;
		ctx.lineJoin = this._join;
		ctx.miterLimit = this._miterLimit;

		ctx.setLineDash(this._dash ? this._dash : []);
		ctx.lineDashOffset = this._dashOffset;
	}

	// 線スタイルを使って線をかく（キャンバス・コンテキスト、グラデーション範囲）
	draw(ctx, gradArea) {
		ctx.save();
		this.assign(ctx, gradArea);
		ctx.stroke();
		ctx.restore();
	}

}