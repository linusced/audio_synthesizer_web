const attack = new InputKnob(document.querySelector("#adsr-attack"), 10, 0, 500, 5, 0, value => SynthADSR({ attack: value / 1000 })),
    decay = new InputKnob(document.querySelector("#adsr-decay"), 0, 0, 500, 5, 0, value => SynthADSR({ decay: value / 1000 })),
    sustain = new InputKnob(document.querySelector("#adsr-sustain"), 100, 0, 100, 1, 0, value => SynthADSR({ sustain: value / 100 })),
    release = new InputKnob(document.querySelector("#adsr-release"), 10, 0, 500, 5, 0, value => SynthADSR({ release: value / 1000 }));

const lpf = new InputKnob(document.querySelector("#lpf"), 20000, 20, 20000, 1, 0, value => SynthLPF(value), 1 / 0.3),
    hpf = new InputKnob(document.querySelector("#hpf"), 20, 20, 20000, 1, 0, value => SynthHPF(value), 1 / 0.3),
    polyphony = new InputKnob(document.querySelector("#polyphony"), 7, 1, 7, 1, 0, value => SynthPolyphony(value)),
    volume = new InputKnob(document.querySelector("#volume"), 100, 0, 100, 1, 0, value => SynthVolume(value / 100));
