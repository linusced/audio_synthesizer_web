const midiKeyboard = document.querySelector("#midi-keyboard");
const whiteKeys = 7 * 6 + 4, blackKeys = whiteKeys - 1,
    whiteBtnWidth = (1 / whiteKeys * 100) + "%", blackBtnWidth = (1 / whiteKeys * 80) + "%",
    startID = 27;

for (let i = 0, id = startID; i < whiteKeys; i++) {
    const btn = document.createElement("button");
    midiKeyboard.appendChild(btn);
    btn.onmousedown = midiKeyLmbDown;

    btn.setAttribute("data-midi-key-id", id);
    btn.className = "midi-keyboard-key midi-keyboard-white-key";
    btn.style.left = (i / whiteKeys * 100) + "%";
    btn.style.width = whiteBtnWidth;

    if (i % 7 == 6 || i % 7 == 2)
        id++;
    else
        id += 2;
}

for (let i = 0, id = startID + 1; i < blackKeys; i++) {
    if (i % 7 == 6 || i % 7 == 2) {
        id++;
        continue;
    }

    const btn = document.createElement("button");
    midiKeyboard.appendChild(btn);
    btn.onmousedown = midiKeyLmbDown;

    btn.setAttribute("data-midi-key-id", id);
    btn.className = "midi-keyboard-key midi-keyboard-black-key";
    btn.style.left = ((i / whiteKeys + 0.7 / whiteKeys) * 100) + "%";
    btn.style.width = blackBtnWidth;

    id += 2;
}

let keyLmbDown = false;
function midiKeyLmbDown(e) {
    keyLmbDown = true;
    SynthNotePress(parseInt(e.target.getAttribute("data-midi-key-id")));
}
window.addEventListener("mouseup", () => {
    if (keyLmbDown) {
        keyLmbDown = false;
        SynthNoteRelease();
    }
});

function GUINotePress(idArray) {
    idArray.forEach(id => {
        const elem = midiKeyboard.querySelector("[data-midi-key-id=\"" + id + "\"]");
        if (elem)
            elem.classList.add("active");
    });
}
function GUINoteRelease(idArray) {
    idArray.forEach(id => {
        const elem = midiKeyboard.querySelector("[data-midi-key-id=\"" + id + "\"]");
        if (elem)
            elem.classList.remove("active");
    });
}

function GUIOctaveChange(octave) {
    midiKeyboard.querySelectorAll(".midi-keyboard-key").forEach(btn => btn.innerHTML = "");

    for (let i = 0; i < noteKeys.length; i++) {
        midiKeyboard.querySelector("[data-midi-key-id=\"" + (octave * 12 + startID + i) + "\"]").innerHTML = noteKeys[i].key;
    }
}