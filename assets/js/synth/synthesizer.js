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

    apply(buffer, sampleRate, bIsLowPass) {
        const _tan = Math.tan(Math.PI * this.frequency / sampleRate),
            a1 = (_tan - 1.0) / (_tan + 1.0);

        let out, dn1 = this.prevValue;

        for (let i = 0; i < buffer.length; i++) {
            out = a1 * buffer[i] + dn1;
            dn1 = buffer[i] - a1 * out;

            if (bIsLowPass)
                buffer[i] = (buffer[i] + out) / 2.0;
            else
                buffer[i] = (buffer[i] + out * -1.0) / 2.0;
        }

        this.prevValue = dn1;
    }
};

class Synthesizer {
    constructor(attack = 0.01, decay = 0.0, sustain = 1.0, release = 0.01, lpf = 20000.0, hpf = 20.0, polyphony = 7, volume = 1.0) {
        this.NUM_BUFFERS = 2;
        this.BUFFER_SIZE = 1024;
        this.SAMPLE_RATE = 44100;
        this.BUFFER_SIZE_SECONDS = this.BUFFER_SIZE / this.SAMPLE_RATE;

        this.noteData = new Float32Array(this.BUFFER_SIZE).fill(0);
        this.longBufferData = new Float32Array(this.BUFFER_SIZE * 4).fill(0);

        this.noteArr = [];
        this.lpf = new CutoffFilter(lpf);
        this.hpf = new CutoffFilter(hpf);
        this.time = 0.0;
        this.polyphony = polyphony;

        this.waveform = new Waveform([new Harmonic(1.0, 0.0)]);
        this.adsr = new ADSR(attack, decay, sustain, release);

        this.ctx = new AudioContext();
        this.volume = this.ctx.createGain();
        this.volume.gain.value = volume;
        this.volume.connect(this.ctx.destination);

        this.audioBuffers = [];
        this.bufferDataArr = [];
        this.bufferIndex = 0;

        for (let i = 0; i < this.NUM_BUFFERS; i++) {
            this.audioBuffers.push(this.ctx.createBuffer(1, this.BUFFER_SIZE, this.SAMPLE_RATE));
            this.bufferDataArr.push(this.audioBuffers[i].getChannelData(0));
        }

        document.querySelector("#start-btn").addEventListener("click", () => {
            document.querySelector("#start-btn-container").style.display = "none";
            this.ctx.resume();
            this.play();
        });
    }

    play() {
        const src = this.ctx.createBufferSource();
        src.buffer = this.audioBuffers[this.bufferIndex];
        src.connect(this.volume);
        src.onended = () => this.play();
        src.start();
        this.updateBufferData();
    }

    pressNote(freq, velocity = 1.0) {
        let minPressedTime = this.time,
            activeNotes = 0;

        for (const n of this.noteArr)
            if (n.releaseTime == -1.0) {
                if (n.frequency == freq) {
                    n.releaseTime = this.time;
                    activeNotes = 0;
                    break;
                }
                else if (this.polyphony == 1)
                    n.releaseTime = this.time;

                activeNotes++;
                if (n.pressedTime < minPressedTime)
                    minPressedTime = n.pressedTime;
            }

        if (activeNotes >= this.polyphony)
            for (const n of this.noteArr)
                if (activeNotes >= this.polyphony && n.pressedTime == minPressedTime) {
                    n.releaseTime = this.time;
                    activeNotes--;
                }

        this.noteArr.push(new Note(freq, this.time, this.adsr.releaseTime, velocity));
    }

    releaseNote(freq) {
        for (const n of this.noteArr)
            if (n.frequency == freq && n.releaseTime == -1.0) {
                n.releaseTime = this.time;
                return;
            }
    }
    releaseAllNotes() {
        for (const n of this.noteArr)
            if (n.releaseTime == -1.0)
                n.releaseTime = this.time;
    }

    updateBufferData() {
        for (let i = 0; i < this.longBufferData.length - this.BUFFER_SIZE; i++)
            this.longBufferData[i] = this.longBufferData[this.BUFFER_SIZE + i];

        for (let i = 0; i < this.BUFFER_SIZE; i++)
            this.longBufferData[this.longBufferData.length - this.BUFFER_SIZE + i] = this.bufferDataArr[this.bufferIndex][i];

        this.bufferIndex = (this.bufferIndex + 1) % this.NUM_BUFFERS;
        this.bufferDataArr[this.bufferIndex].fill(0);

        for (let i = this.noteArr.length - 1; i >= 0; i--) {
            this.waveform.fillBuffer(this.noteData, this.noteArr[i].frequency, this.time, this.SAMPLE_RATE);
            this.adsr.modifyBuffer(this.noteData, this.time, this.noteArr[i].pressedTime, this.noteArr[i].releaseTime, this.SAMPLE_RATE);

            for (let j = 0; j < this.BUFFER_SIZE; j++)
                this.bufferDataArr[this.bufferIndex][j] += this.noteData[j] * this.noteArr[i].velocity;

            if (!this.noteArr[i].isActive(this.time))
                this.noteArr.splice(i, 1);
        }

        if (this.lpf.frequency != 20000.0)
            this.lpf.apply(this.bufferDataArr[this.bufferIndex], this.SAMPLE_RATE, true);

        if (this.hpf.frequency != 20.0)
            this.hpf.apply(this.bufferDataArr[this.bufferIndex], this.SAMPLE_RATE, false);

        this.time += this.BUFFER_SIZE_SECONDS;
    }
}