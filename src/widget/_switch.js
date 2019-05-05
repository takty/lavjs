// -------------------------------------------------------------------------
// スイッチ（WIDGET.Switch)
// -------------------------------------------------------------------------




// スイッチ（ボタン数 or ボタンの名前配列、現在のボタン）
class Switch extends Widget {

	constructor(num_or_names = 3, cur = 0) {
		super();
		if (Array.isArray(num_or_names) && num_or_names.length === 0) num_or_names = ['?'];

		const num = Array.isArray(num_or_names) ? num_or_names.length : num_or_names;
		const names = Array.isArray(num_or_names) ? num_or_names : null;

		this._value = (0 <= cur && cur < num) ? cur : (num - 1);

		let maxCharNum = 0;
		if (names) names.forEach(e => maxCharNum = Math.max(maxCharNum, e.length));

		const buttons = [];

		for (let i = 0; i < num; i += 1) {
			const b = document.createElement('a');
			b.className = '__widget __widget-button';
			b.innerText = (names) ? names[i] : i;
			b.style.width = `calc(${maxCharNum}rem + 16px)`;
			b.onmousedown = (ev) => {
				buttons.forEach(e => e.classList.remove('__widget-button-pushed'));
				this._value = buttons.indexOf(ev.target);
				ev.target.classList.add('__widget-button-pushed');
				if (this._onPushed) this._onPushed(this._value);
			};
			buttons.push(b);
			this._base.appendChild(b);
		}
		setTimeout(() => {
			buttons[this._value].classList.add('__widget-button-pushed');
			if (this._onPushed) this._onPushed(this._value);
		}, 100);
	}

	value(val) {
		if (val === undefined) return this._value;
		this._value = val;
		return this;
	}

	// プッシュ・イベントに対応する関数をセットする
	onPushed(handler) {
		if (handler === undefined) return this._onPushed;
		this._onPushed = handler;
		return this;
	}

}