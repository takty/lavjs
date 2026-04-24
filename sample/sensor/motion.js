// @need ../../dist/croqujs
// @need ../../dist/sensor

const setup = function () {
	const ms = new SENSOR.Motion();
	ms.start();

	const p = new CROQUJS.Paper(400, 528);
	p.animate(draw, [p, ms]);
};

const draw = function (p, ms) {
	p.resetTransform();
	p.fillStyle = '#ffffff';
	p.fillRect(0, 0, p.width(), p.height());

	p.font = 'bold 14px monospace';
	const col1 = 16, col2 = 224;
	let y = 24;
	const lineH = 32;

	p.fillStyle = '#000000';
	p.font = 'bold 12px monospace';

	const drawSection = function (title) {
		p.fillText(title, col1, y);
		y += lineH * 0.8;
	};

	const drawRow = function (label, value) {
		const v = isNaN(value) ? '---' : value.toFixed(2);
		p.fillText(label, col1 + 12, y);
		p.fillText(v, col2, y);
		y += lineH;
	};

	const drawBar = function (value, min, max) {
		const barX = col2 + 70, barW = 90, barH = 10;
		const barY = y - lineH - 10;
		p.fillStyle = '#000000';
		p.fillRect(barX, barY, barW, barH);

		if (!isNaN(value)) {
			const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
			p.fillStyle = '#999999';
			p.fillRect(barX, barY, barW * ratio, barH);
		}
		p.fillStyle = '#000000';
	};

	drawSection('Orientation [deg]');
	drawRow('X  (-180 ~ 180)', ms.orientationX());
	drawBar(ms.orientationX(), -180, 180);
	drawRow('Y   (-90 ~  90)', ms.orientationY());
	drawBar(ms.orientationY(), -90, 90);
	drawRow('Z    (0 ~ 360)', ms.orientationZ());
	drawBar(ms.orientationZ(), 0, 360);

	y += lineH * 0.3;

	drawSection('Acceleration [m/s²]');
	drawRow('X', ms.accelerationX());
	drawBar(ms.accelerationX(), -20, 20);
	drawRow('Y', ms.accelerationY());
	drawBar(ms.accelerationY(), -20, 20);
	drawRow('Z', ms.accelerationZ());
	drawBar(ms.accelerationZ(), -20, 20);

	y += lineH * 0.3;

	drawSection('Acceleration + Gravity [m/s²]');
	drawRow('X', ms.accelerationGravityX());
	drawBar(ms.accelerationGravityX(), -20, 20);
	drawRow('Y', ms.accelerationGravityY());
	drawBar(ms.accelerationGravityY(), -20, 20);
	drawRow('Z', ms.accelerationGravityZ());
	drawBar(ms.accelerationGravityZ(), -20, 20);

	y += lineH * 0.3;

	drawSection('Rotation Rate [deg/s]');
	drawRow('X (-360 ~ 360)', ms.rotationX());
	drawBar(ms.rotationX(), -360, 360);
	drawRow('Y (-360 ~ 360)', ms.rotationY());
	drawBar(ms.rotationY(), -360, 360);
	drawRow('Z (-360 ~ 360)', ms.rotationZ());
	drawBar(ms.rotationZ(), -360, 360);
};
