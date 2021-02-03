// @need ../dist/croqujs
// @need ../dist/widget

function setup() {
// 	const p = new CROQUJS.Paper(600, 600);
// 	p.clear('white');
	testSliderWidget();
	testChatWidget();
	testSwitchWidget();
	testToggleWidget();
	testOutputWidget();
}

function testSliderWidget() {
	const w1 = new WIDGET.Slider(-3000, 2000);
	w1.onChange(v => console.log(v));
	const w3 = new WIDGET.Slider(0, 1000, 0, { int: true, vertical: false });
	w1.onChange(v => console.log(v));
	const w2 = new WIDGET.Thermometer();
	w2.onChange(v => console.log(v));
}

function testChatWidget() {
	const w1 = new WIDGET.Chat(300, 300);
}

function testSwitchWidget() {
	const w1 = new WIDGET.Switch(2, 0);
	w1.onClick((e) => { console.log(e); }, true);
}

function testToggleWidget() {
	const w1 = new WIDGET.Toggle(['Caption', 'Caption'], [true, false]);
	w1.onClick((e, f) => { console.log(e, f); }, true);
	const w2 = new WIDGET.Toggle(3);
}

function testOutputWidget() {
	const w1 = new WIDGET.Output(200);
	w1.value('Output string.');
	w1.value('Output very very long long string.');
	w1.setFullWidth(true);
// 	w1.setVisible(false);

	const w2 = new WIDGET.Output(200, null, true);
	w2.value('Output string.');
	w2.value('Output very very long long string.');
	console.log(w2.value());
}
