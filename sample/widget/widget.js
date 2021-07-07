// @need ../../dist/croqujs
// @need ../../dist/calc
// @need ../../dist/widget

function setup() {
	testChartWidget();
	testSliderWidget();
	testChatWidget();
	testSwitchWidget();
	testToggleWidget();
	testOutputWidget();
}

function testChartWidget() {
	const chart = new WIDGET.Chart(600);  // 文字を表示する部分を作る
	chart.setDigits(1);
	chart.setItems({
		key1: { name: 'name1' },
		key2: { name: 'name2' },
		key3: { name: 'name3' },
		key4: { name: 'name4' },
		key5: { name: 'name5' },
		key6: { name: 'name6' },
		key7: { name: 'name7' },
		key8: { name: 'name8' },
	});
	let i = 0;
	setInterval(() => {
		chart.addData({
			key1: CALC.noise(i + Math.random()) * 0.1,
			key2: CALC.noise(i + Math.random()) * -0.2,
			key3: CALC.noise(i + Math.random()) * 0.3,
			key4: CALC.noise(i + Math.random()) * -0.4,
			key5: CALC.noise(i + Math.random()) * 0.5,
			key6: CALC.noise(i + Math.random()) * -0.6,
			key7: CALC.noise(i + Math.random()) * 0.7,
			key8: CALC.noise(i + Math.random()) * -0.8,
		});
		i += Math.random();
	}, 100);
}

function testSliderWidget() {
	const w1 = new WIDGET.Slider(-3000, 2000);
	w1.onChange(v => console.log(v));
	const w3 = new WIDGET.Slider(0, 1000, 0, { int: true, vertical: false });
	w1.onChange(v => console.log(v));
	const w2 = new WIDGET.Thermometer();
	w2.onChange(v => console.log(v));
}

async function testChatWidget() {
	const w1 = new WIDGET.Chat(300, 300);
	w1.println('message');
	w1.println('Escape\tsequences\ncan be used!');
	const str = await w1.input('Prompt Message [link] is here.');
	w1.println(str);
	for (const a of Array(20).keys()) {
		await w1.sleep(0.25);
		w1.println('wait:', a);
	}
	const str2 = await w1.input('Prompt very very very long long long message Prompt very very very long long long message Prompt very very very long long long message Prompt very very very long long long message');
	w1.println(str2);
	for (const a of Array(10).keys()) {
		await w1.sleep(0.5);
		w1.println('wait:', a);
	}
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
