// @need ../dist/croqujs
// @need ../dist/widget

function setup() {
// 	const p = new CROQUJS.Paper(600, 600);
// 	p.clear('white');
	testChatWidget();
	testSwitchWidget();
	testToggleWidget();
	testOutputWidget();
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
