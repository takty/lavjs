/**~ja
 * コマンド
 * @version 2019-05-12
 */
/**~en
 * Command
 * @version 2019-05-12
 */
class Command {

	/**~ja
	 * コマンドを作る（ライブラリ内だけで使用）
	 * @private
	 * @param {function} func 関数
	 */
	/**~en
	 * Make a command (used only in the library)
	 * @private
	 * @param {function} func Function
	 */
	constructor(func) {
		this._func = func;
		this._initState = null;
	}

	/**~ja
	 * コマンドを実行する（ライブラリ内だけで使用）
	 * @param {number} deltaT 進める時間
	 * @return {number} パワー消費
	 */
	/**~en
	 * Run the command (used only in the library)
	 * @param {number} deltaT Time to advance
	 * @return {number} Power consumption
	 */
	run(deltaT) {
		const pc = this._func(deltaT);
		return (pc === undefined) ? 0 : pc;
	}

}