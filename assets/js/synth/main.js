class NoteFreq {
    constructor(id, octaveOffset, frequency) {
        this.id = id;
        this.octaveOffset = octaveOffset;
        this.frequency = frequency;
    }
}

const synth = new Synthesizer();

var guiNoteOctave = 2;
var guiNoteFrequencies = [];
var guiLmbPressNoteFrequency = 0;

GUIOctaveChange(guiNoteOctave);
GUIDrawWaveform();
//GUIAudioDataDraw();