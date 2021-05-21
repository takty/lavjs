/**~ja
 * 回転
 * @version 2021-02-06
 */
/**~en
 * Rotation
 * @version 2021-02-06
 */
class Rotation {

	/**~ja
	 * 回転を作る
	 * @constructor
	 * @param {number=} [angleSpeed=0] 角度スピード
	 * @param {number=} [angleSpeedX=0] 角度スピードx
	 * @param {number=} [angleSpeedZ=0] 角度スピードz
	 */
	/**~en
	 * Make a rotation
	 * @constructor
	 * @param {number=} [angleSpeed=0] Angle speed
	 * @param {number=} [angleSpeedX=0] Angle speed x
	 * @param {number=} [angleSpeedZ=0] Angle speed z
	 */
	constructor(angleSpeed = 0, angleSpeedX = 0, angleSpeedZ = 0) {
		this._angleSpeed  = angleSpeed;
		this._angleSpeedX = angleSpeedX;
		this._angleSpeedZ = angleSpeedZ;
	}

	/**~ja
	 * 角度スピード
	 * @param {number=} val 角度スピード
	 * @return {number|Element} 角度スピード／この要素
	 */
	/**~en
	 * Angle speed
	 * @param {number=} val Angle speed
	 * @return {number|Element} Angle speed or this element
	 */
	angleSpeed(val) {
		if (val === undefined) return this._angleSpeed;
		this._angleSpeed = val;
		return this;
	}

	/**~ja
	 * 角度スピードx
	 * @param {number=} val 角度スピード
	 * @return {number|Element} 角度スピード／この要素
	 */
	/**~en
	 * Angle speed x
	 * @param {number=} val Angle speed
	 * @return {number|Element} Angle speed or this element
	 */
	angleSpeedX(val) {
		if (val === undefined) return this._angleSpeedX;
		this._angleSpeedX = val;
		return this;
	}

	/**~ja
	 * 角度スピードz
	 * @param {number=} val 角度スピード
	 * @return {number|Element} 角度スピード／この要素
	 */
	/**~en
	 * Angle speed z
	 * @param {number=} val Angle speed
	 * @return {number|Element} Angle speed or this element
	 */
	angleSpeedZ(val) {
		if (val === undefined) return this._angleSpeedZ;
		this._angleSpeedZ = val;
		return this;
	}

	/**~ja
	 * スピードに合わせて角度を更新する
	 * @param {number} unitTime 単位時間
	 * @param {number} angle z軸を中心とする角度（向き）
	 * @param {number} angleX x軸を中心とする角度（向き）
	 * @param {number} angleZ z軸を中心とする角度2（向き）
	 * @return {number[]} 角度
	 */
	/**~en
	 * Update angles according to the speed
	 * @param {number} unitTime Unit time
	 * @param {number} angle Angle around z axis (direction)
	 * @param {number} angleX Angle around x axis (direction)
	 * @param {number} angleZ 2nd angle around z axis (direction)
	 * @return {number[]} Angles
	 */
	update(unitTime, angle, angleX, angleZ) {
		const a  = checkDegRange(angle  + valueFunction(this._angleSpeed,  unitTime));
		const ax = checkDegRange(angleX + valueFunction(this._angleSpeedX, unitTime));
		const az = checkDegRange(angleZ + valueFunction(this._angleSpeedZ, unitTime));
		return [a, ax, az];
	}

}