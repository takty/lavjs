// @need ../../dist/croqujs
// @need ../../dist/calc
// @need ../../dist/widget
// @need ../../dist/synth ../../dist/patch ../../dist/analyzer

const setup = function () {
	const s = new SYNTH.Synth();
	const ws = new ANALYZER.WaveformScope(500, 100);
	const ss = new ANALYZER.SpectrumScope(500, 100);
	const sl0 = new WIDGET.Slider(0, 100);
	const sl1 = new WIDGET.Slider(0, 1000);
	const inst = make(s, ws, ss);

	const p = new CROQUJS.Paper(200, 200);
	p.clear('white');
	p.onMouseDown(function (x, y) {
		play(inst, s.now());
	});
	p.onMouseMove(function (x, y) {
		const freq = CALC.map(x, 0, 200, 0, 1000);
		const gain = CALC.map(y, 200, 0, 0, 1);
		const v0 = sl0.value();
		const v1 = sl1.value();
		tune(inst, s.now(), gain, freq, v0, v1);
	});
	p.onMouseUp(function () {
		stop(inst, s.now());
	});
};

const make = function (s, ws, ss) {
	const osc = s.makeOsc({ type: 'sine' });
	const osc2 = s.makeOsc({ type: 'sine' });
	osc2.connect(osc.gain());

	const wave = s.makeScope({ widget: ws });
	const spec = s.makeScope({ widget: ss });

	s.connect(osc, wave, spec, s.speaker());
	return { osc, osc2 };
};

const play = function (inst, t) {
	inst.osc.play(t);
	inst.osc2.play(t);
};

const tune = function (inst, t, gain, freq, g, f) {
	inst.osc.gain(gain, t);
	inst.osc.freq(freq, t);
	inst.osc2.gain(gain, t);
	inst.osc2.freq(f, t);
};

const stop = function (inst, t) {
	inst.osc.stop(t);
	inst.osc2.stop(t);
};
