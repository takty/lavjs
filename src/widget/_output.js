// -------------------------------------------------------------------------
// 文字列出力（WIDGET.Output)
// -------------------------------------------------------------------------




// 文字列出力（横幅、縦幅）
class Output extends Widget {

	constructor(width, height = false, nowrap = false) {
		super(width, height);

		this._inner = document.createElement('div');
		this._inner.className = '__widget __widget-output-inner';
		if (nowrap) {
			this._inner.style.lineHeight = 1;
		} else {
			this._inner.style.whiteSpace = 'normal';
		}
		this._inner.style.overflow = 'hidden';
		this._base.appendChild(this._inner);
	}

	string(val) {
		if (val === undefined) return this._inner.innerText;
		this._inner.innerText = val;
		return this;
	}

}