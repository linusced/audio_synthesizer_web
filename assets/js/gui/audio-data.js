const audioDataCanvas = document.querySelector("#audio-data"), audioDataCtx = audioDataCanvas.getContext("2d");
let bufferSize;

function GUIAudioDataDraw() {
    bufferSize = synth.longBufferData.length;
    console.log("bufferSize " + bufferSize);
    requestAnimationFrame(() => audioDataDraw());
}

function audioDataDraw() {
    audioDataCtx.clearRect(0, 0, audioDataCanvas.width, audioDataCanvas.height);
    audioDataCtx.fillStyle = "#fff";

    const step = bufferSize / audioDataCanvas.width;
    let x, y, min, max, value;

    for (x = 0; x < audioDataCanvas.width; x++) {
        min = 1;
        max = -1;

        for (y = 0; y < step; y++) {
            value = synth.longBufferData[x * step + y];
            if (value < min)
                min = value;
            if (value > max)
                max = value;
        }

        audioDataCtx.fillRect(x, (1 + min) * (audioDataCanvas.height / 2), 1, Math.max((max - min) * (audioDataCanvas.height / 2), 1));
    }

    requestAnimationFrame(() => audioDataDraw());
}