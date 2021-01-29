
class Primitive {

	constructor() {
		this._aabbLeftTop = { x: 0, y: 0 };
		this._aabbRightBottom = { x: 0, y: 0 };
		this.xy = { x: 0, y: 0 };
		this.dxy = { x: 0, y: 0 };
		this.mass = 1.0;
		this.isFixing = false;
		this.angle = 0.0;
		this.dangle = 0.0;
		this.bouncing = 0.8;
		this._radius = 10.0;
	}

	aabbLeftTop() {
		this._aabbLeftTop.x = this.xy.x - this._radius;
		this._aabbLeftTop.y = this.xy.y - this._radius;
		return this._aabbLeftTop;
	}

	aabbRightBottom() {
		this._aabbRightBottom.x = this.xy.x + this._radius;
		this._aabbRightBottom.y = this.xy.y + this._radius;
		return this._aabbRightBottom;
	}

	move(dx, dy) {
		if (isFixing == false) {
			xy.x += dx;
			xy.y += dy;
			aabbLeftTop.x += dx;
			aabbLeftTop.y += dy;
			aabbRightBottom.x += dx;
			aabbRightBottom.y += dy;
		}
	}

	rotate(da) {
		if (isFixing == false) {
			angle += da;
		}
	}

	radius(d) {
		this._radius = d;
	}

	next(t) {
		this.move(this.dxy.x * t, this.dxy.y * t);
		this.dangle -= 0.01 * this.dangle;
		this.rotate(this.dangle * t * 10.0);
	}

	checkCollision(c) {
		if (!(this._aabbRightBottom.x >= c._aabbLeftTop.x || c._aabbLeftTop.x <= this._aabbRightBottom.x)) {
			return false;
		}
		if (!(this._aabbRightBottom.y >= c._aabbLeftTop.y || c._aabbLeftTop.y <= this._aabbRightBottom.y)) {
			return false;
		}
		const distance = this.calcXYDistance(p);
		const boundary = this.radius + c.radius;
		return (boundary > distance);
	}

	calcXYDistance(p) {
		const dX = Math.pow(p.xy.x - this.xy.x, 2);
		const dY = Math.pow(p.xy.y - this.xy.y, 2);
		return Math.sqrt(dX + dY);
	}

	calcXYDistanceDirection(p) {
		const vv = { x: p.xy.x - this.xy.x, y: p.xy.y - this.xy.y };
		const d = 1 / this.calcXYDistance(p);
		vv.x *= d;
		vv.y *= d;
		return vv;
	}

	collision(p) {
		if (this.isFixing == true) {
			this.dxy.x = 0.0;
			this.dxy.y = 0.0;
		}
		const distance = this.calcXYDistance(p);
		const boundary = this._radius + c.radius;
		const distanceDirection = this.calcXYDistanceDirection(p);
		const collisionDirection = this.calcXYDistanceDirection(p);
		const relativeSpeed = p.dxy - this.dxy;

		// calc J
		// e is 0-1
		// J = -(v1p- v2p) * (e+1) / (1/m1 + 1/m2)
		const bounce = (this.bouncing + p.bouncing) / 2;
		const j1 = -1.0 * (1.0 + bounce) * (relativeSpeed.dot(collisionDirection));
		const j2 = (1.0 / p.mass + 1.0 / this.mass);
		const j = j1 / j2;

		// calc move speed
		Vector3 p_dv = (collisionDirection * j) / p.mass;
		Vector3 t_dv = (collisionDirection * -1.0 * j) / this.mass;

		// calc angle speed
		Vector3 p_da = (distanceDirection * -1.0 * this._radius).cross(collisionDirection * 1.0 * j) / 0.00000005;
		Vector3 t_da = (distanceDirection * 1.0 * this._radius).cross(collisionDirection * -1.0 * j) / 0.00000005;

		if (this.isFixing == false) {
			this.dxy += t_dv;
			this.dangle += t_da.z * 1000.0;
		}
		if (p.isFixing == false) {
			p.xy += distanceDirection * (boundary - distance) / 1.0;
			//p.dxy += (distanceDirection * (boundary - distance) / 1.0)/1000.0;
			p.dxy += p_dv;
			p.dangle += p_da.z * 1000.0;
		}
	}
}
