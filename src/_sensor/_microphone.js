/**~ja
 * マイクロフォン・センサー
 * @extends {Sensor}
 * @version 2020-12-17
 */
/**~en
 * Microphone sensor
 * @extends {Sensor}
 * @version 2020-12-17
 */
class Microphone extends Sensor {

	/**~ja
	 * マイクロフォン・センサーを作る
	 */
	/**~en
	 * Make a microphone sensor
	 */
	constructor() {
		super();
		this._buffer = null;
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
			const stream = await this._process();
			this._success(stream);
		} catch(e) {
			this._error(e);
		}
	}

	/**~ja
	 * 処理する（ライブラリ内だけで使用）
	 * @private
	 * @return {Promise}
	 */
	/**~en
	 * Process (used only in the library)
	 * @private
	 * @return {Promise}
	 */
	async _process() {
		return await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
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
	_success(stream) {
		this._context = new AudioContext();
		this._a = this._context.createAnalyser();
		this._m = this._context.createMediaStreamSource(stream);
		this._m.connect(this._a);
		this._buffer = new Uint8Array(this._a.fftSize);
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
		throw new Error('マイクロフォンを使用できません。');
		//@endif
		//@ifdef en
		throw new Error('Microphone cannot be used.');
		//@endif
	}

	/**~ja
	 * マイクロフォンのレベルを取得
	 * @return {number} レベル 0.0 - 1.0
	 */
	/**~en
	 * Get microphone level
	 * @return {number} Level 0.0 - 1.0
	 */
	getLevel() {
		if (!this._buffer) {
			return 0;
		}
		this._a.getByteTimeDomainData(this._buffer);
		let max = 0;
		for (const v of this._buffer) {
			if (max < v - 128) max = v - 128;
		}
		return max / 127;
	}

}