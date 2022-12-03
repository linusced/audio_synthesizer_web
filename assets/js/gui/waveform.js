const waveformCanvas = document.querySelector("#waveform"), waveformCtx = waveformCanvas.getContext("2d");

function GUIDrawWaveform() {
    let data = [];
    let max = 0;

    for (let x = 0; x < waveformCanvas.width; x++) {
        let time = (x / (waveformCanvas.width - 1));

        data.push(0);
        for (let h = 0; h < synth.waveform.harmonics.length; h++)
            data[x] += synth.waveform.harmonics[h].amplitude * Math.sin(2 * Math.PI * (h + 1) * time + synth.waveform.harmonics[h].phase);

        if (Math.abs(data[x]) > max)
            max = Math.abs(data[x]);
    }
    if (max == 0)
        max = 1;

    const mult = (1 / max) * ((waveformCanvas.height - 1) / 2);
    let hasBegun = false;

    waveformCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);

    waveformCtx.strokeStyle = "#fff";
    waveformCtx.lineWidth = 1;

    waveformCtx.beginPath();

    for (let x = 0; x < waveformCanvas.width; x++) {
        let y = data[x] * mult + (waveformCanvas.height / 2);

        if (hasBegun)
            waveformCtx.lineTo(x, y);
        else {
            waveformCtx.moveTo(x, y);
            hasBegun = true;
        }
    }

    waveformCtx.stroke();
}