class NoteFreq {
    constructor(id, octaveOffset, frequency) {
        this.id = id;
        this.octaveOffset = octaveOffset;
        this.frequency = frequency;
    }
}

let localData = localStorage.getItem("audio-synthesizer-data");
if (localData)
    localData = JSON.parse(localData);

const synth = localData ? new Synthesizer(localData.attack, localData.decay, localData.sustain, localData.release, localData.lpf, localData.hpf, localData.polyphony, localData.volume) : new Synthesizer();

var guiNoteOctave = 2;
var guiNoteFrequencies = [];
var guiLmbPressNoteFrequency = 0;

GUIOctaveChange(guiNoteOctave);
GUIDrawWaveform();
GUIAudioDataDraw();
GUIMainContentInit();

let localHarmonics = localStorage.getItem("audio-synthesizer-harmonics");
if (localHarmonics) {
    localHarmonics = JSON.parse(localHarmonics);
    GUIHarmonicsInit(localHarmonics);
}

window.addEventListener("beforeunload", () => {
    const data = { attack: synth.adsr.attackTime, decay: synth.adsr.decayTime, sustain: synth.adsr.sustainValue, release: synth.adsr.releaseTime, lpf: synth.lpf.frequency, hpf: synth.hpf.frequency, polyphony: synth.polyphony, volume: synth.volume.gain.value },
        harmonics = [];

    for (let h = 1; h <= numHarmonics; h++) {
        harmonics.push({
            amplitude: harmonicsElement.querySelector("input[data-harmonic-id=\"amplitude-" + (h - 1) + "\"]").value,
            phase: harmonicsElement.querySelector("input[data-harmonic-id=\"phase-" + (h - 1) + "\"]").value
        });
    }

    localStorage.setItem("audio-synthesizer-data", JSON.stringify(data));
    localStorage.setItem("audio-synthesizer-harmonics", JSON.stringify(harmonics));
});

let midi = null;
navigator.requestMIDIAccess().then(midiAccess => {
    midi = midiAccess;

    const arr = [];
    for (const entry of midiAccess.inputs) {
        if (arr.length == 0)
            entry[1].onmidimessage = onMIDIMessage;

        arr.push(entry[1].name);
    }

    GUIMIDIPortsInit(arr);

}, () => GUIMIDIPortsInit([]));

function onMIDIMessage(e) {
    if (e.data.length == 3) {
        const octave = Math.floor(e.data[1] / 12) - 2,
            id = (e.data[1] % 12) + 3,
            freq = frequency(octave, id);

        if (e.data[0] == 144) {
            synth.pressNote(freq);
            GUINotePress([(octave + 2) * 12 + id]);
        }
        else if (e.data[0] == 128) {
            synth.releaseNote(freq);
            GUINoteRelease([(octave + 2) * 12 + id]);
        }
    }
}