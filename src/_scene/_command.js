/**~ja
 * コマンド
 * @version 2021-02-05
 */
/**~en
 * Command
 * @version 2021-02-05
 */
class Command {

	/**~ja
	 * コマンドを作る（ライブラリ内だけで使用）
	 * @private
	 * @constructor
	 * @param {function} func 関数
	 */
	/**~en
	 * Make a command (used only in the library)
	 * @private
	 * @constructor
	 * @param {function} func Function
	 */
	constructor(func) {
		this._func = func;
		this._initState = null;
	}

	/**~ja
	 * コマンドを実行する（ライブラリ内だけで使用）
	 * @param {number} deltaTime 進める時間
	 * @return {number} パワー消費
	 */
	/**~en
	 * Run the command (used only in the library)
	 * @param {number} deltaTime Time to advance
	 * @return {number} Power consumption
	 */
	run(deltaTime) {
		const pc = this._func(deltaTime);
		return (pc === undefined) ? 0 : pc;
	}

}