class Harmonic {
    constructor(amplitude = 1.0, phase = 0.0) {
        this.amplitude = amplitude;
        this.phase = phase;
    }
};

class Waveform {
    constructor() {
        this.amplitude = 0.2;
        this.harmonics = [new Harmonic()];
    }

    fillBuffer() {

    }
}