/**~ja
 * 色空間ライブラリ（COLOR）
 *
 * @author Takuto Yanagida
 * @version 2020-11-26
 */
/**~en
 * Color space library (COLOR)
 *
 * @author Takuto Yanagida
 * @version 2020-11-26
 */


/**~ja
 * ライブラリ変数
 */
/**~en
 * Library variable
 */
const COLOR = (function () {

	'use strict';


	//=
	//=include _color/_cs-lab.js

	//=
	//=include _color/_cs-lms.js

	//=
	//=include _color/_cs-lrgb.js

	//=
	//=include _color/_cs-rgb.js

	//=
	//=include _color/_cs-xyz.js

	//=
	//=include _color/_cs-yiq.js

	//=
	//=include _color/_cs-yxy.js

	//=
	//=include _color/_cs-munsell.js

	//=
	//=include _color/_cs-pccs.js


	class Color {
		constructor(v1, v2, v3) {
			this.vs = [v1, v2, v3];
		}
	}


	//~ja ライブラリを作る --------------------------------------------------------
	//~en Create a library --------------------------------------------------------


	return {
	};

})();
