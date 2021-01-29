/**~ja
 * ジオロケーション・センサー
 * @extends {Sensor}
 * @version 2020-12-17
 */
/**~en
 * Geolocation sensor
 * @extends {Sensor}
 * @version 2020-12-17
 */
class Geolocation extends Sensor {

	/**~ja
	 * ジオロケーション・センサーを作る
	 */
	/**~en
	 * Make a geolocation sensor
	 */
	constructor() {
		super();

		this._options = {
			enableHighAccuracy: false,
			timeout: 8000,
			maximumAge: 2000,
		};
		this._location = { latitude: Number.NaN, longitude: Number.NaN };
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
			const pos = await this._process(this._options);
			this._success(pos);
		} catch (e) {
			this._error(e);
		}
	}

	/**~ja
	 * 処理する（ライブラリ内だけで使用）
	 * @private
	 * @param {object} options オプション
	 * @return {Promise}
	 */
	/**~en
	 * Process (used only in the library)
	 * @private
	 * @param {object} options Options
	 * @return {Promise}
	 */
	async _process(options) {
		return await new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(resolve, reject, options);
		})
	}

	/**~ja
	 * 処理が成功した（ライブラリ内だけで使用）
	 * @private
	 * @param {MediaStream} stream メディア・ストリーム
	 */
	/**~en
	 * Process successful (used only in the library)
	 * @private
	 * @param {MediaStream} stream Media stream
	 */
	_success(pos) {
		this._location = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
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
		throw new Error('ジオロケーションを取得できません。');
		//@endif
		//@ifdef en
		throw new Error('Geolocation cannot be captured.');
		//@endif
	}

	/**~ja
	 * 現在位置を取得
	 * @return {object} 緯度経度
	 */
	/**~en
	 * Get current location
	 * @return {object} Latitude and longitude
	 */
	getLocation() {
		return this._location;
	}

}