function angularVelocity(frequency) {
    return Math.PI * 2.0 * frequency;
}

function sineWave(frequency, time, phase) {
    return Math.sin(angularVelocity(frequency) * time + phase);
}

function frequency(octave, midiNoteID) {
    const _1 = 27.5, _2 = 1.0594630943592953;
    return (_1 * Math.pow(2.0, octave)) * Math.pow(_2, midiNoteID);
}

function midiNoteID(noteIDStr) {
    const isSharp = noteIDStr[noteIDStr.length - 1] == '#';

    switch (noteIDStr.toUpperCase()[0]) {
        case 'A':
            return isSharp;
        case 'B':
            return 2;
        case 'C':
            return 3 + isSharp;
        case 'D':
            return 5 + isSharp;
        case 'E':
            return 7;
        case 'F':
            return 8 + isSharp;
        case 'G':
            return 10 + isSharp;
    }
}