// -------------------------------------------------------------------------
// 影 (STYLE.Shadow)
// -------------------------------------------------------------------------




class Shadow {

	// 影を作る（<元になる影>）
	constructor(shadow) {
		this._blur = shadow ? shadow._blur : 0;
		this._color = shadow ? shadow._color : 0;
		this._offsetX = shadow ? shadow._offsetX : 0;
		this._offsetY = shadow ? shadow._offsetY : 0;
	}

	// 設定を配列でもらう
	get() {
		return [this._blur, this._color, this._offsetX, this._offsetY];
	}

	// 設定する（ぼかし量、色、影のずれx、y）
	set(blur, color, x, y) {
		if (blur != null) this._blur = blur;  // 値がセットされているか!=でチェック（以下同じ）
		if (color != null) this._color = color;
		if (x != null) this._offsetX = x;
		if (y != null) this._offsetY = y;
	}

	// クリアする
	clear() {
		this._blur = 0;
		this._color = 0;
		this._offsetX = 0;
		this._offsetY = 0;
	}

	// 影の設定を適用する（キャンバス・コンテキスト）
	assign(ctx) {
		ctx.shadowBlur = this._blur;
		ctx.shadowColor = this._color;
		ctx.shadowOffsetX = this._offsetX;
		ctx.shadowOffsetY = this._offsetY;
	}

}