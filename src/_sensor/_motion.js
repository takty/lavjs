/**~ja
 * モーション・センサー
 * @extends {Sensor}
 * @version 2020-11-27
 */
/**~en
 * Motion sensor
 * @extends {Sensor}
 * @version 2020-11-27
 */


CROQUJS.loadScriptSync('https://laccolla.com/api/wemote/v1/receiver.min.js');

class Motion extends Sensor {

	/**~ja
	 * モーション・センサーを作る
	 */
	/**~en
	 * Make a motion sensor
	 */
	constructor() {
		super();

		this._state = false;

		this._ori = null;
		this._acc = null;
		this._acg = null;
		this._rot = null;

		this._id           = '';
		this._qrCode       = null;
		this._stShowQrCode = null;
	}

	/**~ja
	 * センサーをトグルする（ライブラリ内だけで使用）
	 * @private
	 * @param {boolean} state 状態
	 */
	/**~en
	 * Toggle sensor (used only in the library)
	 * @private
	 * @param {boolean} state State
	 */
	_toggleSensor(state) {
		if (state) {
			this._id = WEMOTE.RECEIVER.createId();
			WEMOTE.RECEIVER.start(this._id, (e) => { this._onMessage(e); }, (e) => { this._onStateChanged(e); });
		} else {
			WEMOTE.RECEIVER.stop();
		}
	}

	/**~ja
	 * センサーの状態が変わった（ライブラリ内だけで使用）
	 * @private
	 * @param {string} e 状態
	 */
	/**~en
	 * Sensor state was changed (used only in the library)
	 * @private
	 * @param {string} e State
	 */
	_onStateChanged(e) {
		console.log(e);
		if (e === 'open') {
			this._stShowQrCode = setTimeout(() => { this._showQrCode(this._id); }, 400);
		} else if (e === 'connect') {
			clearTimeout(this._stShowQrCode);
			this._hideQrCode();
		} else if (e === 'disconnect') {
			this._state = false;
			this._ori = null;
			this._acc = null;
			this._acg = null;
			this._rot = null;
			this._id = '';
		}
	}

	/**~ja
	 * QRコードを表示する（ライブラリ内だけで使用）
	 * @private
	 * @param {string} id ID
	 */
	/**~en
	 * Show QR Code (used only in the library)
	 * @private
	 * @param {string} id ID
	 */
	_showQrCode(id) {
		const d = this._makeQrCodeParent();
		WEMOTE.RECEIVER.createQrCode(d, id);
		d.querySelector('img').style.border = 'solid 8px #fff';
		d.addEventListener('click', () => {
			WEMOTE.RECEIVER.stop();
			this._state = false;
			document.body.removeChild(d);
		});
		this._qrCode = d;
	}

	/**~ja
	 * QRコードを非表示にする（ライブラリ内だけで使用）
	 * @private
	 */
	/**~en
	 * Hide QR Code (used only in the library)
	 * @private
	 */
	_hideQrCode() {
		document.body.removeChild(this._qrCode);
		this._qrCode = null
	}

	/**~ja
	 * QRコードを表示する親要素を作る（ライブラリ内だけで使用）
	 * @private
	 * @return {HTMLElement} HTML要素
	 */
	/**~en
	 * Make parent element for showing QR Code (used only in the library)
	 * @private
	 * @return {HTMLElement} HTML element
	 */
	_makeQrCodeParent() {
		const d = document.createElement('div');
		d.style.position = 'fixed';
		d.style.top      = 0;
		d.style.left     = 0;
		d.style.right    = 0;
		d.style.bottom   = 0;

		d.style.display        = 'flex';
		d.style.alignItems     = 'center';
		d.style.justifyContent = 'center';

		d.style.backgroundColor = 'rgba(0,0,0,0.75)';
		document.body.appendChild(d);
		return d;
	}


	// ---------------------------------------------------------------------


	/**~ja
	 * メッセージを受け取った（ライブラリ内だけで使用）
	 * @private
	 * @param {string} e メッセージ
	 */
	/**~en
	 * Message was received (used only in the library)
	 * @private
	 * @param {string} e Message
	 */
	_onMessage(e) {
		try {
			const d = JSON.parse(e);
			if (d['orientation']) {
				this._ori = d.orientation;
			} else if (d['acceleration']) {
				this._acc = d.acceleration;
				this._acg = d.acceleration_gravity;
				this._rot = d.rotation;
			}
		} catch(e) {
			console.error(e);
		}
	}


	// ---------------------------------------------------------------------


