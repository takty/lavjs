//
// スプライト・ライブラリ（SPRITE）
// 日付: 2019-04-22
// 作者: 柳田拓人（Space-Time Inc.）
//
// スプライト（アニメのセル画のようなもの）を作って、
// 好きな場所に好きな大きさ、向き、透明度で表示するためのライブラリです。
//


// ライブラリ変数
const SPRITE = (function () {

	'use strict';




	// -------------------------------------------------------------------------
	// ライブラリ中だけで使用するユーティリティ
	// -------------------------------------------------------------------------




	// 角度を0～360度の範囲にする
	const checkDegRange = function (deg) {
		deg %= 360;
		if (deg < 0) deg += 360;
		return deg;
	};

	// 関数なら関数を呼び出し、値ならそのまま返す
	const valueFunction = function (vf) {
		if (typeof vf === 'function') {
			return vf();
		} else {
			return vf;
		}
	};

	// 範囲をチェックする関数を作る
	const makeRangeChecker = function (min, max, isLoop) {
		if (isLoop) {
			return function (v) {
				if (v < min) return max;
				if (max < v) return min;
				return v;
			}
		} else {
			return function (v) {
				if (v < min) return min;
				if (max < v) return max;
				return v;
			}
		}
	};




	//
	//=include _element.js




	//
	//=include _sprite.js




	//
	//=include _stage.js




	// -------------------------------------------------------------------------
	// ユーティリティ関数
	// -------------------------------------------------------------------------




	// スプライトの軌跡をプロットする関数を作る（子孫要素、先祖ステージ、プロットするコンテキスト）
	const makePlotFunction = function (descendant, ancestorStage, ctx) {
		let old = [];
		return function () {
			if (!descendant._fisrtUpdated) return;
			const p = ancestorStage.getPositionOnContext(descendant);
			if (old.length > 0) {
				ctx.beginPath();
				ctx.moveTo(old[0], old[1]);
				ctx.lineTo(p[0], p[1]);
				ctx.stroke();
			}
			old = p;
		};
	};




	// -------------------------------------------------------------------------
	// ライブラリを作る
	// -------------------------------------------------------------------------




	// ライブラリとして返す
	return { Stage, Sprite, makePlotFunction };

}());
