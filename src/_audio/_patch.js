/**~ja
 * パッチ・ライブラリー（CJSTRE）
 * @author Takuto Yanagida
 * @version 2020-04-23
 *
 * 音を鳴らすための部品を作るライブラリです。
 */


var CJSTRE = (function(){

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


	// ================================================ オシレーター・パッチ


	// ================================================ ノイズ・パッチ


	// ================================================ マイク・パッチ


	// ================================================ 音声ファイル・パッチ


	// ================================================ ゲイン・パッチ


	// ================================================ フィルター・パッチ


	// ================================================ スコープ・パッチ


	// ================================================ エンベロープ・パッチ


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
	lib._OscillatorPatch   = OscillatorPatch;
	lib._MicrophonePatch   = MicrophonePatch;
	lib._SoundFilePatch    = SoundFilePatch;
	lib.SoundFile          = SoundFile;
	lib._NoisePatch        = NoisePatch;
	lib._GainPatch         = GainPatch;
	lib._EnvelopePatch     = EnvelopePatch;
	lib._BiquadFilterPatch = BiquadFilterPatch;
	lib._ScopePatch        = ScopePatch;
	lib._FormantPatch      = FormantPatch;
	return lib;

})();
