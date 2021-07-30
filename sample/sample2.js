// @need ../dist/croqujs
// @need ../dist/style ../dist/path ../dist/turtle
// @need ../dist/ruler
// @need ../dist/calc
// @need ../dist/widget
// @need ../dist/tracer ../dist/motion ../dist/sprite


const setup = function () {
	const r = new WIDGET.Switch(['#1', '#2', '#3', '#4', '#5']);
	r.onClick((index) => onPushed(r, index));
	r.setFullWidth(true);
};

const onPushed = function (r, index) {
	CROQUJS.removeAll(r.domElement());
	switch (index) {
		case 0: DROPLET.setup(); break;
		case 1: SNOW.setup(); break;
		case 2: PHASE.setup(); break;
		case 3: CLOUD.setup(); break;
		case 4: SCENE.setup(); break;
	}
};


// -----------------------------------------------------------------------------


const DROPLET = (function () {

	const setup = function () {
		const p = new CROQUJS.Paper(600, 600);
		p.translate(300, 300);
		const t = new TURTLE.Turtle(p);
		t.visible(true);
		t.step(10).stroke().color('White');

		p.animate(draw, [p, t]);
	};

	const draw = function (p, t) {
		p.styleClear().color('Black').draw();
		t.home();
		drawRaindrop(t);
		drawIceCrystal(t);
		drawCloudParticle(t);
		t.stepNext(5);
	};

	const drawRaindrop = function (t) {
		t.mode('fill');
		t.fill().reset();//shadow(20, 'White');
		t.fill().gradation('radius').addColor('Aqua').addRgb(0, 127, 127, 0.5);
		t.stroke().color('White');

		t.step(20);
		drawCircle(t);
	};

	const drawCloudParticle = function (t) {
		t.mode('fill');
		t.fill().reset();//shadow(20, 'White');
		t.fill().color('White');
		t.stroke().color('White');

		t.step(2);
		drawCircle(t);
	};

	const drawCircle = function (t) {
		t.save();
		t.edge(PATH.normalEdge());
		t.pd();
		t.circle(10);
		t.pu();
		t.restore();
	};

	const drawIceCrystal = function (t) {
		t.mode('fill');
		t.fill().reset();//shadow(20, 'White');
		t.fill().gradation('radius').addColor('Aqua').addRgb(0, 127, 127).addRgb(0, 0, 255, 0.5);
		t.stroke().color('White');

		t.step(2);
		drawPolygon(t);
	};

	const drawPolygon = function (t) {
		t.save();
		t.edge(PATH.normalEdge());
		t.tl(120).go(10).tr(120);
		t.pd();

		t.go(10).tr(60);
		t.go(10).tr(60);
		t.go(10).tr(60);
		t.go(10).tr(60);
		t.go(10).tr(60);
		t.go(10);

		t.pu();
		t.restore();
	};

	return { setup, draw, drawRaindrop, drawCloudParticle, drawCircle, drawIceCrystal, drawPolygon };
}());


// -----------------------------------------------------------------------------


const SNOW = (function () {

	const setup = function () {
		const p = new CROQUJS.Paper(600, 600);
		p.translate(300, 300);
		const t = new TURTLE.Turtle(p);
		t.visible(true);

		p.animate(draw, [p, t]);
	};

	const draw = function (p, t) {
		p.styleClear().color('Black').draw();
		t.home();
		drawSnowFlake(t);
		t.stepNext(5);
	};

	const drawSnowFlake = function (t) {
		t.mode('fillStroke');
		t.fill();
		t.stroke().dash([3, 4]).rgb(99, 255, 255, 0.5).width(10);

		for (let i = 0; i < 6; i += 1) {
			t.fill().rgb(15 + i * 40, 15 + i * 40, 255, 0.5);
			t.stroke();
			t.step(20);
			drawSnowPart(t);
			t.fill().rgb(0, 255, 191, 0.5);
			t.stroke();
			t.step(10);
			drawSnowPart(t);
			t.tr(60);
		}
	};

	const drawSnowPart = function (t) {
		const N = Math.sqrt(3);
		t.save();
		t.edge(PATH.normalEdge());
		t.pd();

		t.tl(30);
		t.go(N * 6);
		t.tr(90);
		t.go(6);
		t.tr(60);
		t.go(6);
		t.tr(90);
		t.go(N * 6);

		t.pu();
		t.restore();
	};

	return { setup, draw, drawSnowFlake, drawSnowPart };
}());


// -----------------------------------------------------------------------------


const PHASE = (function () {

	const setup = function () {
		const ph = new WIDGET.Slider(0, 3, 0, {int: true});
		const p = new CROQUJS.Paper(580, 600);
		const t = new TURTLE.Turtle(p);
		const c = new SPRITE.Stage();

		for (let i = 0; i < 100; i += 1) {
			makeDropletSprite(p, c, CALC.random(0.1, 0.3));
		}
		p.animate(draw, [p, t, c, ph]);
	};

	const draw = function (p, t, c, ph) {
		p.styleClear().color('Black').draw();
//		console.log(ph.value());
		t.home();
		c.draw(p, [t, ph.value(), p.mouseY()]);
		c.update();
		t.stepNext(5);
	};

	const makeDropletSprite = function (p, c, size) {
		const s = c.makeSprite(drawDroplet);
		s.fixedHeading(true);
		s.scale(size);

		s.moveTo(CALC.random(10, 570), CALC.random(10, 590), 180);
		s.setRangeX(-10, 610, true);
		s.setRangeY(-10, 610, true);
		s.angle(CALC.random(0, 360));

		const m = new TRACER.TraceMotion();
		s.motion(m);
		setMotion(m, p);
		const r = new MOTION.Rotation(1);
		s.rotation(r);
		return s;
	};

	const setMotion = function (m, p) {
		m.go(10);
		let d = 180 + CALC.random(-50, 50);
		if (p.mouseLeft()) {
			d += CALC.map(p.mouseX(), 0, 580, 60, -60) + CALC.random(-50, 50);
		}
		m.direction(d);
		m.doLater(setMotion, [m, p]);
	};

	const drawDroplet = function (t, phase, mouseY) {
		t.save();
		t.home();

		if (phase === 3 && this.y() > mouseY) {
			phase = 4;
		}
		if (phase === 1) {
			DROPLET.drawCloudParticle(t);
		}
		if (phase === 2) {
			DROPLET.drawIceCrystal(t);
		}
		if (phase === 3) {
			stampSnowFlake(t);
		}
		if (phase === 4) {
			DROPLET.drawRaindrop(t);
		}
		t.restore();

		this.speed(1);
		if (this.y() > mouseY) {
			this.speed(2);
		}
	};

	const stampSnowFlake = TURTLE.makeStamp(600, 600, 300, 300, 2, SNOW.drawSnowFlake);

	return { setup, draw, makeDropletSprite, setMotion, drawDroplet };
}());


