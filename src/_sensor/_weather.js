/**~ja
 * 天気
 * @author Takuto Yanagida
 * @version 2020-11-20
 */
/**~en
 * Weather
 * @author Takuto Yanagida
 * @version 2020-11-20
 */


class Weather extends Sensor {

	constructor(latitude, longitude) {
		super();

		this._latitude = latitude;
		this._longitude = longitude;
	}

	async start() {
		try {
			const res = await this._process(this._latitude, this._longitude);
			this._success(res);
		} catch (e) {
			this._error(e);
		}
	}

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

	_success(res) {
		this._res = res;
	}

	_error() {
		//@ifdef ja
		throw new Error('天気を取得できません。');
		//@endif
		//@ifdef en
		throw new Error('Weather information cannot be get.');
		//@endif
	}

	getWeather() {
		return this._res;
	}

}