/**~ja
 * 天気センサー
 * @extends {Sensor}
 * @version 2020-11-27
 */
/**~en
 * Weather sensor
 * @extends {Sensor}
 * @version 2020-11-27
 */
class Weather extends Sensor {

	/**~ja
	 * 天気センサーを作る
	 * @param {number} [latitude=43] 緯度
	 * @param {number} [longitude=141] 経度
	 */
	/**~en
	 * Make a weather sensor
	 * @param {number} [latitude=43] Latitude
	 * @param {number} [longitude=141] Longitude
	 */
	constructor(latitude = 43, longitude = 141) {
		super();

		this._latitude = latitude;
		this._longitude = longitude;
	}

	/**~ja
	 * 始める
	 * @return {Promise}
	 */
	/**~en
	 * Start
	 * @return {Promise}
	 */
	async start() {
		try {
			const res = await this._process(this._latitude, this._longitude);
			this._success(res);
		} catch (e) {
			this._error(e);
		}
	}

	/**~ja
	 * 処理する（ライブラリ内だけで使用）
	 * @private
	 * @param {number} latitude 緯度
	 * @param {number} longitude 経度
	 * @return {Promise}
	 */
	/**~en
	 * Process (used only in the library)
	 * @private
	 * @param {number} latitude Latitude
	 * @param {number} longitude Longitude
	 * @return {Promise}
	 */
	async _process(latitude, longitude) {
		const response = await fetch(`https://laccolla.com/api/weather/v1/?lat=${latitude}&lon=${longitude}`, {
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/json; charset=utf-8', },
			referrer: 'no-referrer',
		});
		return response.json();
	}

	/**~ja
	 * 処理が成功した（ライブラリ内だけで使用）
	 * @private
	 * @param {object} res JSON
	 */
	/**~en
	 * Process successed (used only in the library)
	 * @private
	 * @param {object} res JSON
	 */
	_success(res) {
		this._res = res;
	}

	/**~ja
	 * エラーが発生した（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Error occurred (used only in the library)
	 * @private
	 */
	_error() {
		//@ifdef ja
		throw new Error('天気を取得できません。');
		//@endif
		//@ifdef en
		throw new Error('Weather information cannot be get.');
		//@endif
	}

	/**~ja
	 * 天気の情報を取得
	 * @return {object} 天気の情報
	 */
	/**~en
	 * Get waether information
	 * @return {object} Waether information
	 */
	getWeather() {
		return this._res;
	}

}