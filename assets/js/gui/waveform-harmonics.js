const harmonicsElement = document.querySelector("#waveform-harmonics");
const numHarmonics = 50;

for (let i = 0; i < numHarmonics; i++) {
    const elem = document.createElement("div");
    elem.className = "row";
    elem.innerHTML = "<h2>" + (i + 1) + "</h2><input type=\"text\" data-harmonic-id=\"amplitude-" + i + "\" value=\"0\"><input type=\"text\" data-harmonic-id=\"phase-" + i + "\" value=\"0\">";
    harmonicsElement.appendChild(elem);

    elem.querySelectorAll("input").forEach(input => {
        input.addEventListener("change", harmonicsChange);
        input.addEventListener("focus", inputFocus);
        input.addEventListener("blur", inputBlur);
    });
}

harmonicsElement.querySelector("input[data-harmonic-id=\"amplitude-0\"").value = "1";

const expressionRegex = /^([0-9,.\-+*/\s\)]|pi|h|pow\()+$/;
function isEvalSafe(expression) {
    return expression && expressionRegex.test(expression);
}

function harmonicsChange(e) {
    if (e)
        e.target.blur();

    synth.waveform.harmonics = [];

    const pi = Math.PI, pow = Math.pow; // for eval

    for (let h = 1; h <= numHarmonics; h++) {
        const amplitudeExpression = harmonicsElement.querySelector("input[data-harmonic-id=\"amplitude-" + (h - 1) + "\"]").value;
        let amplitude = 0;
        if (isEvalSafe(amplitudeExpression))
            amplitude = eval(amplitudeExpression);

        const phaseExpression = harmonicsElement.querySelector("input[data-harmonic-id=\"phase-" + (h - 1) + "\"]").value;
        let phase = 0;
        if (isEvalSafe(phaseExpression))
            phase = eval(phaseExpression);

        synth.waveform.harmonics.push(new Harmonic(amplitude, phase));
    }

    let firstDeleteIndex = numHarmonics;
    for (let i = numHarmonics - 1; i >= 0; i--)
        if (synth.waveform.harmonics[i].amplitude == 0)
            firstDeleteIndex = i;
        else
            break;

    if (firstDeleteIndex != numHarmonics)
        synth.waveform.harmonics.splice(firstDeleteIndex, numHarmonics - firstDeleteIndex);

    GUIDrawWaveform();
}

document.querySelectorAll("[data-harmonics-preset]").forEach(btn => btn.addEventListener("click", () => {
    harmonicsElement.querySelector("input[data-harmonic-id=\"amplitude-0\"]").value = "1";
    harmonicsElement.querySelector("input[data-harmonic-id=\"phase-0\"]").value = "0";

    switch (btn.getAttribute("data-harmonics-preset")) {
        case "sine":
            for (let h = 2; h <= numHarmonics; h++) {
                harmonicsElement.querySelector("input[data-harmonic-id=\"amplitude-" + (h - 1) + "\"]").value = "0";
                harmonicsElement.querySelector("input[data-harmonic-id=\"phase-" + (h - 1) + "\"]").value = "0";
            }
            break;
        case "saw":
            for (let h = 2; h <= numHarmonics; h++) {
                harmonicsElement.querySelector("input[data-harmonic-id=\"amplitude-" + (h - 1) + "\"]").value = "1 / h";
                harmonicsElement.querySelector("input[data-harmonic-id=\"phase-" + (h - 1) + "\"]").value = "0";
            }
            break;
        case "square":
            for (let h = 2; h <= numHarmonics; h++) {
                harmonicsElement.querySelector("input[data-harmonic-id=\"amplitude-" + (h - 1) + "\"]").value = h % 2 == 1 ? "1 / h" : "0";
                harmonicsElement.querySelector("input[data-harmonic-id=\"phase-" + (h - 1) + "\"]").value = "0";
            }
            break;
        case "triangle":
            for (let h = 2; h <= numHarmonics; h++) {
                harmonicsElement.querySelector("input[data-harmonic-id=\"amplitude-" + (h - 1) + "\"]").value = h % 2 == 1 ? "1 / pow(h, 2)" : "0";
                harmonicsElement.querySelector("input[data-harmonic-id=\"phase-" + (h - 1) + "\"]").value = h % 4 == 3 ? "pi" : "0";
            }
            break;
    }
    harmonicsChange();
}));

function GUIHarmonicsInit(harmonicExpressions) {
    for (let h = 1; h <= numHarmonics; h++) {
        harmonicsElement.querySelector("input[data-harmonic-id=\"amplitude-" + (h - 1) + "\"]").value = harmonicExpressions[h - 1].amplitude;
        harmonicsElement.querySelector("input[data-harmonic-id=\"phase-" + (h - 1) + "\"]").value = harmonicExpressions[h - 1].phase;
    }
    harmonicsChange();
}