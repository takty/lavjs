// -------------------------------------------------------------------------
// スプライト (SPRITE.Sprite)
// -------------------------------------------------------------------------




class Sprite extends Element {

	// スプライトを作る（絵を描く関数、<関数に渡す引数の配列>、<モーション>）
	// ※ただし普通は、SPRITE.MasterのmakeSprite関数を使う。
	constructor(drawFunction, opt_args_array, opt_motion) {
		super(opt_motion);

		this._drawFunction = drawFunction;  // 絵を描く関数
		this._drawFunctionArgs = opt_args_array;
	}

	// スプライトを描く（キャンバス・コンテキスト、その他の引数の配列）
	draw(ctx, args_array) {
		let args = args_array;
		if (this._drawFunctionArgs) {
			args = args_array.concat(this._drawFunctionArgs);
		}
		if (this._fisrtUpdated) {
			ctx.save();  // コンテキストの状態を保存
			this._setTransformation(ctx);
			this._drawFunction.apply(this, args);  // 絵を描く関数を呼び出す
			ctx.restore();  // コンテキストの状態を元に戻す
		}
		this._update();
	}

}