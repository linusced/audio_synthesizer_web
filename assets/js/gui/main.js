const noteKeys = [{ note: "C", octave: 0, key: "a" }, { note: "C#", octave: 0, key: "w" }, { note: "D", octave: 0, key: "s" }, { note: "D#", octave: 0, key: "e" }, { note: "E", octave: 0, key: "d" }, { note: "F", octave: 0, key: "f" }, { note: "F#", octave: 0, key: "t" }, { note: "G", octave: 0, key: "g" }, { note: "G#", octave: 0, key: "y" },
{ note: "A", octave: 1, key: "h" }, { note: "A#", octave: 1, key: "u" }, { note: "B", octave: 1, key: "j" }, { note: "C", octave: 1, key: "k" }, { note: "C#", octave: 1, key: "o" }, { note: "D", octave: 1, key: "l" }, { note: "D#", octave: 1, key: "p" }, { note: "E", octave: 1, key: "ö" }, { note: "F", octave: 1, key: "ä" }];

const noteKeysDown = [];
var inputElementIsFocused = false;

function inputFocus() {
    inputElementIsFocused = true;
}
function inputBlur() {
    inputElementIsFocused = false;
}

window.addEventListener("keydown", e => {
    if (!inputElementIsFocused && !e.altKey && !e.ctrlKey && !e.metaKey && !noteKeysDown.includes(e.key)) {
        noteKeysDown.push(e.key);

        if (e.key == "z" || e.key == "x") {
            SynthOctaveChange(e.key == "x");
            document.querySelector("[data-keyboard-shortcut-key=\"" + e.key + "\"]").classList.add("active");
        }
        else
            for (let i = 0; i < noteKeys.length; i++)
                if (e.key == noteKeys[i].key) {
                    SynthNotePress(noteKeys[i].note, noteKeys[i].octave);
                    return;
                }
    }
});

window.addEventListener("keyup", e => {
    if (noteKeysDown.includes(e.key)) {
        noteKeysDown.splice(noteKeysDown.indexOf(e.key), 1);

        if (e.key == "z" || e.key == "x")
            document.querySelector("[data-keyboard-shortcut-key=\"" + e.key + "\"]").classList.remove("active");
        else
            for (let i = 0; i < noteKeys.length; i++)
                if (e.key == noteKeys[i].key) {
                    SynthNoteRelease(noteKeys[i].note, noteKeys[i].octave);
                    return;
                }
    }
});

function GUIMIDIPortsInit(midiportsArray) {
    const div = document.querySelector("#active-midi-port"),
        title = div.querySelector("#active-midi-port-title");

    if (midiportsArray.length == 0) {
        title.textContent = "No MIDI ports found!";
        return;
    }

    title.textContent = "Select MIDI port:";

    for (let i = 0; i < midiportsArray.length; i++)
        div.innerHTML += "<div class=\"active-midi-port-item\"><input type=\"radio\" name=\"active-midi-port\" value=\"" + i + "\" id=\"active-midi-port-" + i + "\"><label for=\"active-midi-port-" + i + "\" title=\"" + midiportsArray[i] + "\">" + midiportsArray[i] + "</label></div>";

    div.querySelector("input").setAttribute("checked", "checked");

    div.querySelectorAll("input[name='active-midi-port']").forEach(input => input.addEventListener("click", e => {
        SynthMIDIPortSelect(parseInt(e.target.value));
    }));
}