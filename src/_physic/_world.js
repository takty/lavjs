class World {

	constructor() {
		this.gravity = {x: 0, y: 0};
		this.primitives = [];
	}

	next(time) {
		this.primitives.shuffle();
		for (const a of this.primitives) {
			for (const b of this.primitives) {
				if (a !== b && a.checkCollision(b)) {
					a.collision(b);
				}
			}
			if (a.isFixing == false) {
				a.dxy.x += gravity.x;
				a.dxy.y += gravity.y;
			}
			a.next(time);
		}
	}

	searchPrimitive(base, direction, range, startDist, endDist) {
		const s2 = World.normalizeAngle(direction);
		const starting = s2 - range;
		const ending = s2 + range;

		const ret = [];
		for (const t of this.primitives) {
			if (t === base) {
				continue;
			}
			const d = World.distance(base, t);
			const a = World.angleFromP2(t, base);
			if (!(startDist <= d && d <= endDist)) {
				continue;
			}
			const ss = a - starting;
			const ee = a - ending;
			if (ss >= 0 && ee <= 0) {
				ret.add(t);
			} else {
			}
		}
		return ret;
	}

	static distance(p1, p2) {
		const x = p1.xy.x - p2.xy.x;
		const y = p1.xy.y - p2.xy.y;
		return Math.sqrt(x * x + y * y);
	}

	static angleFromP2(p1, p2) {
		const x = p1.xy.x - p2.xy.x;
		const y = p1.xy.y - p2.xy.y;
		return Math.atan2(y, x);
	}

	static normalizeAngle(a) {
		a += Math.PI * 2 * 4;
		a = a % (2 * Math.PI);
		if (a < Math.PI) {
			return a;
		}
		return -Math.PI + (a - Math.PI);
	}

}
