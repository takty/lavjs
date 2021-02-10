// @need ../../dist/croqujs
// @need ../../dist/style ../../dist/path

const setup = function () {
	const p = new CROQUJS.Paper(600, 600);
	p.styleStroke().color('black', 1).width(3).dash(12, 3, 3, 3);

	const l = new PATH.Liner(PATH.makeDefaultHandler(p));
	l.edge(PATH.absSineEdge(20, 10));

	p.animate(draw, [p, l]);
};

let i = 0;

const draw = function (p, l) {
	p.styleClear().color('White').draw();

	const sin = (1 + Math.sin(i / 100)) / 2;
	i += 1;

	p.beginPath();
	p.moveTo(40, 40);
	l.line(40, 40, 0, 200, sin * 200);
	p.moveTo(40, 80);
	l.quadCurve(40, 80, 45, 150, -90, 150, sin * 240);
	p.moveTo(40, 160);
	l.bezierCurve(40, 160, 45, 150, -45, 100, -45, 150, sin * 360);
	p.moveTo(200, 300);
	l.arc(200, 300, 0, 100, 100, 135, 0, true, sin * 145);

	p.styleFill().hsl(150, 100, 50).darken(20).draw();
	p.styleStroke().draw();
};
