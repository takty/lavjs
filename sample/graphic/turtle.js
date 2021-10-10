// @need ../../dist/croqujs
// @need ../../dist/style ../../dist/path ../../dist/turtle
// @need ../../dist/widget

const setup = function () {
	const p = new CROQUJS.Paper(600, 600);
	const l = new PATH.Liner(PATH.makeDefaultHandler(p));
	const t = new TURTLE.Turtle(p);
	t.visible(true);
	t.scale(0.5);
	t.mode('strokefill');
	t.fill().gradation('horizontal').addColor('LightGreen', 0.3).addColor('Olive');
	t.stroke().color('black').dash(12, 3, 3, 3).width(10);

	p.styleStroke().color('black').dash(12, 3, 3, 3);
	p.translate(300, 300);
	p.animate(draw, [p, l, t]);
};

const draw = function (p, l, t) {
	p.styleClear().color('White').draw();
	t.save(true);
	t.scale(1.5, 0.9);
	t.home();
	drawShape1(t);
	t.moveTo(0, 150);
	drawShape2(t);
	t.restore(true);
	t.stepNext(1);
};

const drawShape1 = function (t) {
	t.pd();
	t.tr(45);
	t.go(10);
	t.cr(150, 30, 120, 90, 120);
	t.ar([150, 100], [49, 729]);
	t.go(100).pd().dot().pu().go(100);
	t.pu();
};

const drawShape2 = function (t) {
	t.pd();
	t.go(100).tl(144);
	t.go(100).tl(144);
	t.go(100).tl(144);
	t.go(100).tl(144);
	t.go(100);
	t.pu();
};
