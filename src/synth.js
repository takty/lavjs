/**~ja
 * シンセサイザー・ライブラリー（SYNTH）
 *
 * 音を鳴らすための部品を作るライブラリです。
 *
 * @author Takuto Yanagida
 * @version 2020-12-02
 */


var SYNTH = (function () {

	'use strict';


	//~ja ライブラリ中だけで使用するユーティリティ --------------------------------
	//~en Utilities used only in the library --------------------------------------


	//=
	//=include _audio/_instrument.js


	//=
	//=include _audio/_synth.js


	//=
	//=include _audio/_scheduler.js


	//=
	//=include _audio/_sequencer.js


	//=
	//=include _audio/_scope.js


	//~ja ライブラリを作る --------------------------------------------------------
	//~en Create a library --------------------------------------------------------


	return { Synth, Scheduler, Sequencer, Scope, noteNumToFreq };

})();
