/**~ja
 * フォルマント・ライブラリー（CJSTRE）
 * @author Takuto Yanagida
 * @version 2020-04-23
 *
 * 音を鳴らすための部品を作るライブラリです。
 */


var CJSTRE = (function() {

	'use strict';


	// ================================================ パッチ共通メソッド


	class Patch {

		set(ps_key, undef_val) {
			var setVal = function (key, val) {
				if (typeof val === 'number' || typeof val === 'string' || typeof val === 'boolean') {
					if (this[key] === undefined) throw 'Parameter name "' + key + '" is wrong.';
					this[key] = val;
				} else if (val.output !== undefined) {
					val.plug(this._getTarget(key));
				}
			}.bind(this);

			if (undef_val === undefined) {
				for (var key in ps_key) setVal(key, ps_key[key]);
			} else {
				setVal(ps_key, undef_val);
			}
			this._update();
			return this;
		}

		plug(target, opt_param) {
			this._targets.push(target._getTarget(opt_param));
			return target;
		}

		unplug() {
			this._targets.length = 0;
		}

	}


	// ================================================ フォルマント・パッチ


	class FormantPatch extends Patch {

		constructor(quilt, params) {
			this._quilt = quilt;
			this._targets = [];
			this._pluged = null;

			this.freq1 = par(params, 'freq1', 700);
			this.freq2 = par(params, 'freq2', 1200);
			this.freq3 = par(params, 'freq3', 2900);
			this.q1 = par(params, 'q1', 32);
			this.q2 = par(params, 'q2', 32);
			this.q3 = par(params, 'q3', 32);
		}

		_update() {
			if (this.f1 && this.f1.frequency.value !== this.freq1) this.f1.frequency.value = this.freq1;
			if (this.f2 && this.f2.frequency.value !== this.freq2) this.f2.frequency.value = this.freq2;
			if (this.f3 && this.f3.frequency.value !== this.freq3) this.f3.frequency.value = this.freq3;
			if (this.f1 && this.f1.Q.value !== this.q1) this.f1.Q.value = this.q1;
			if (this.f2 && this.f2.Q.value !== this.q2) this.f2.Q.value = this.q2;
			if (this.f3 && this.f3.Q.value !== this.q3) this.f3.Q.value = this.q3;
		}

		_getTarget(opt_param) {
			if (opt_param === undefined) {
				return function () { return this.i; }.bind(this);
			} else {
				if (opt_param === 'amp') {
					return function () { return this.a.gain; }.bind(this);
				}
			}
		}

		_construct() {
			this.i = this._quilt.context.createBiquadFilter();
			this.i.type = 'lowpass';
			this.i.Q.value = 1;
			this.i.frequency.value = 800;

			this.f1 = this._quilt.context.createBiquadFilter();
			this.f2 = this._quilt.context.createBiquadFilter();
			this.f3 = this._quilt.context.createBiquadFilter();

			this.f1.type = 'bandpass';
			this.f2.type = 'bandpass';
			this.f3.type = 'bandpass';

			this.f1.frequency.value = this.freq1;
			this.f2.frequency.value = this.freq2;
			this.f3.frequency.value = this.freq3;

			this.f1.Q.value = this.q1;
			this.f2.Q.value = this.q2;
			this.f3.Q.value = this.q3;

			this.a = this._quilt.context.createGain();

			this.i.connect(this.f1);
			this.i.connect(this.f2);
			this.i.connect(this.f3);

			this.f1.connect(this.a);
			this.f2.connect(this.a);
			this.f3.connect(this.a);
			this._pluged = this.a;
		}

		_destruct(t) {
			disconnect(this.i, this.f1, this.f2, this.f3, this.a);
			this.i = null;
			this.f1 = this.f2 = this.f3 = null;
			this.a = null;
		}

	}


	// ================================================ ユーティリティ関数


	// キー文字列正規化リスト（ハッシュ作成用）
	var NORM_LIST = [
	];

	// キー文字列正規化ハッシュ
	var NORM = (function () {
		var ret = {};
		for (var i = 0, I = NORM_LIST.length; i < I; i += 1) {
			var keys = NORM_LIST[i][0], full = NORM_LIST[i][1];
			ret[full] = full;
			for (var j = 0, J = keys.length; j < J; j += 1) {
				ret[keys[0]] = full;
			}
		}
		return ret;
	})();

	// キー文字列正規化関数
	var norm = function (str) {
		var ret = NORM[str];
		if (ret) return ret;
		return str;
	};

	// パラメーター処理
	var par = function (p, name, def) {
		if (!p) return def;
		if (Array.isArray(name)) {
			for (var i = 0; i < name.length; i += 1) {
				if (p[name[i]]) return p[name[i]];
			}
			return def;
		} else {
			return p[name] !== undefined ? p[name] : def;
		}
	};

	var disconnect = function () {
		for (var i = 0, I = arguments.length; i < I; i += 1) {
			var n = arguments[i];
			if (n && n.toString() === '[object GainNode]') {
				n.gain.value = 0;
			}
			if (n) setTimeout(function () {n.disconnect()}, 50);
		}
	};


	// ================================================ ライブラリとしてリターン


	var lib = CJSTRE || {};
	lib._FormantPatch = FormantPatch;
	return lib;

})();
