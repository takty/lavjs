// -------------------------------------------------------------------------
// ウィジェット共通
// -------------------------------------------------------------------------




class Widget {

	constructor(width = null, height = null) {
		ensureBaseStyle();
		this._outer = document.createElement('div');
		document.body.appendChild(this._outer);

		this._base = document.createElement('div');
		this._base.className = '__widget __widget-base';
		if (width !== null) {
			this._base.style.width = width + 'px';
		}
		if (height !== null) {
			this._base.style.height = height + 'px';
		}
		this._outer.appendChild(this._base);
	}

	domElement() {
		return this._outer;
	}

	setFillWidth(flag) {
		this._outer.style.flexBasis = flag ? '100%' : 'auto';
	}

	setVisible(flag) {
		this._outer.style.display = flag ? '' : 'none';
	}

}