/**~ja
 * ソース・パッチ
 * @version 2020-12-04
 */
/**~en
 * Source patch
 * @version 2020-12-04
 */
class SourcePatch extends Patch {

	constructor(synth) {
		super(synth);
		this._sw = this._synth.context().createGain();
		this._sw.gain.value = 0;
	}

	play(time = this._synth.now()) {
		cancelAndHoldAtTime(this._sw.gain, time);
		this._sw.gain.setTargetAtTime(0, time, DELAY);
		this._sw.gain.setTargetAtTime(1, time, DELAY);
	}

	stop(time = this._synth.now()) {
		cancelAndHoldAtTime(this._sw.gain, time);
		this._sw.gain.setTargetAtTime(1, time, DELAY);
		this._sw.gain.setTargetAtTime(0, time, DELAY);
	}

	getOutput() {
		return this._sw;
	}

}