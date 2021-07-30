// @need ../dist/croqujs
// @need ../dist/style ../dist/path ../dist/turtle
// @need ../dist/calc
// @need ../dist/widget
// @need ../dist/sprite ../dist/motion


const setup = function () {
	const r = new WIDGET.Switch(['#1', '#2', '#3', '#4', '#5']);
	r.onClick((index) => onPushed(r, index), true);
	r.setFullWidth(true);
};

const onPushed = function (r, index) {
	CROQUJS.removeAll(r.domElement());
	switch (index) {
		case 0: LEAF.setup(); break;
		case 1: VEIN.setup(); break;
		case 2: AUTUMN.setup(); break;
		case 3: TREE.setup(); break;
		case 4: FOREST.setup(); break;
	}
};


// -----------------------------------------------------------------------------


const LEAF = (function () {

	const setup = function () {
		const p = new CROQUJS.Paper(600, 600);
		p.translate(300, 450);
		const t = new TURTLE.Turtle(p);
		t.visible(true);

		p.animate(draw, [p, t]);
	};

	const draw = function (p, t) {
		p.styleClear().color('White').draw();
		t.home();
		drawLeaf(t);
		t.stepNext(2);
	};

	const drawLeaf = function (t) {
		drawMesophyll(t);
	};

	const drawMesophyll = function (t) {
		t.mode('fill');
		t.fill().grad('vector').addColor('LightGreen').addColor('Green');
		t.stroke();
		drawShape(t);
	};

	const drawShape = function (t) {
		t.save();
		t.edge(PATH.absSineEdge(20, 20, {reverse: true}));
		t.pd();

		t.tl(30);
		t.go(180);
		t.tr(60);
		t.go(180);

		t.tr(120);
		t.go(180);
		t.tr(60);
		t.go(180);

		t.pu();
		t.restore();
	};

	return { setup, draw, drawLeaf, drawMesophyll, drawShape };
}());


// -----------------------------------------------------------------------------


const VEIN = (function () {

	const setup = function () {
		const p = new CROQUJS.Paper(600, 600);
		p.translate(300, 450);
		const t = new TURTLE.Turtle(p);
		t.visible(true);

		p.animate(draw, [p, t]);
	};

	const draw = function (p, t) {
		CALC.resetRandomSeed();
		p.styleClear().color('White').draw();
		t.home();
		drawLeaf(t);
		t.stepNext(5);
	};

	const drawLeaf = function (t) {
		LEAF.drawMesophyll(t);
		drawVein(t);
	};

	const drawVein = function (t) {
		t.stroke().color('DarkGreen', 0.5);
		t.stroke().width(6);

		t.context().save();
		t.mode('clip');
		LEAF.drawShape(t);
		t.mode('stroke');
		drawLine(t);
		t.context().restore();
	};

	const drawLine = function (t) {
		t.save();
		t.edge(PATH.normalEdge());
		t.pd();

		t.go(30);
		for (let i = 0; i < 2; i += 1) {
			drawLineOne(t, 60 - i * 20, 200);
			drawLineOne(t, -60 + i * 20, 200);
		}
		for (let i = 0; i < 4; i += 1) {
			drawLineOne(t, 30, 200);
			t.go(30);
			drawLineOne(t, -30, 200);
			t.go(30);
		}
		t.go(200);

		t.pu();
		t.restore();
	};

	const drawLineOne = function (t, deg, size) {
		const d = CALC.random(deg - 5, deg + 5);
		t.tr(d);
		t.go(size).bk(size);
		t.tl(d);
	};

	return { setup, draw, drawLeaf, drawVein, drawLine, drawLineOne };
}());


// -----------------------------------------------------------------------------


const AUTUMN = (function () {

	const setup = function () {
		const th = new WIDGET.Thermometer();
		const p = new CROQUJS.Paper(580, 600);
		p.translate(290, 450);
		const t = new TURTLE.Turtle(p);
		t.visible(false);

		p.animate(draw, [p, t, th]);
	};

	const draw = function (p, t, th) {
		CALC.resetRandomSeed();
		p.styleClear().color('White').draw();
	//	console.log(th.value());
		t.home();
		drawLeaf(t, th.value());
		t.stepNext(5);
	};

	const drawLeaf = function (t, d) {
		if (d < -5) {return;}
		drawColorMesophyll(t, d);
		t.stroke().alpha(CALC.map(d, 0, 15, 0, 1));
		VEIN.drawVein(t, d);
	};

	const drawColorMesophyll = function (t, d) {
		t.mode('fill');
		t.fill().rgb(215, 215, 0);
		LEAF.drawShape(t);

		if (d > 10) {
			t.fill().grad('vector');
			t.fill().addRgb(0, 191, 0, CALC.map(d, 10, 15, 0, 1));
			t.fill().addRgb(0, 191, 0, 0);
			LEAF.drawShape(t);
			t.fill().grad('vector');
			t.fill().addRgb(0, 191, 0, 0);
			t.fill().addRgb(0, 191, 0, CALC.map(d, 15, 20, 0, 1));
			LEAF.drawShape(t);
		}
		if (d < 8) {
			t.fill().rgb(192, 0, 0, CALC.map(d, 8, 0, 0, 1));
			LEAF.drawShape(t);
		}
		if (d < 0) {
			t.fill().color('AliceBlue');
			LEAF.drawShape(t);
		}
	};

	return { setup, draw, drawLeaf, drawColorMesophyll };
}());


