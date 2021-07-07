/**~ja
 * パッチ・ベース
 * @version 2020-12-16
 */
/**~en
 * Patch base
 * @version 2020-12-16
 */
class Patch {

	/**~ja
	 * パッチを作る
	 * @constructor
	 * @param {Synth} synth シンセ
	 */
	/**~en
	 * Make a patch
	 * @constructor
	 * @param {Synth} synth Synth
	 */
	constructor(synth) {
		this._synth = synth;
	}

	/**~ja
	 * 接続する
	 * @param {Patch|AudioParam} target 接続先
	 */
	/**~en
	 * Connect
	 * @param {Patch|AudioParam} target Target of connection
	 */
	connect(target) {
		if (target instanceof Patch) {
			this.getOutput().connect(target.getInput());
		} else if (target instanceof AudioParam) {
			this.getOutput().connect(target);
		}
	}

}