	/**~ja
	 * 始める
	 * @return {Promise}
	 */
	/**~en
	 * Start
	 * @return {Promise}
	 */
	async start() {
		if (!this._state) {
			this._state = !this._state;
			this._toggleSensor(this._state);
		}
	}

	/**~ja
	 * x軸を中心とした方向
	 * @return {number} 方向 -180 - 180 [deg]
	 */
	/**~en
	 * Orientation around the x axis
	 * @return {number} Orientation -180 - 180 [deg]
	 */
	orientationX() {
		if (this._ori === null) return Number.NaN;
		return this._ori.x;
	}

	/**~ja
	 * y軸を中心とした方向
	 * @return {number} 方向 -90 - 90 [deg]
	 */
	/**~en
	 * Orientation around the y axis
	 * @return {number} Orientation -90 - 90 [deg]
	 */
	orientationY() {
		if (this._ori === null) return Number.NaN;
		return this._ori.y;
	}

	/**~ja
	 * z軸を中心とした方向
	 * @return {number} 方向 0 - 360 [deg]
	 */
	/**~en
	 * Orientation around the z axis
	 * @return {number} Orientation 0 - 360 [deg]
	 */
	orientationZ() {
		if (this._ori === null) return Number.NaN;
		return this._ori.z;
	}

	/**~ja
	 * x軸方向の加速度
	 * @return {number} 加速度 [m/s2]
	 */
	/**~en
	 * Acceleration in the x-axis direction
	 * @return {number} Acceleration [m/s2]
	 */
	accelerationX() {
		if (this._acc === null) return Number.NaN;
		return this._acc.x;
	}

	/**~ja
	 * y軸方向の加速度
	 * @return {number} 加速度 [m/s2]
	 */
	/**~en
	 * Acceleration in the y-axis direction
	 * @return {number} Acceleration [m/s2]
	 */
	accelerationY() {
		if (this._acc === null) return Number.NaN;
		return this._acc.y;
	}

	/**~ja
	 * z軸方向の加速度
	 * @return {number} 加速度 [m/s2]
	 */
	/**~en
	 * Acceleration in the z-axis direction
	 * @return {number} Acceleration [m/s2]
	 */
	accelerationZ() {
		if (this._acc === null) return Number.NaN;
		return this._acc.z;
	}

	/**~ja
	 * x軸方向の重力を含めた加速度
	 * @return {number} 加速度 [m/s2]
	 */
	/**~en
	 * Acceleration with gravity in the x-axis direction
	 * @return {number} Acceleration [m/s2]
	 */
	accelerationGravityX() {
		if (this._acg === null) return Number.NaN;
		return this._acg.x;
	}

	/**~ja
	 * y軸方向の重力を含めた加速度
	 * @return {number} 加速度 [m/s2]
	 */
	/**~en
	 * Acceleration with gravity in the y-axis direction
	 * @return {number} Acceleration [m/s2]
	 */
	accelerationGravityY() {
		if (this._acg === null) return Number.NaN;
		return this._acg.y;
	}

	/**~ja
	 * z軸方向の重力を含めた加速度
	 * @return {number} 加速度 [m/s2]
	 */
	/**~en
	 * Acceleration with gravity in the z-axis direction
	 * @return {number} Acceleration [m/s2]
	 */
	accelerationGravityZ() {
		if (this._acg === null) return Number.NaN;
		return this._acg.z;
	}

	/**~ja
	 * x軸を中心とした角速度
	 * @return {number} 角速度 -360 - 360 [deg/s]
	 */
	/**~en
	 * Rotation rate around the x axis
	 * @return {number} Rotation rate -360 - 360 [deg/s]
	 */
	rotationX() {
		if (this._rot === null) return Number.NaN;
		return this._rot.x;
	}

	/**~ja
	 * y軸を中心とした角速度
	 * @return {number} 角速度 -360 - 360 [deg/s]
	 */
	/**~en
	 * Rotation rate around the y axis
	 * @return {number} Rotation rate -360 - 360 [deg/s]
	 */
	rotationY() {
		if (this._rot === null) return Number.NaN;
		return this._rot.y;
	}

	/**~ja
	 * z軸を中心とした角速度
	 * @return {number} 角速度 -360 - 360 [deg/s]
	 */
	/**~en
	 * Rotation rate around the z axis
	 * @return {number} Rotation rate -360 - 360 [deg/s]
	 */
	rotationZ() {
		if (this._rot === null) return Number.NaN;
		return this._rot.z;
	}

}