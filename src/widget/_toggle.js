// -------------------------------------------------------------------------
// トグル（WIDGET.Toggle)
// -------------------------------------------------------------------------




// トグル（ボタンの名前<配列>、現在の状態<配列>）
class Toggle extends Widget {

	constructor(caption_s = '', state_s = false) {
		super();

		const cs = Array.isArray(caption_s) ? caption_s : [caption_s];
		const ss = Array.isArray(state_s) ? state_s : [state_s];

		this._value = ss.length === 1 ? ss[0] : ss;

		const buttons = [];

		for (let c of cs) {
			const b = document.createElement('a');
			b.className = '__widget __widget-button';
			b.innerText = c;
			b.onmousedown = (ev) => {
				const idx = buttons.indexOf(ev.target);
				ss[idx] = !ss[idx]
				this._value = ss.length === 1 ? ss[0] : ss;
				ev.target.classList.toggle('__widget-button-pushed');
				if (this._onPushed) this._onPushed(ss[idx], idx);
			};
			buttons.push(b);
			this._base.appendChild(b);
		}
		setTimeout(() => {
			for (let i = 0; i < cs.length; i += 1) {
				if (!ss[i]) continue;
				buttons[i].classList.add('__widget-button-pushed');
				if (this._onPushed) this._onPushed(ss[i], i);
			}
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