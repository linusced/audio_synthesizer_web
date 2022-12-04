const noteKeys = [{ note: "C", octave: 0, key: "A", code: "KeyA" }, { note: "C#", octave: 0, key: "W", code: "KeyW" }, { note: "D", octave: 0, key: "S", code: "KeyS" }, { note: "D#", octave: 0, key: "E", code: "KeyE" }, { note: "E", octave: 0, key: "D", code: "KeyD" }, { note: "F", octave: 0, key: "F", code: "KeyF" }, { note: "F#", octave: 0, key: "T", code: "KeyT" }, { note: "G", octave: 0, key: "G", code: "KeyG" }, { note: "G#", octave: 0, key: "Y", code: "KeyY" },
{ note: "A", octave: 1, key: "H", code: "KeyH" }, { note: "A#", octave: 1, key: "U", code: "KeyU" }, { note: "B", octave: 1, key: "J", code: "KeyJ" }, { note: "C", octave: 1, key: "K", code: "KeyK" }, { note: "C#", octave: 1, key: "O", code: "KeyO" }, { note: "D", octave: 1, key: "L", code: "KeyL" }, { note: "D#", octave: 1, key: "P", code: "KeyP" }, { note: "E", octave: 1, key: ";", code: "Semicolon" }, { note: "F", octave: 1, key: "'", code: "Quote" }];

const noteKeysDown = [];
var inputElementIsFocused = false;

function inputFocus() {
    inputElementIsFocused = true;
}
function inputBlur() {
    inputElementIsFocused = false;
}

window.addEventListener("keydown", e => {
    if (!inputElementIsFocused && !e.altKey && !e.ctrlKey && !e.metaKey && !noteKeysDown.includes(e.code)) {
        noteKeysDown.push(e.code);

        if (e.code == "KeyZ" || e.code == "KeyX") {
            SynthOctaveChange(e.code == "KeyX");
            document.querySelector("[data-keyboard-shortcut-key=\"" + e.code + "\"]").classList.add("active");
        }
        else
            for (let i = 0; i < noteKeys.length; i++)
                if (e.code == noteKeys[i].code) {
                    SynthNotePress(noteKeys[i].note, noteKeys[i].octave);
                    return;
                }
    }
});

window.addEventListener("keyup", e => {
    if (noteKeysDown.includes(e.code)) {
        noteKeysDown.splice(noteKeysDown.indexOf(e.code), 1);

        if (e.code == "z" || e.code == "x")
            document.querySelector("[data-keyboard-shortcut-key=\"" + e.code + "\"]").classList.remove("active");
        else
            for (let i = 0; i < noteKeys.length; i++)
                if (e.code == noteKeys[i].code) {
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