// -----------------------------------------------------------------------------


const CLOUD = (function () {

	const setup = function () {
		const step = new WIDGET.Slider(1, 5, 1, {int: true});
		const p = new CROQUJS.Paper(580, 600);
		const t = new TURTLE.Turtle(p);
		t.visible(false);
		const c = new SPRITE.Stage();

		for (let i = 0; i < 10; i += 1) {
			PHASE.makeDropletSprite(p, c, 0.05);
		}
		p.animate(draw, [p, t, c, step]);
	};

	const draw = function (p, t, c, step) {
		p.styleClear().color('DarkBlue').draw();
		c.draw(p, [t, 3, p.mouseY()]);
		c.update();

		t.moveTo(290, 300, 0);
		const m = p.mouseX() / p.width();
		drawCloud(t, step.value(), m);

		t.stepNext(50);
	};

	const drawCloud = function (t, num, m) {
		t.save();
		t.mode('fill');
		t.fill().alpha(0.2);
		t.fill().gradation('vector').addRgb(255, 255, 255).addRgb(191, 191, 191);

		const w = CALC.map(m, 0, 1, -60, 60);
		t.tr(w);
		drawMoku(t, num, m, 1);
		t.restore();
	};

	const drawMoku = function (t, rest, m, scale) {
		if (rest === 0) {
			return;
		}
		const p = t.context();
		p.save();
		t.save();
		t.scale(scale);

		const w = CALC.map(m, 0, 1, -60, 60);
		t.tr(w);
		t.pd().circle([100, 150]).pu();
		t.setHome();

		t.go(90);
		t.tl(54 + w);
		drawMoku(t, rest - 1, m, 1 / 2);
		t.home();

		t.tr(110);
		t.go(140);
		drawMoku(t, rest - 1, m, 3 / 5);
		t.home();

		t.tl(132 + w);
		t.go(120);
		t.tr(42);
		drawMoku(t, rest - 1, m, 3 / 5);
		t.home();

		t.tr(170);
		t.go(50);
		drawMoku(t, rest - 1, m, 4 / 5);
		t.home();

		t.restore();
		p.restore();
	};

	return { setup, draw, drawCloud, drawMoku };
}());


// -----------------------------------------------------------------------------


const SCENE = (function () {

	const setup = function () {
		const p = new CROQUJS.Paper(600, 600);
		const t = new TURTLE.Turtle(p);
		const c = new SPRITE.Stage();

		for (let i = 0; i < 100; i += 1) {
			PHASE.makeDropletSprite(p, c, 0.05);
		}
		p.animate(draw, [p, t, c]);
	};

	const draw = function (p, t, c) {
		p.styleClear().color('DarkBlue').draw();
		c.draw(p, [t, 3, p.mouseY()]);
		c.update();
		drawMountain(p, t, p.mouseY());
		drawZeroLine(p, p.mouseY());
		drawCloud(p, t, 300, 50);
		drawCloud(p, t, 200, 50);
		drawCloud(p, t, 400, 50);


		t.stepNext(5);
	};

	const drawCloud = function (p, t, x, y) {
		const w = CALC.map(p.mouseX(), 0, p.width(), -20, 20);
		t.moveTo(x + w, y, 0);
		stampCloud(t, 5, p.mouseX() / p.width());
	};

	const drawMountain = function (p, t, y) {
		t.mode('fill');
		t.fill().color('Green');
		drawMountainShape(t);
		p.save();
		t.mode('clip');
		drawMountainShape(t);
		p.styleFill().color('White').assign(p);
		p.fillRect(0, 0, 600, y);
		p.restore();
	};

	const drawMountainShape = function (t) {
		t.save();
		t.edge(PATH.normalEdge());
		t.moveTo(0, 600, 90);
		t.pd();

		t.go(128);
		t.cl(100, 45, 100);
		t.go(320);
		t.cr(50, 90, 50);
		t.go(500);

		t.pu();
		t.restore();
	};

	const drawZeroLine = function (p, y) {
		p.save();
		const ruler = p.getRuler();
		ruler.line(0, y, 600, y);
		ruler.stroke().color('White');
		ruler.draw('stroke');

		const str = CALC.map(y, 0, 600, 8000, 0).toFixed() + 'm';
		p.styleFill().color('White').shadow(2, 'Black').assign(p);
		p.font = 'bold 16px sans-serif';
		p.fillText(str, 10, y);

		p.restore();
	};

	const stampCloud = TURTLE.makeStamp(600, 600, 300, 300, 0.5, CLOUD.drawCloud, 0, 5);

	return { setup, draw, drawMountain, drawMountainShape, drawZeroLine, drawCloud };
}());
