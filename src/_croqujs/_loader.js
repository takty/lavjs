/**~ja
 * スクリプトの読み込み
 * @author Takuto Yanagida
 * @version 2020-04-24
 */
/**~en
 * Script loader
 * @author Takuto Yanagida
 * @version 2020-04-24
 */


/**~ja
 * スクリプトを読み込む（非同期）
 * @param {string} src スクリプトのURL
 */
/**~en
 * Load a script (asynchronous)
 * @param {string} src The URL of a script
 */
function loadScript(src) {
	const s = document.createElement('script');
	s.src = src;
	document.head.appendChild(s);
}

/**~ja
 * スクリプトを読み込む（同期）
 * @param {string} src スクリプトのURL
 */
/**~en
 * Load a script (synchronous)
 * @param {string} src The URL of a script
 */
function loadScriptSync(src) {
	const xhr = new XMLHttpRequest();
	xhr.open('GET', src, false);
	xhr.send(null);
	if (xhr.status === 200) {
		const s = document.createElement('script');
		s.text = xhr.responseText;
		document.head.appendChild(s);
	}
}