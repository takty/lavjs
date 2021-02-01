// @need ../dist/croqujs
// @need ../dist/widget

function setup() {
// 	const p = new CROQUJS.Paper(600, 600);
// 	p.clear('white');
	testToggleWidget();
	testOutputWidget();
}

function testToggleWidget() {
	const w1 = new WIDGET.Toggle('Caption');
	w1.onClick((e, f) => { console.log(e, f); });
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
}
