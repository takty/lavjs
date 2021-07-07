// @need ../../dist/croqujs
// @need ../../dist/style ../../dist/path ../../dist/turtle

const setup = function () {
	const p = new CROQUJS.Paper(600, 600);
	const t = new TURTLE.Turtle(p);
	p.animate(draw, [p, t]);
};

const draw = function (p, t) {
	p.styleClear().color('white').draw();
	t.home();

	t.moveTo(60, 120);
	drawSample(t, 'vertical');
	t.moveTo(60 + 130 * 1, 120);
	drawSample(t, 'horizontal');
	t.moveTo(60 + 130 * 2, 120);
	drawSample(t, 'vector');
	t.moveTo(60, 250);
	drawSample(t, 'inner');
	t.moveTo(60 + 130 * 1, 250);
	drawSample(t, 'outer');
	t.moveTo(60 + 130 * 2, 250);
	drawSample(t, 'diameter');
	t.moveTo(60 + 130 * 3, 250);
	drawSample(t, 'radius');

	t.stepNext(1);
};

const drawSample = function (t, type) {
	t.save();
	t.mode('fillstroke');
	t.fill().grad(type).addColor('black').addColor('white');
	drawShape(t);
	t.restore();

	t.save();
	t.mode('stroke');
	t.stroke().color('yellowGreen').dash([4, 4]).width(4);
	if (type === 'vertical' || type === 'horizontal') {
		drawArea(t);
	}
	if (type === 'vector') {
		drawVector(t);
	}
	if (type === 'inner') {
		t.save();
		t.tr(90).go(15.5).tl(90).go(44);
		t.pd().circle([50, 44]).pu();
		t.restore();
		t.save();
		setAdditionalLineStroke(t);
		drawArea(t);
		t.restore();
	}
	if (type === 'outer') {
		t.save();
		t.tr(90).go(15.5).tl(90).go(44);
		t.pd().circle([50 * 1.35, 44 * 1.35]).pu();
		t.restore();
		t.save();
		setAdditionalLineStroke(t);
		drawArea(t);
		t.restore();
	}
	if (type === 'diameter') {
		t.save();
		t.tr(34).go(53);
		t.pd().circle(52).pu();
		t.restore();
		t.save();
		setAdditionalLineStroke(t);
		drawVector(t);
		t.restore();
	}
	if (type === 'radius') {
		t.save();
		t.pd().circle(104, [-18, 90]).pu();
		t.restore();
		t.save();
		setAdditionalLineStroke(t);
		drawVector(t);
		t.restore();
	}
	t.restore();
};

const drawShape = function (t) {
	t.pd();
	t.tl(40).go(50);
	t.tr(90).go(50);
	t.tr(90).go(20);
	t.tl(90).go(50);
	t.tr(90).go(10);
	t.tr(90).go(50);
	t.tl(90).go(20);
	t.tr(90).go(50);
	t.pu();
};

const drawArea = function (t) {
	t.pd();
	t.tl(90).go(33);
	t.tr(90).go(88);
	t.tr(90).go(97);
	t.tr(90).go(88);
	t.tr(90).go(62);
	t.pu();
};

const drawVector = function (t) {
	t.pd();
	t.tr(34).go(106);
	t.pu();
};

const setAdditionalLineStroke = function (t) {
	t.stroke().color('orange').dash().width(2);
};
