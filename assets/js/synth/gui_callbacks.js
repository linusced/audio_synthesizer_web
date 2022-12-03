function SynthNotePress(noteID, octaveOffset = null) {
    if (octaveOffset != null) {
        const id = midiNoteID(noteID);

        for (const n of guiNoteFrequencies) {
            if (n.id == id && n.octaveOffset == octaveOffset)
                return;
        }

        const octave = guiNoteOctave + octaveOffset, freq = frequency(octave, id);

        synth.pressNote(freq);
        GUINotePress([(octave + 2) * 12 + id]);
        guiNoteFrequencies.push(new NoteFreq(id, octaveOffset, freq));
    }
    else {
        const argID = noteID,
            octave = argID / 12 - 2,
            id = argID % 12;

        if (guiLmbPressNoteFrequency != 0.0)
            synth.releaseNote(guiLmbPressNoteFrequency);

        guiLmbPressNoteFrequency = frequency(octave, id);
        synth.pressNote(guiLmbPressNoteFrequency);
    }
}

function SynthNoteRelease(noteID = null, octaveOffset = null) {
    if (noteID != null && octaveOffset != null) {
        const id = midiNoteID(noteID);

        for (let i = 0; i < guiNoteFrequencies.length; i++) {
            const n = guiNoteFrequencies[i];
            if (n.id == id && n.octaveOffset == octaveOffset) {
                synth.releaseNote(n.frequency);
                GUINoteRelease([(guiNoteOctave + n.octaveOffset + 2) * 12 + n.id]);
                guiNoteFrequencies.splice(i, 1);
                return;
            }
        }
    }
    else {
        synth.releaseNote(guiLmbPressNoteFrequency);
        guiLmbPressNoteFrequency = 0.0;
    }
}

function SynthOctaveChange(bIncrease) {
    let newOctave = guiNoteOctave - 1 + bIncrease * 2;
    if (newOctave < 0)
        newOctave = 0;
    else if (newOctave > 5)
        newOctave = 5;

    if (newOctave != guiNoteOctave) {
        synth.releaseAllNotes();

        const pressIDArray = [], releaseIDArray = [];

        for (const n of guiNoteFrequencies) {
            const octave = newOctave + n.octaveOffset;

            n.frequency = frequency(octave, n.id);
            synth.pressNote(n.frequency);

            pressIDArray.push((octave + 2) * 12 + n.id);
            releaseIDArray.push((guiNoteOctave + n.octaveOffset + 2) * 12 + n.id);
        }

        guiNoteOctave = newOctave;
        GUINotePress(pressIDArray);
        GUINoteRelease(releaseIDArray);
        GUIOctaveChange(guiNoteOctave);
    }
}

function SynthMIDIPortSelect(index) {

}

function SynthADSR(obj) {
    if (obj.hasOwnProperty("attack"))
        synth.adsr.attackTime = obj.attack;
    else if (obj.hasOwnProperty("decay"))
        synth.adsr.attackTime = obj.attack;
    else if (obj.hasOwnProperty("sustain"))
        synth.adsr.sustainValue = obj.sustain;
    else if (obj.hasOwnProperty("release"))
        synth.adsr.releaseTime = obj.release;
}

function SynthLPF(freq) {
    synth.lpf.frequency = freq;

    if (freq == 20000.0)
        synth.lpf.prevValue = 0.0;
}
function SynthHPF(freq) {
    synth.hpf.frequency = freq;

    if (freq == 20.0)
        synth.hpf.prevValue = 0.0;
}
function SynthPolyphony(poly) {
    synth.polyphony = poly;
}
function SynthVolume(vol) {
    if (vol < 0.0)
        vol = 0.0;
    else if (vol > 1.0)
        vol = 1.0;

    synth.volume = vol;
}