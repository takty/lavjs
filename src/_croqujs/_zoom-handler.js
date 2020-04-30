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
		this._steps   = [1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32];
		this._scale   = 1;
		this._viewOff = { x: 0, y: 0 };
		this._mousePt = { x: 0, y: 0 };

		this._touchPt    = { x: 0, y: 0 };
		this._touchCount = 0;
		this._touchDist  = 0;

		ctx.canvas.addEventListener('wheel',     this._onWheel.bind(this));
		ctx.canvas.addEventListener('mousedown', this._onMouseDown.bind(this));
		ctx.canvas.addEventListener('mousemove', this._onMouseMove.bind(this));

		ctx.canvas.addEventListener('touchstart', this._onTouchStart.bind(this));
		ctx.canvas.addEventListener('touchmove',  this._onTouchMove.bind(this), { passive: false });
	}

	_onMouseDown() {
		if (!this._isEnabled || !this._ctx.mouseMiddle()) return;
		this._mousePt = { x: this._ctx.mouseX(), y: this._ctx.mouseY() };
		this._viewOff.px = this._viewOff.x;
		this._viewOff.py = this._viewOff.y;
	}

	_onMouseMove() {
		if (!this._isEnabled || !this._ctx.mouseMiddle()) return;
		this._setViewOffset(
			this._viewOff.px - (this._ctx.mouseX() - this._mousePt.x),
			this._viewOff.py - (this._ctx.mouseY() - this._mousePt.y)
		);
	}

	_onWheel(e) {
		if (!this._isEnabled) return;
		const mx = this._ctx.mouseX(), my = this._ctx.mouseY();

		const px = (this._viewOff.x + mx) / this._scale;
		const py = (this._viewOff.y + my) / this._scale;

		if (0 < e.deltaY) {
			this._zoom = Math.max(this._zoom - 1, 0);
		} else {
			this._zoom = Math.min(this._zoom + 1, this._steps.length - 1);
		}
		this._scale = this._steps[this._zoom];
		this._setViewOffset(
			px * this._scale - mx,
			py * this._scale - my
		);
	}

	_setViewOffset(x, y) {
		const w = this._ctx.width(), h = this._ctx.height();
		x = Math.min(Math.max(x, 0), w * this._scale - w);
		y = Math.min(Math.max(y, 0), h * this._scale - h);
		this._viewOff.x = x;
		this._viewOff.y = y;
	}


	// -------------------------------------------------------------------------


	_onTouchStart(e) {
		this._touchDist = 0;
		this._updateTouchPoint(e.touches);
	}

	_onTouchMove(e) {
		e.preventDefault();
		e.stopPropagation();

		const ts = e.touches;
		if (this._touchCount !== ts.length) this._updateTouchPoint(ts);

		const [cx, cy] = this._getTouchPoint(ts);
		this._viewOff.x += this._touchPt.x - cx;
		this._viewOff.y += this._touchPt.y - cy;

		this._touchPt.x = cx;
		this._touchPt.y = cy;

		if (2 <= ts.length) {
			const ntX = (cx + this._viewOff.x) / this._scale;
			const ntY = (cy + this._viewOff.y) / this._scale;
			const dis = this._getTouchDistance(ts);

			if (this._touchDist) {
				const s = dis / (this._touchDist * this._scale);
				if (s && s !== Infinity) {
					[this._zoom, this._scale] = this._calcZoomStep(this._scale * s);
					this._setViewOffset(
						ntX * this._scale - cx,
						ntY * this._scale - cy
					);
				}
			}
			this._touchDist = dis / this._scale;
		}
	}

	_calcZoomStep(s) {
		const ns = Math.min(Math.max(s, 1), this._steps[this._steps.length - 1]);

		let dis = Number.MAX_VALUE;
		let idx = -1;
		for (let i = 0; i < this._steps.length; i += 1) {
			const v = this._steps[i];
			const d = (s - v) * (s - v);
			if (d < dis) {
				dis = d;
				idx = i;
			}
		}
		return [idx, ns];
	}

	_updateTouchPoint(ts) {
		this._touchCount = ts.length;
		[this._touchPt.x, this._touchPt.y] = this._getTouchPoint(ts);
	}

	_getTouchPoint(ts) {
		let x = 0, y = 0;
		if (ts.length === 1) {
			x = ts[0].pageX - window.pageXOffset;
			y = ts[0].pageY - window.pageYOffset;
		} else if (2 <= ts.length) {
			x = (ts[0].pageX + ts[1].pageX) / 2 - window.pageXOffset;
			y = (ts[0].pageY + ts[1].pageY) / 2 - window.pageYOffset;
		}
		return [x, y];
	}

	_getTouchDistance(ts) {
		const x1 = ts[0].screenX, y1 = ts[0].screenY;
		const x2 = ts[1].screenX, y2 = ts[1].screenY;
		return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	}


	// -------------------------------------------------------------------------


	enabled(val) {
		if (val === undefined) return this._isEnabled;
		this._isEnabled = val;
	}

	beforeDrawing(ctx) {
		if (!this._isEnabled) return;
		const t = ctx.getTransform();

		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.translate(-this._viewOff.x, -this._viewOff.y);
		ctx.scale(this._scale, this._scale);
		ctx.transform(t.a, t.b, t.c, t.d, t.e, t.f);
	}

	afterDrawing(ctx) {
		if (!this._isEnabled) return;
		ctx.restore();
	}

}