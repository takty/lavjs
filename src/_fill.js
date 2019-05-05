// -------------------------------------------------------------------------
// フィル (STYLE.Fill)
// -------------------------------------------------------------------------




class Fill extends StyleBase {

	// ぬりスタイルを作る（<元になるぬりスタイル>）
	constructor(base) {
		super(base, 'White');
	}

	// 設定を全てリセットする
	reset(color) {
		super.reset(color);
		return this;
	}

	// gradArea = {fromX, fromY, toX, toY, left, top, right, bottom}

	// キャンバス・コンテキストにぬりスタイルを設定する（キャンバス・コンテキスト、グラデーション範囲）
	assign(ctx, gradArea) {
		ctx.fillStyle = this._makeStyle(ctx, gradArea);
		ctx.globalAlpha *= this._alpha;
		ctx.globalCompositeOperation = this._composition;
		this._shadow.assign(ctx);
		if (this._gradOpt.scale) this._setGradOpt(ctx, this._gradOpt);
	}

	// ぬりスタイルを使って形をかく（キャンバス・コンテキスト、グラデーション範囲）
	draw(ctx, gradArea) {
		ctx.save();
		this.assign(ctx, gradArea);
		ctx.fill();
		ctx.restore();
	}

}