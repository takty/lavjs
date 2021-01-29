/**~ja
 * スタイル・ユーティリティ
 * @author Takuto Yanagida
 * @version 2020-12-17
 */
/**~en
 * Style utilities
 * @author Takuto Yanagida
 * @version 2020-12-17
 */


/**~ja
 * スタイルを追加する
 * @param {string} selector セレクター
 * @param {object} styles スタイル
 */
/**~en
 * Add styles
 * @param {string} selector Selector
 * @param {object} styles Style
 */
 const addStyle = (function () {
	const s = document.createElement('style');
	s.setAttribute('type', 'text/css');
	document.head.appendChild(s);

	return (selector, styles) => {
		const ps = [];
		for (const [prop, val] of Object.entries(styles)) {
			const p = prop.replace(/([A-Z])/g, (m) => { return '-' + m.charAt(0).toLowerCase(); });
			ps.push(`${p}:${val};`);
		}
		const style = ps.join(';');
		s.sheet.insertRule(`${selector}{${style}}`, s.sheet.cssRules.length);
	};
})();