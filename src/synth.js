/**~ja
 * シンセサイザー・ライブラリー（SYNTH）
 *
 * @author Takuto Yanagida
 * @version 2021-02-04
 */
/**~en
 * Synthesizer library (SYNTH)
 *
 * @author Takuto Yanagida
 * @version 2021-02-04
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
	 * @param {object} target 対象クラス
	 */
	/**~en
	 * Give aliases for functions (methods)
	 * @param {object} target Target class
	 */
	function assignAlias(target) {
		for (const [a, orig] of Object.entries(KEY_NORM_LIST)) {
			if (target.prototype[orig]) {
				target.prototype[a] = target.prototype[orig];
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
