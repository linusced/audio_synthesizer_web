class Note {
    constructor(frequency, pressedTime, adsrReleaseTime, velocity) {
        this.frequency = frequency;
        this.pressedTime = pressedTime;
        this.releaseTime = -1.0;
        this.adsrReleaseTime = adsrReleaseTime;
        this.velocity = velocity;
    }

    isActive(time) {
        return (this.releaseTime == -1.0) || (time < this.releaseTime + this.adsrReleaseTime);
    }
}
class CutoffFilter {
    constructor(frequency) {
        this.frequency = frequency;
        this.prevValue = 0.0;
    }
};

class Synthesizer {
    constructor() {
        this.waveform = new Waveform();
        this.adsr = new ADSR();
        this.noteData = [];
        this.longBufferData = [];
        this.noteArr = [];
        this.lpf = new CutoffFilter(20000.0);
        this.hpf = new CutoffFilter(20.0);
        this.time = 0.0;
        this.polyphony = 7;
        this.volume = 1.0;
    }

    pressNote(freq) {

    }
    releaseNote(freq) {

    }
    releaseAllNotes() {

    }
}