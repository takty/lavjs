// @need ../../dist/croqujs
// @need ../../dist/style ../../dist/path ../../dist/turtle
// @need ../../dist/ruler
// @need ../../dist/sprite
// @need ../../dist/widget
// @need ../../dist/calc

const setup = function () {
	const p = new CROQUJS.Paper(600, 600);
	const G = 9.8;  // m/s^2
	const w = new SPRITE.Stage();
	const buttonG = new WIDGET.Toggle('g');
	const os = { p, G, w, buttonG, fx: 0, fy: 0 };

	for (let i = 0; i < 10; i += 1) {
		const x = CALC.rand(600);
		const y = CALC.rand(600);
		const r = CALC.rand(5, 10);
		const e = new SPRITE.Circle(p, r);
		e.ruler().fill().color('red');
		e.x(x);
		e.y(y);
		e.motion(new PhysicalMotion(r * r, 0.5, os));
		w.add(e);
	}

	p.onKeyDown((key) => {
		if (key === ' ') {
			os.fy = -10000;
		}
		if (key === 'ArrowLeft') {
			os.fx = -10000;
		}
		if (key === 'ArrowRight') {
			os.fx = 10000;
		}
	});
	p.animate(draw, [p, w, os]);
};

const draw = function (p, w, os) {
	p.styleClear().color('white', 0.1).draw();
	w.draw(p);
	w.update(p.deltaTime());
	os.fx = 0;
	os.fy = 0;
};

class PhysicalMotion {
	constructor(mass, restitution, os) {
		this.m = mass;
		this.restitution = restitution;
		this.os = os;

		this.vx = 0;
		this.vy = 0;
		this.ax = 0;
		this.ay = 0;
	}

	update(t, x, y) {
		t /= 100;

		this.ax = 0;
		this.ax = this.ax + this.os.fx / this.m;
		this.vx = this.vx + this.ax * t;

		let nx = x + this.vx * t + 0.5 * this.ax * t * t;
		if (600 < x) {
			nx = 600;
			this.vx = this.vx * -1 * this.restitution;
		}
		if (x < 0) {
			nx = 0;
			this.vx = this.vx * -1 * this.restitution;
		}

		this.ay = 0;
		if (this.os.buttonG.value()) {
			this.ay = this.os.G;
		}
		this.ay = this.ay + this.os.fy / this.m;
		this.vy = this.vy + this.ay * t;

		let ny = y + this.vy * t + 0.5 * this.ay * t * t;
		if (600 < y) {
			ny = 600;
			this.vy = this.vy * -1 * this.restitution;
		}
		if (y < 0) {
			ny = 0;
			this.vy = this.vy * -1 * this.restitution;
		}

		return [nx, ny];
	}
}
