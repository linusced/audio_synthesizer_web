let attack, decay, sustain, release, lpf, hpf, polyphony, volume;

function GUIMainContentInit() {
    attack = new InputKnob(document.querySelector("#adsr-attack"), synth.adsr.attackTime * 1000, 0, 500, 5, 0, value => SynthADSR({ attack: value / 1000 }));
    decay = new InputKnob(document.querySelector("#adsr-decay"), synth.adsr.decayTime * 1000, 0, 500, 5, 0, value => SynthADSR({ decay: value / 1000 }));
    sustain = new InputKnob(document.querySelector("#adsr-sustain"), synth.adsr.sustainValue * 100, 0, 100, 1, 0, value => SynthADSR({ sustain: value / 100 }));
    release = new InputKnob(document.querySelector("#adsr-release"), synth.adsr.releaseTime * 1000, 0, 500, 5, 0, value => SynthADSR({ release: value / 1000 }));

    lpf = new InputKnob(document.querySelector("#lpf"), synth.lpf.frequency, 20, 20000, 1, 0, value => SynthLPF(value), 1 / 0.3);
    hpf = new InputKnob(document.querySelector("#hpf"), synth.hpf.frequency, 20, 20000, 1, 0, value => SynthHPF(value), 1 / 0.3);
    polyphony = new InputKnob(document.querySelector("#polyphony"), synth.polyphony, 1, 7, 1, 0, value => SynthPolyphony(value));
    volume = new InputKnob(document.querySelector("#volume"), synth.volume.gain.value * 100, 0, 100, 1, 0, value => SynthVolume(value / 100));
}