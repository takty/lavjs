/**~ja
 * ジオロケーション
 * @author Takuto Yanagida
 * @version 2020-11-21
 */
/**~en
 * Geolocation
 * @author Takuto Yanagida
 * @version 2020-11-21
 */


class Geolocation extends Sensor {

	constructor() {
		super();

		this._options = {
			enableHighAccuracy: false,
			timeout: 8000,
			maximumAge: 2000,
		};
		this._location = { latitude: Number.NaN, longitude: Number.NaN };
	}

	async start() {
		try {
			const pos = await this._process(this._options);
			this._success(pos);
		} catch (e) {
			this._error(e);
		}
	}

	async _process(options) {
		return await new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(resolve, reject, options);
		})
	}

	_success(pos) {
		this._location = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
	}

	_error() {
		//@ifdef ja
		throw new Error('ジオロケーションを取得できません。');
		//@endif
		//@ifdef en
		throw new Error('Geolocation cannot be captured.');
		//@endif
	}

	getLocation() {
		return this._location;
	}

}