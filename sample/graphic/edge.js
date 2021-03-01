// @need ../../dist/croqujs
// @need ../../dist/style ../../dist/path ../../dist/turtle
// @need ../../dist/ruler
// @need ../../dist/calc

const OFFSET   = 16;
const INTERVAL = 10;
const WIDTH    = 256;
const HEIGHT   = 72;
const WAV_LEN  = 40;
const WAV_AMP  = 24;

const setup = function () {
	const p = new CROQUJS.Paper(600, 600);
	const t = new TURTLE.Turtle(p);
	const r = p.getRuler();
	r.stroke().color('lime').width(0.5);
	p.animate(draw, [p, t, r]);
};

const draw = function (p, t, r) {
	p.styleClear().color('white').draw();
	t.home();
	t.tr(90);

	const es = ['normalEdge', 'triangleEdge', 'sineEdge', 'absSineEdge', 'squareEdge', 'sawtoothEdge', 'noiseEdge'];
	for (let i = 0; i < es.length; i += 1) {
		const e = es[i];
		const y = (HEIGHT + INTERVAL) * i;
		t.moveTo(OFFSET, OFFSET + HEIGHT / 2 + y);
		t.edge(PATH[e](WAV_LEN, WAV_AMP));
		t.pd().go(WIDTH).pu();

		r.rect(OFFSET - 2, OFFSET + y, WIDTH + 4, HEIGHT).draw('stroke');
	}
	t.stepNext(1);
};
