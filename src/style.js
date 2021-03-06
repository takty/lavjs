/**~ja
 * スタイル・ライブラリ（STYLE）
 *
 * 絵をかくときの線やぬりのスタイルを簡単に設定することができるようにするためのライブラリです。
 *
 * @author Takuto Yanagida
 * @version 2020-04-21
 */
/**~en
 * Style library (STYLE)
 *
 * A library to make it easy to set the style of strokes and filling when painting
 *
 * @author Takuto Yanagida
 * @version 2020-04-21
 */


/**~ja
 * ライブラリ変数
 */
/**~en
 * Library variable
 */
const STYLE = (function () {

	'use strict';


	//=
	//=include _graphic/_style-base.js


	//=
	//=include _graphic/_shadow.js


	//=
	//=include _graphic/_fill.js


	//=
	//=include _graphic/_stroke.js


	//~ja ユーティリティ関数 ------------------------------------------------------
	//~en Utility functions -------------------------------------------------------


	/**~ja
	 * 紙を拡張する
	 * @param {Paper|CanvasRenderingContext2D} ctx 紙／キャンバス・コンテキスト
	 */
	/**~en
	 * Augment papers
	 * @param {Paper|CanvasRenderingContext2D} ctx Paper or canvas context
	 */
	const augment = (ctx) => {
		if (ctx['styleFill'] && ctx['styleStroke'] && ctx['styleClear']) return;
		let fill = makeFill(ctx), stroke = makeStroke(ctx), clear = makeClear(ctx);
		ctx.styleFill   = (opt_fill) => {
			if (opt_fill !== undefined) fill = makeFill(ctx, opt_fill);
			return fill;
		};
		ctx.styleStroke = (opt_stroke) => {
			if (opt_stroke !== undefined) stroke = makeStroke(ctx, opt_stroke);
			return stroke;
		};
		ctx.styleClear  = (opt_clear) => {
			if (opt_clear !== undefined) clear = makeClear(ctx, opt_clear);
			return clear;
		};
		function makeFill(ctx, opt_fill) {
			const fill = new Fill(opt_fill);
			fill.draw = Fill.prototype.draw.bind(fill, ctx);
			return fill;
		}
		function makeStroke(ctx, opt_stroke) {
			const stroke = new Stroke(opt_stroke);
			stroke.draw = Stroke.prototype.draw.bind(stroke, ctx);
			return stroke;
		}
		function makeClear(ctx, opt_clear) {
			const clear = new Fill(opt_clear);
			clear.draw = function () {
				ctx.save();
				this.assign(ctx);
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
				ctx.restore();
			}.bind(clear);
			return clear;
		}
	};


	//=
	//=include _graphic/_color-table.js


	//~ja ライブラリを作る --------------------------------------------------------
	//~en Create a library --------------------------------------------------------


	return { Shadow, Fill, Stroke, augment };

}());
