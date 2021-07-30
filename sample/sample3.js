// @need ../dist/croqujs
// @need ../dist/style ../dist/path ../dist/turtle
// @need ../dist/calc
// @need ../dist/widget
// @need ../dist/sprite ../dist/motion


const setup = function () {
	const r = new WIDGET.Switch(['#1', '#2', '#3', '#4', '#5']);
	r.onClick((index) => onPushed(r, index));
	r.setFullWidth(true);
};

const onPushed = function (r, index) {
	CROQUJS.removeAll(r.domElement());
	switch (index) {
		case 0: STAR.setup(); break;
		case 1: PLANET.setup(); break;
		case 2: SYSTEM.setup(); break;
		case 3: GALAXY.setup(); break;
		case 4: UNIVERSE.setup(); break;
	}
};


// -----------------------------------------------------------------------------


const STAR = (function () {

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
		drawConstellation(t);
		t.stepNext(1);
	};

	const drawVertex = function (t, r) {
		t.save();
		t.pu();

		t.mode('fill');
		t.fill().rgb(255, 255, CALC.random(0, 255));
		t.pd().circle(r).pu();
		t.restore();
	};

	const drawConstellation = function (t) {
		t.mode('stroke');
		t.stroke().color('White', 0.5);
		t.pd();

		drawVertex(t, 8);
		t.tl(30);
		t.go(100);
		drawVertex(t, 4);
		t.tr(120);
		t.go(100);
		drawVertex(t, 8);
		t.tr(120);
		t.go(100);

		t.pu();
	};

	return { setup, draw, drawConstellation, drawVertex };
}());


// -----------------------------------------------------------------------------


const PLANET = (function () {

	const setup = function () {
		const sl = new WIDGET.Slider(0, 6, 0, {int: true});
		const p = new CROQUJS.Paper(580, 600);
		p.translate(290, 300);
		const t = new TURTLE.Turtle(p);
		t.visible(false);

		p.animate(draw, [p, t, sl]);
	};

	const draw = function (p, t, sl) {
		CALC.resetRandomSeed();
		p.styleClear().color('Black').draw();
		t.save(true);
		t.scale(CALC.map(p.mouseY(), 50, 600, 1, 20));

		const bodyFill = new STYLE.Fill().color('SteelBlue');
		const terrFill = new STYLE.Fill().rgb(0, 191, 127, 0.75);
		drawObject(t, sl.value(), bodyFill, terrFill);

		t.restore(true);
		t.stepNext(10);
	};

	const testZig = function (t, num, bodyFill, terrFill) {
		t.context().styleClear(bodyFill).draw();
		t.stroke(terrFill);
		t.bk(300);
		t.pd();
		zig(t, num, 600);
		t.pu();
	};

	const drawObject = function (t, num, bodyFill, terrFill) {
		t.save(true);

		t.mode('fillClip');
		t.fill(bodyFill)
		t.pd().circle(200).pu();

		t.fill(terrFill)
		drawTerrain(t, num);

		t.fill().lighten(CALC.random(50, 100));
		t.tr(CALC.random(0, 360));
		t.step(CALC.random(0.1, 2));
		drawTerrain(t, num);

		t.restore(true);
	};

	const drawTerrain = function (t, num) {
		t.mode('fill');
		t.pd();

		t.tl(30);
		zig(t, num, 180);
		t.tr(120);
		zig(t, num, 180);
		t.tr(120);
		zig(t, num, 180);

		t.pu();
	};

	const zig = function (t, rest, step) {
		if (rest === 0) {
			t.go(step);
			return;
		}
		const ct = t.makeChild();
		ct.go(step);

		t.tl(10);
		zig(t, rest - 1, step / 3);
		t.tl(50);
		zig(t, rest - 1, step / 2);
		t.tr(140);
		zig(t, rest - 1, step / 1.5);
		t.tl(108);
		zig(t, rest - 1, step / 3);

		t.gatherTo(ct);
	};

	return { setup, draw, drawObject, drawTerrain, zig };
}());


// -----------------------------------------------------------------------------


