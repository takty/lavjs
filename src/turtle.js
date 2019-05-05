//
// タートル・ライブラリ（TURTLE）
// 日付: 2019-04-22
// 作者: 柳田拓人（Space-Time Inc.）
//
// カメを動かして、絵をかくためのライブラリです。
//


// ライブラリ変数
const TURTLE = (function () {

	'use strict';




	// -------------------------------------------------------------------------
	// ライブラリ中だけで使用するユーティリティ
	// -------------------------------------------------------------------------




	// 角度をラジアンにする
	const rad = function (deg) {
		return deg * Math.PI / 180.0;
	};

	// 角度を0～360度の範囲にする
	const checkDegRange = function (deg) {
		deg %= 360;
		if (deg < 0) deg += 360;
		return deg;
	};

	// 影をセットする
	const setShadow = function (ctx, blur, off, color = 'rgba(0,0,0,0.5)') {
		ctx.shadowBlur = blur;
		ctx.shadowOffsetX = ctx.shadowOffsetY = off;
		ctx.shadowColor = color;
	};




	//
	//=include _turtleBase.js




	//
	//=include _turtle.js




	// -------------------------------------------------------------------------
	// ユーティリティ関数
	// -------------------------------------------------------------------------




	// タートルを使ってかく関数からスタンプ（高速に絵をかく関数）を作ります（スタンプの横幅、たて幅、スタンプの中心x座標、y座標、拡大率、関数）
	const makeStamp = function (width, height, cx, cy, scale, func) {
		let curArgs = null, cacheCtx = null, cacheT = null;

		function isSame(a0, a1) {
			if (a0.length !== a1.length) return false;
			for (let i = 0, I = a0.length; i < I; i += 1) {
				if (a0[i] !== a1[i]) return false;
			}
			return true;
		}
		return function (t, ...var_args) {
			if (!cacheCtx) {
				cacheCtx = new CROQUJS.Paper(width, height, false);
				cacheCtx.translate(cx, cy);
				t.context().addChild(cacheCtx);
				cacheT = new TURTLE.Turtle(cacheCtx);
			}
			if (!curArgs || !isSame(curArgs, var_args)) {
				cacheCtx.clear();
				var_args.unshift(cacheT);  // cacheTを挿入
				func.apply(null, var_args);
				curArgs = var_args.slice(1);  // cacheTを削除
			}
			t.image(cacheCtx, cx, cy, scale);
		};
	};




	// -------------------------------------------------------------------------
	// ライブラリを作る
	// -------------------------------------------------------------------------




	// 関数の別名
	const aliasMap = {
		go            : ['forward', 'fd'],
		back          : ['bk', 'backward'],
		step          : ['unit'],
		turnRight     : ['tr', 'right', 'rt'],
		turnLeft      : ['tl', 'left', 'lt'],
		direction     : ['heading'],
		curveRight    : ['cr'],
		curveLeft     : ['cl'],
		arcRight      : ['ar'],
		arcLeft       : ['al'],
		getDirectionOf: ['towards'],
		penDown       : ['pd', 'down'],
		penUp         : ['pu', 'up'],
	};

	// 関数の別名を登録する
	for (let target of [Turtle, TurtleBase]) {
		for (const [orig, aliases] of Object.entries(aliasMap)) {
			for (let alias of aliases) {
				target.prototype[alias] = target.prototype[orig];
			}
		}
	}

	// ライブラリとして返す
	return { Turtle, TurtleBase, makeStamp };

}());
