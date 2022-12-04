class Harmonic {
    constructor(amplitude, phase) {
        this.amplitude = amplitude;
        this.phase = phase;
    }
};

class Waveform {
    constructor(harmonics, amplitude = 0.2) {
        this.harmonics = harmonics;
        this.amplitude = amplitude;
    }

    fillBuffer(buffer, frequency, timeOffset, sampleRate) {
        buffer.fill(0.0);

        let max = 0.0;

        for (let i = 0; i < buffer.length; i++) {
            const time = timeOffset + i / sampleRate;

            for (let h = 0; h < this.harmonics.length; h++)
                if (this.harmonics[h].amplitude > 0.0)
                    buffer[i] += this.harmonics[h].amplitude * sineWave(frequency * (h + 1), time, this.harmonics[h].phase);

            if (Math.abs(buffer[i]) > max)
                max = Math.abs(buffer[i]);
        }

        const mult = this.amplitude / max;

        for (let i = 0; i < buffer.length; i++)
            buffer[i] *= mult;
    }
}