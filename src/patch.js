/**~ja
 * パッチ・ライブラリー（PATCH）
 *
 * 音を鳴らすための部品を作るライブラリです。
 *
 * @author Takuto Yanagida
 * @version 2020-11-27
 */


/**~ja
 * ライブラリ変数
 */
/**~en
 * Library variable
 */
const PATCH = (function () {

	'use strict';


	//~ja ライブラリ中だけで使用するユーティリティ --------------------------------
	//~en Utilities used only in the library --------------------------------------


	// パラメーター処理
	const par = function (p, name, def) {
		if (!p) return def;
		if (Array.isArray(name)) {
			for (let n of name) {
				if (p[n]) return p[n];
			}
			return def;
		} else {
			return p[name] ? p[name] : def;
		}
	};

	const disconnect = function (...nodes) {
		for (const n of nodes) {
			if (n && n.toString() === '[object GainNode]') {
				n.gain.value = 0;
			}
			if (n) setTimeout(() => { n.disconnect() }, 50);
		}
	};


	//~ja パッチ -----------------------------------------------------------------


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


	//=
	//=include _audio/_patch-oscillator.js


	//=
	//=include _audio/_patch-noise.js


	//=
	//=include _audio/_patch-microphone.js


	//=
	//=include _audio/_patch-sound-file.js


	//=
	//=include _audio/_patch-gain.js


	//=
	//=include _audio/_patch-biquad-filter.js


	//=
	//=include _audio/_patch-formant.js


	//=
	//=include _audio/_patch-scope.js


	//=
	//=include _audio/_patch-envelope.js


	//=
	//=include _audio/_patch-speaker.js


	//~ja ライブラリを作る --------------------------------------------------------
	//~en Create a library --------------------------------------------------------


	return {
		OscillatorPatch,
		MicrophonePatch,
		SoundFilePatch,
		NoisePatch,
		GainPatch,
		EnvelopePatch,
		BiquadFilterPatch,
		ScopePatch,
		FormantPatch,
		Speaker,

		SoundFile
	};

})();
