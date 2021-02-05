// @need ../../dist/croqujs
// @need ../../dist/synth ../../dist/patch ../../dist/analyzer

const setup = function () {
	const s = new SYNTH.Synth();
	const ws = new ANALYZER.WaveformScope(600, 300);
	const ss = new ANALYZER.SpectrumScope(600, 300);
	const inst = make(s, ws, ss);

	tune(inst, s.time(), 1);
	play(inst, s.time());
};

const make = function (s, ws, ss) {
	const mic = s.makeMic();

	const wave = s.makeScope({ widget: ws });
	const spec = s.makeScope({ widget: ss });

	s.connect(mic, wave, spec);
	return { mic };
};

const play = function (inst, t) {
	inst.mic.play(t);
};

const tune = function (inst, t, gain) {
	inst.mic.gain(gain, t);
};

const stop = function (inst, t) {
	inst.mic.stop(t);
};
