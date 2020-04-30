/**~ja
 * ズーム操作処理
 * @author Takuto Yanagida
 * @version 2020-04-30
 */
/**~en
 * Zoom operation handler
 * @author Takuto Yanagida
 * @version 2020-04-30
 */
class ZoomHandler {

	constructor(ctx) {
		this._ctx = ctx;
		this._isEnabled = true;

		this._zoom    = 0;
		this._scale   = [1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32];
		this._viewOff = { x: 0, y: 0 };

		ctx.canvas.addEventListener('wheel',     this._onWheel.bind(this));
		ctx.canvas.addEventListener('mousedown', this._onMouseDown.bind(this));
		ctx.canvas.addEventListener('mousemove', this._onMouseMove.bind(this));
	}

	_onMouseDown() {
		if (!this._isEnabled || !this._ctx.mouseMiddle()) return;
		this._mousePt = { x: this._ctx.mouseX(), y: this._ctx.mouseY() };
		this._prevViewOff = { x: this._viewOff.x, y: this._viewOff.y };
	}

	_onMouseMove() {
		if (!this._isEnabled || !this._ctx.mouseMiddle()) return;
		this._viewOff.x = this._prevViewOff.x - (this._ctx.mouseX() - this._mousePt.x);
		this._viewOff.y = this._prevViewOff.y - (this._ctx.mouseY() - this._mousePt.y);
		this._correctViewPt();
	}

	_onWheel(e) {
		if (!this._isEnabled) return;
		let sr = this._scale[this._zoom];
		const mx = this._ctx.mouseX(), my = this._ctx.mouseY();

		const px = (this._viewOff.x + mx) / sr;
		const py = (this._viewOff.y + my) / sr;

		if (0 < e.deltaY) {
			this._zoom = Math.max(this._zoom - 1, 0);
		} else {
			this._zoom = Math.min(this._zoom + 1, this._scale.length - 1);
		}
		sr = this._scale[this._zoom];

		if (this._zoom === 0) this._viewOff = { x: 0, y: 0 };
		else {
			this._viewOff.x = px * sr - mx;
			this._viewOff.y = py * sr - my;
		}
		this._correctViewPt();
	}

	_correctViewPt() {
		const sr = this._scale[this._zoom];
		const w = this._ctx.width(), h = this._ctx.height();

		this._viewOff.x = Math.max(this._viewOff.x, 0);
		this._viewOff.x = Math.min(this._viewOff.x, w * sr - w);

		this._viewOff.y = Math.max(this._viewOff.y, 0);
		this._viewOff.y = Math.min(this._viewOff.y, h * sr - h);
	}

	enabled(val) {
		if (val === undefined) return this._isEnabled;
		this._isEnabled = val;
	}

	beforeDrawing(ctx) {
		if (!this._isEnabled) return;
		const sr = this._scale[this._zoom];
		const t = ctx.getTransform();

		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.translate(-this._viewOff.x, -this._viewOff.y);
		ctx.scale(sr, sr);
		ctx.transform(t.a, t.b, t.c, t.d, t.e, t.f);
	}

	afterDrawing(ctx) {
		if (!this._isEnabled) return;
		ctx.restore();
	}

}