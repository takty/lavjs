/**~ja
 * 色ライブラリ（COLOR）
 *
 * @author Takuto Yanagida
 * @version 2020-11-27
 */
/**~en
 * Color library (COLOR)
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
const COLOR = (function () {

	'use strict';


	//=
	//=include _colorjst/_cs-lab.js

	//=
	//=include _colorjst/_cs-lms.js

	//=
	//=include _colorjst/_cs-lrgb.js

	//=
	//=include _colorjst/_cs-rgb.js

	//=
	//=include _colorjst/_cs-xyz.js

	//=
	//=include _colorjst/_cs-yiq.js

	//=
	//=include _colorjst/_cs-yxy.js

	//=
	//=include _colorjst/_cs-munsell.js

	//=
	//=include _colorjst/_cs-pccs.js

	//=
	//=include _colorjst/_cs-function.js


	//~ja ライブラリを作る --------------------------------------------------------
	//~en Create a library --------------------------------------------------------


	return {
		convert,
		isRGBSaturated,
		isYxySaturated,
		isMunsellSaturated,

		RGB, LRGB, YIQ, XYZ, Yxy, Lab, LMS, Munsell, PCCS
	};

})();
