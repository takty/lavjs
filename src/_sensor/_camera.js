/**~ja
 * カメラ
 * @author Takuto Yanagida
 * @version 2020-11-21
 */
/**~en
 * Camera
 * @author Takuto Yanagida
 * @version 2020-11-21
 */


class Camera extends Sensor {

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

	async start() {
		try {
			const stream = await this._process(this._options);
			this._success(stream);
		} catch(e) {
			this._error(e);
		}
	}

	async _process(options) {
		return await navigator.mediaDevices.getUserMedia(options);
	}

	_success(stream) {
		this._video.srcObject = stream;
	}

	_error() {
		//@ifdef ja
		throw new Error('カメラを使用できません。');
		//@endif
		//@ifdef en
		throw new Error('Camera cannot be used.');
		//@endif
	}

	getImage() {
		return this._video;
	}

}