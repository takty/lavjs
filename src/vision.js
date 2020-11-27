/**~ja
 * 視覚ライブラリ（VISION）
 *
 * @author Takuto Yanagida
 * @version 2020-11-27
 */
/**~en
 * Vision library (VISION)
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
const VISION = (function () {

	'use strict';


	const COLOR_SPACE_NS = { XYZ: COLOR.XYZ, LMS: COLOR.LMS, LRGB: COLOR.LRGB };

	//=
	//=include _colorjst/_eval.js

	//=
	//=include _colorjst/_sim-age.js

	//=
	//=include _colorjst/_sim-color-vision.js


	//~ja ライブラリを作る --------------------------------------------------------
	//~en Create a library --------------------------------------------------------


	return {
		conspicuityOfLab    : Evaluation.conspicuityOfLab,
		differenceBetweenLab: Evaluation.differenceBetweenLab,
		categoryOfYxy       : Evaluation.categoryOfYxy,

		lmsToProtanopia   : ColorVisionSimulation.lmsToProtanopia,
		lmsToDeuteranopia : ColorVisionSimulation.lmsToDeuteranopia,
		lrgbToProtanopia  : ColorVisionSimulation.lrgbToProtanopia,
		lrgbToDeuteranopia: ColorVisionSimulation.lrgbToDeuteranopia,

		labToElderlyAB: AgeSimulation.labToElderlyAB,
		labToYoungAB  : AgeSimulation.labToYoungAB,

		Evaluation, ColorVisionSimulation, AgeSimulation,
	};

})();