const SYSTEM = (function () {

	const setup = function () {
		const sl = new WIDGET.Slider(-50, 100, 0, {int: true});
		const p = new CROQUJS.Paper(580, 600);
		p.translate(290, 300);
		const t = new TURTLE.Turtle(p);

		const orbit = new CROQUJS.Paper(580, 600, false);
		orbit.translate(290, 300);
		orbit.styleStroke().color('White').assign(orbit);

		const system = makeSystem(p, orbit, sl);

		p.animate(draw, [p, t, orbit, system, sl]);
	};

	const draw = function (p, t, orbit, system, sl) {
		CALC.resetRandomSeed();
		p.styleClear().color('Black').draw();

		p.drawImage(orbit.canvas, -290, -300);
		orbit.styleClear().color('Black', 0.005).draw();

		system.draw(p, [t, sl.value()]);
		system.update();
	};

	const makeSystem = function (p, orbit, dist) {
		const system = new SPRITE.Stage();
		const star = makeStarSprite(system);
		const planet = makePlanetSprite(system, 100, 0.1, 200, orbit, drawHabitablePlanet);
		const planet2 = makePlanetSprite(system, 200, 0.25, 200, orbit, drawPlanet);
// 		system.localize(planet);

		if (!dist) {return system;}
		dist.onChange((val) => {
			planet.moveTo(50 * (1 + val / 100), 0);
			orbit.clear();
		});
		return system;
	};

	const makePlanetSprite = function (stage, r, scale, speed, orbit, func) {
		const pm = new MOTION.PolarMotion(-speed, 0, true);
		const rot = new MOTION.Rotation(-10);
		const s = stage.makeSprite(func, pm, rot);
		s.scale(scale);
		s.x(r);

		if (orbit) {
			s.onUpdate(SPRITE.makePlotFunction(s, stage, orbit));
		}
		return s;
	};

	const makeStarSprite = function (stage) {
		const rot = new MOTION.Rotation(-10);
		const s = stage.makeSprite(drawStar, null, rot);
		s.scale(0.1);
		return s;
	};

	const drawStar = function (t) {
		const bodyFill = new STYLE.Fill().color('Red');
		const geoFill = new STYLE.Fill().color('Pink');
		PLANET.drawObject(t, 3, bodyFill, geoFill);
	};

	const drawHabitablePlanet = function (t, d) {
		const bodyFill = new STYLE.Fill().color('Blue');
		const terrFill = new STYLE.Fill().color('Green');

		if (d < -10) {
			bodyFill.color('Tan');
			terrFill.color('Olive');
		}
		if (d > 10) {
			bodyFill.color('AliceBlue');
			terrFill.color('Snow');
		}
		PLANET.drawObject(t, 3, bodyFill, terrFill);
	};

	const drawPlanet = function (t, d) {
		const bodyFill = new STYLE.Fill().color('Turquoise');
		const terrFill = new STYLE.Fill().color('Royalblue');
		PLANET.drawObject(t, 3, bodyFill, terrFill);
	};

	return { setup, makeSystem, draw, makePlanetSprite, makeStarSprite, drawStar };
}());


// -----------------------------------------------------------------------------


const GALAXY = (function () {

	const setup = function () {
		const p = new CROQUJS.Paper(600, 600);
		p.translate(300, 300);
		const t = new TURTLE.Turtle(p);
		t.visible(false);

		p.animate(draw, [p, t]);
	};

	const draw = function (p, t) {
		CALC.resetRandomSeed();
		p.styleClear().color('Black').draw();
		drawGalaxy(t);
		t.stepNext(100);
	};

	const drawGalaxy = function (t) {
		t.tr(1);
		t.save();
		t.mode('fill');

		for (let i = 0; i < 4; i += 1) {
			drawArmOne(t);
			t.tr(90);
		}
		t.restore();
	};

	const drawArmOne = function (t) {
		t.save();
		t.setHome();
		t.go(20);
		for (let i = 0; i < 20; i += 1) {
			drawStars(t, CALC.map(i, 0, 20, 60, 20), CALC.map(i, 0, 20, 200, 5));
			t.go(40);
			t.tl(258 - t.getDirectionOfHome());
		}
		t.restore();
	};

	const drawStars = function (t, r, num) {
		t.save();
		t.setHome();

		for (let i = 0; i < num; i += 1) {
			t.tr(CALC.random(0, 360));
			t.go(CALC.random(2, r));
			STAR.drawVertex(t, CALC.random(1, 2));
			t.home();
		}
		t.restore();
	};

	return { setup, draw, drawGalaxy, drawArmOne, drawStars };
}());


// -----------------------------------------------------------------------------


const UNIVERSE = (function () {

	const setup = function () {
		const dist = new WIDGET.Slider(0, 2, 0, false);
		const p = new CROQUJS.Paper(580, 600);
		p.translate(290, 300);
		const t = new TURTLE.Turtle(p);
		t.visible(false);
		const system = SYSTEM.makeSystem(p);

		p.animate(draw, [p, t, dist, system]);
	};

	const draw = function (p, t, dist, system) {
		CALC.resetRandomSeed();
		p.styleClear().color('Black').draw();
		p.rotate(0.01);
		t.save(true);
		drawUniverse(p, t, dist.value(), system);
		t.restore(true);
	};

	const drawUniverse = function (p, t, depth, system) {
		if (depth < 0.5) {
			p.save();
			system.x(CALC.map(depth, 0, 2, 0, -150));
			system.scale(CALC.map(depth, 0, 0.5, 1, 0));
			system.alpha(CALC.map(depth, 0, 0.5, 1, 0));
			system.draw(p, [t, 0]);
			system.update();
			p.restore();
		}
		if (0 < depth && depth < 2) {
			t.save(true);
			t.moveTo(CALC.map(depth, 0, 2, 0, -150), 0);
			t.scale(CALC.map(depth, 0, 2, 1.5, 0));
			p.globalAlpha = CALC.map(depth, 0, 2, 0, 1);
			STAR.drawConstellation(t);
			t.restore(true);
		}
		if (1.5 < depth) {
			p.save();
			t.scale(CALC.map(depth, 1.5, 2, 10, 1));
			p.globalAlpha = CALC.map(depth, 1.5, 2, 0, 1);
			stampGalaxy(t);
			p.restore();
		}
	};

	const stampGalaxy = TURTLE.makeStamp(600, 600, 300, 300, 1, GALAXY.drawGalaxy);

	return { setup, draw };
}());
