/**~ja
 * センサー・ライブラリ（SENSOR）
 *
 * 様々なセンサーを使えるようにするライブラリです。
 *
 * @author Takuto Yanagida
 * @version 2020-11-27
 */
/**~en
 * Sensor library (SENSOR)
 *
 * A library that allows you to use various sensors.
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
const SENSOR = (function () {

	'use strict';


	class Sensor {
		constructor() {}
	}


	//=
	//=include _sensor/_camera.js


	//=
	//=include _sensor/_geolocation.js


	//=
	//=include _sensor/_weather.js


	//=
	//=include _sensor/_motion.js


	//~ja ライブラリを作る --------------------------------------------------------
	//~en Create a library --------------------------------------------------------


	return { Camera, Geolocation, Weather, Motion };

}());
