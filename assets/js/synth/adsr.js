class ADSR {
    constructor(attackTime, decayTime, sustainValue, releaseTime) {
        this.attackTime = attackTime;
        this.decayTime = decayTime;
        this.sustainValue = sustainValue;
        this.releaseTime = releaseTime;
    }

    modifyBuffer(buffer, timeOffset, startTime, endTime, sampleRate) {
        if (endTime == -1.0)
            endTime = 10000.0;
        else
            endTime -= startTime;

        for (let i = 0; i < buffer.length; i++) {
            let time = (timeOffset - startTime) + i / sampleRate,
                releaseSustainValue = time < this.attackTime ? time / this.attackTime : this.sustainValue;

            if (time < this.attackTime && time < endTime) {
                buffer[i] *= time / this.attackTime;
            }
            else if (time < this.attackTime + this.decayTime && time < endTime) {
                time -= this.attackTime;
                buffer[i] *= 1.0 - (time / this.decayTime) * (1.0 - this.sustainValue);
            }
            else if (time > endTime) {
                time -= endTime;
                if (time < this.releaseTime)
                    buffer[i] *= releaseSustainValue - (time / this.releaseTime) * releaseSustainValue;
                else
                    buffer[i] = 0.0;
            }
            else
                buffer[i] *= this.sustainValue;
        }
    }
}