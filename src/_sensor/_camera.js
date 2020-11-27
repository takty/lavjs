/**~ja
 * カメラ・センサー
 * @extends {Sensor}
 * @version 2020-11-27
 */
/**~en
 * Camera sensor
 * @extends {Sensor}
 * @version 2020-11-27
 */
class Camera extends Sensor {

	/**~ja
	 * カメラ・センサーを作る
	 * @param {number} [width=640] 横幅
	 * @param {number} [height=480] たて幅
	 */
	/**~en
	 * Make a camera sensor
	 * @param {number} [width=640] Width
	 * @param {number} [height=480] Height
	 */
	constructor(width = 640, height = 480) {
		super();

		this._options = {
			audio: false,
			video: {
				width: { ideal: width },
				height: { ideal: height }
			}
		}
		this._video = document.createElement('video');
		this._video.style.display = 'none';
		this._video.width = width;
		this._video.height = height;
		this._video.autoplay = true;
		document.documentElement.appendChild(this._video);
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
			const stream = await this._process(this._options);
			this._success(stream);
		} catch(e) {
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
		return await navigator.mediaDevices.getUserMedia(options);
	}

	/**~ja
	 * 処理が成功した（ライブラリ内だけで使用）
	 * @private
	 * @param {MediaStream} stream メディア・ストリーム
	 */
	/**~en
	 * Process successed (used only in the library)
	 * @private
	 * @param {MediaStream} stream Media stream
	 */
	_success(stream) {
		this._video.srcObject = stream;
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
		throw new Error('カメラを使用できません。');
		//@endif
		//@ifdef en
		throw new Error('Camera cannot be used.');
		//@endif
	}

	/**~ja
	 * カメラの画像を取得
	 * @return {HTMLVideoElement} 画像
	 */
	/**~en
	 * Get camera image
	 * @return {HTMLVideoElement} Image
	 */
	getImage() {
		return this._video;
	}

}