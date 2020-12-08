/**~ja
 * エンベロープ・パッチ
 * @extends {Patch}
 * @version 2020-12-08
 */
/**~en
 * Envelope patch
 * @extends {Patch}
 * @version 2020-12-08
 */
class EnvelopePatch extends Patch {

	/**~ja
	 * エンベロープ・パッチを作る
	 * @param {Synth} synth シンセ
	 * @param {object} params パラメーター
	 */
	/**~en
	 * Make an envelope patch
	 * @param {Synth} synth Synth
	 * @param {object} params Parameters
	 */
	constructor(synth, params) {
		super(synth);

		this._g = this._synth.context().createGain();
		this._g.gain.value = 0;

		this._attack  = params.attack  ?? 0.02;
		this._decay   = params.decay   ?? 0.4;
		this._sustain = params.sustain ?? 0.05;
		this._release = params.release ?? 0.8;
	}

	/**~ja
	 * 入力（オーディオ・ノード）
	 * @return {AudioNode} オーディオ・ノード
	 */
	/**~en
	 * Input (audio node)
	 * @return {AudioNode} Audio node
	 */
	getInput() {
		return this._g;
	}

	/**~ja
	 * 出力（オーディオ・ノード）
	 * @return {AudioNode} オーディオ・ノード
	 */
	/**~en
	 * Output (audio node)
	 * @return {AudioNode} Audio node
	 */
	getOutput() {
		return this._g;
	}


	// -------------------------------------------------------------------------


	/**~ja
	 * 音を鳴らす
	 * @param {number=} time 時刻
	 */
	/**~en
	 * Play a note (note on)
	 * @param {number=} time Time
	 */
	on(time = this._synth.now()) {
		// Reset to 0;
		this._g.gain.setTargetAtTime(0, time, DELAY);

		// 0 -> Attack
		this._g.gain.linearRampToValueAtTime(1, time + this._attack);
		// Decay -> Sustain
		this._g.gain.setTargetAtTime(this._sustain, time + this._attack, this._decay);
		return this;
	}

	/**~ja
	 * 音を止める
	 * @param {number=} time 時刻
	 */
	/**~en
	 * Stop a note (note off)
	 * @param {number=} time Time
	 */
	off(time = this._synth.now()) {
		this._g.gain.cancelScheduledValues(time);
		// Release -> 0
		this._g.gain.setTargetAtTime(0, time, this._release);
		return this;
	}

}

assignAlias(EnvelopePatch);