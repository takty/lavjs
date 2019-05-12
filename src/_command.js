// -------------------------------------------------------------------------
// コマンド (TRACER.Tracer)
// -------------------------------------------------------------------------


class Command {

	// （ライブラリ内だけで使用）コマンドを作る（関数）
	constructor(func) {
		this._func = func;
		this._initState = null;
	}

	// （ライブラリ内だけで使用）コマンドを実行する（進める時間）
	run(deltaT) {
		const pc = this._func(deltaT);
		return (pc === undefined) ? 0 : pc;
	}

}