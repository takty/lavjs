// @need ../../dist/croqujs
// @need ../../dist/style ../../dist/path ../../dist/turtle

const setup = function () {
	const p = new CROQUJS.Paper(600, 600);
	p.translate(300, 300);
	STYLE.augment(p);
	const t = new TURTLE.Turtle(p);
	p.animate(draw, [p, t]);
};

const draw = function (p, t) {
	p.styleClear().color('white').draw();
	t.home();
	t.pd();
	t.go(100).tl(144);
	t.go(100).tl(144);
	t.go(100).tl(144);
	t.go(100).tl(144);
	t.go(100);
	t.pu();
	t.stepNext(1);
};
