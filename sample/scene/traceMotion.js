// @need ../../dist/croqujs
// @need ../../dist/style ../../dist/path ../../dist/turtle
// @need ../../dist/tracer ../../dist/sprite
// @need ../../dist/calc

const setup = function () {
	const p = new CROQUJS.Paper(600, 600);
	const t = new TURTLE.Turtle(p);
	t.mode('fill');
	t.fill().color('Snow');

	const layer = new SPRITE.Stage();
	for (let i = 0; i < 100; i += 1) {
		const s = layer.makeSprite(drawSprite);
		s.x(CALC.random(-150, 750));
		s.y(CALC.random(-150, 750));
		s.direction(CALC.random(0, 360));
		s.speed(10);
		s.setRangeX(0, 600, true);
		s.setRangeY(0, 600, true);
		const m = new TRACER.Tracer();
		setMotion(m);
		s.motion(m);
	}
	p.onMouseClick((x, y) => {
		layer.forEach(function (e) { e.x(x); e.y(y); e.motion().ar(100, 360); });
	});
	p.animate(draw, [p, t, layer]);
};

const draw = function (p, t, layer) {
	p.clear('DarkBlue');
	layer.draw(p, [p, t]);
};

const drawSprite = function (p, t) {
	t.home();
	t.pd();
	t.circle([4, 8]);
	t.pu();
};

const setMotion = function (t) {
	t.ar(CALC.random(50, 100), 360);
	t.al(CALC.random(50, 100), 360);
	t.doLater(setMotion, [t]);
};

const handleFrame = function (t) {
	if (610 < t.y()) {
		t.stop();
		t.x(CALC.random(0, 600));
		t.y(CALC.random(-100, -150));
		t.direction(180);
		setMotion(t);
	}
	if (300 < t.y()) {
		t.ts = 2;
	} else {
		t.ts = 1;
	}
};