// -----------------------------------------------------------------------------


const TREE = (function () {

	const setup = function () {
		const th = new WIDGET.Thermometer();
		const step = new WIDGET.Slider(1, 6, 1, {int: true});
		const p = new CROQUJS.Paper(500, 600);
		p.translate(250, 450);
		const t = new TURTLE.Turtle(p);
		t.visible(false);

		p.animate(draw, [p, t, th, step]);
	};

	const draw = function (p, t, th, step) {
		CALC.resetRandomSeed();
		p.styleClear().color('White').draw();
		t.home();

		drawTree(t, th.value(), step.value());
		t.stepNext(5);
	};

	const drawTree = function (t, d, num) {
		t.save();
		t.mode('stroke');
		t.stroke().rgb(91, 0, 0);
		t.stroke().width(4);

		drawBranch(t, d, num, 1);
		t.restore();
	};

	const drawBranch = function (t, d, rest, scale) {
		if (rest === 0) {
			drawFoliage(t, d);
			return;
		}
		const p = t.context();
		p.save();
		t.save();
		t.edge(PATH.normalEdge());
		t.scale(scale);

		const w = CALC.map(p.mouseX(), 0, p.width(), -20, 20);
		t.tr(w);

		t.pd().go(30).pu();

		t.tl(15);
		drawBranch(t, d, rest - 1, 3 / 4);
		t.tr(15);

		t.pd().go(50).pu();

		t.tr(55);
		drawBranch(t, d, rest - 1, 1 / 2);
		t.tl(55);

		t.pd().go(100).pu();

		t.tl(60);
		drawBranch(t, d, rest - 1, 1 / 4);
		t.tr(60);

		t.tr(4);
		drawBranch(t, d, rest - 1, 1 / 2);
		t.tl(4);

		t.restore();
		p.restore();
	};

	const drawFoliage = function (t, d) {
		const p = t.context();
		p.save();
		const s = CALC.random(0.2, 0.8);
		t.scale(s);
		const w = CALC.map(p.mouseX(), 0, p.width(), -20, 20);
		t.tr(w);
		CALC.saveRandomState();
		stampLeaf(t, d);
		CALC.restoreRandomState();
		p.restore();
	};

	const stampLeaf = TURTLE.makeStamp(600, 600, 300, 450, 1, AUTUMN.drawLeaf);

	return { setup, draw, drawTree, drawBranch, drawFoliage };
}());


// -----------------------------------------------------------------------------


const FOREST = (function () {

	const setup = function () {
		const th = new WIDGET.Thermometer();
		const step = new WIDGET.Slider(1, 6, 1, {int: true});
		const p = new CROQUJS.Paper(500, 600);
		p.translate(250, 300);
		const t = new TURTLE.Turtle(p);
		const c = new SPRITE.Stage();

		makeForest(c);
		p.animate(draw, [p, t, th, step, c]);
	};

	const draw = function (p, t, th, step, c) {
		CALC.resetRandomSeed();
		p.styleClear().color('Khaki').draw();
		c.draw(p, [t, th.value(), step.value(), p.mouseX()]);
		c.update();
	};

	const makeForest = function (c) {
		for (let i = 0, I = 40; i < I; i += 1) {
			const s = c.makeSprite(stampTree);
			const x = CALC.random(-200, 200);
			const y = CALC.map(i, 0, I - 1, -150, 300, CALC.easeInCirc);
			s.moveTo(x, y);
			s.scale(CALC.map(y, -150, 300, 0.1, 2));
			s.angle(CALC.random(-30, 30));
			s.alpha(0.5);

			const speed = CALC.map(y, -150, 300, 1, 5);
			const m = new MOTION.AxisMotion(speed);
			m.setRangeX(-500, 500, true);
			s.motion(m);
		}
	};

	const stampTree = TURTLE.makeStamp(600, 600, 300, 450, 1, TREE.drawTree);

	return { setup, draw, makeForest };
}());
