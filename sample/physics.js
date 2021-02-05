// @need ../dist/croqujs
// @need ../dist/style ../dist/path ../dist/turtle
// @need ../dist/ruler
// @need ../dist/sprite
// @need ../dist/widget
// @need ../dist/calc

const setup = function () {
	const p = new CROQUJS.Paper(600, 600);
// 	p.translate(300, 300);
	STYLE.augment(p);
	const G = 9.8;  // m/s^2
	const w = new SPRITE.Stage();
	const gSw = new WIDGET.Toggle('g');
	const os = { p, G, w, gSw };

	for (let i = 0; i < 10; i += 1) {
		const x = CALC.rand(600);
		const y = CALC.rand(600);
		const r = CALC.rand(1, 10);
		const m = r * r;
		const e = new SPRITE.Sprite(drawShape);
		e.x(x);
		e.y(y);
// 		e.onBeforeUpdate(update(t, e, os))
		w.add(e);
	}

	p.onKeyDown(() => {
		os.fy = 100;
	});
	p.animate(draw, [p, os]);
};

const drawShape = function (p) {
	const r = p.getRuler();
	r.fill().color('black');
	r.circle(0, 0, 10);
	r.draw('fill');
};

const draw = function (p, os) {
	p.styleClear().color('white').draw();
	os.w.draw(p, [p, os]);
	os.w.update(p.deltaTime());
};

const update = function (t, e, os) {
	if (os.p.keyArrowLeft()) {
		e.vx = -1;
	} else if (p.keyArrowRight()) {
		e.vx = 1;
	} else {
		e.vx = 0;
	}

	if (os.gSw.toggled()) {
		e.ay = os.G;
	}
	e.ay = e.ay - os.fy / e.m;
	os.fy = 0;

	const y = e.y + e.vy * t + 0.5 * e.ay * t * t;
	if (600 - e.radius < y) {
		e.y = 600 - e.radius;
		e.vy = e.vy * -1 * e.restitution;
	}
};
