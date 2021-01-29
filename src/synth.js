/**~ja
 * シンセサイザー・ライブラリー（SYNTH）
 *
 * @author Takuto Yanagida
 * @version 2020-12-16
 */
/**~en
 * Synthesizer library (SYNTH)
 *
 * @author Takuto Yanagida
 * @version 2020-12-16
 */


/**~ja
 * ライブラリ変数
 */
/**~en
 * Library variable
 */
const SYNTH = (function () {

	'use strict';


	//~ja ライブラリ中だけで使用するユーティリティ --------------------------------
	//~en Utilities used only in the library --------------------------------------


	//~ja キー文字列正規化リスト
	//~en Key string normalizing list
	const KEY_NORM_LIST = {
		sr        : 'swingRatio',
		inst      : 'instrument',
		tempo     : 'bpm',
		amp       : 'gain',

		makeOsc   : 'makeOscillator',
		makeMic   : 'makeMicrophone',
		makeFile  : 'makeBufferSource',
		makeFilter: 'makeBiquadFilter',
		makeEnv   : 'makeEnvelope',
	};

	/**~ja
	 * 関数（メソッド）の別名をつける
	 * @param {object} cls クラス
	 */
	/**~en
	 * Give aliases for functions (methods)
	 * @param {object} cls Class
	 */
	function assignAlias(cls) {
		for (const [alias, orig] of Object.entries(KEY_NORM_LIST)) {
			if (cls.prototype[orig]) {
				cls.prototype[alias] = cls.prototype[orig];
			}
		}
	}

	/**~ja
	 * パラメーターのキーを正規化する
	 * @param {object} params パラメーター
	 * @return {object} 正規化されたパラメーター
	 */
	/**~en
	 * Normalize keys of parameters
	 * @param {object} params parameters
	 * @return {object} Normalized parameters
	 */
	function normalizeParams(params) {
		const ret = {};
		for (const [key, val] of Object.entries(params)) {
			const k = KEY_NORM_LIST[key] ?? key;
			const v = KEY_NORM_LIST[val] ?? val;
			ret[k] = v;
		}
		return ret;
	}


	//=
	//=include _acoustic/_synth.js


	//=
	//=include _acoustic/_scheduler.js


	//=
	//=include _acoustic/_sequencer.js


	//~ja ライブラリを作る --------------------------------------------------------
	//~en Create a library --------------------------------------------------------


	return { Synth, Scheduler, Sequencer };

})();
