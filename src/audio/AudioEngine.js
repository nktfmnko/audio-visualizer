export class AudioEngine {
    constructor() {
        this.ctx = null;
        this.source = null;
        this.bassFilter = null;
        this.midFilter = null;
        this.trebleFilter = null;
    }

    init(audioElement) {
        if (this.ctx) {
            if (this.ctx.statr === 'suspended') this.ctx.resume();
            return;
        }

        this.ctx = new window.AudioContext();

        this.source = this.ctx.createMediaElementSource(audioElement);

        this.bassFilter = this.ctx.createBiquadFilter();
        this.bassFilter.type = 'lowshelf';
        this.bassFilter.frequency.value = 150;

        this.midFilter = this.ctx.createBiquadFilter();
        this.midFilter.type = 'peaking';
        this.midFilter.frequency.value = 1000;
        this.midFilter.Q.value = 1.0;

        this.trebleFilter = this.ctx.createBiquadFilter();
        this.trebleFilter.type = 'highshelf';
        this.trebleFilter.frequency.value = 4000;

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 256;
        this.analyser.smoothingTimeConstant = 0.8;

        this.source
            .connect(this.bassFilter)
            .connect(this.midFilter)
            .connect(this.trebleFilter)
            .connect(this.analyser)
            .connect(this.ctx.destination);
    }

    setEq({bass, mid, treble}) {
        if (!this.bassFilter) return;
        this.bassFilter.gain.value = bass;
        this.midFilter.gain.value = mid;
        this.trebleFilter.gain.value = treble;
    }

    getFrequencyResponse(frequencies) {
        const totalDb = new Float32Array(frequencies.length);
        const filters = [this.bassFilter, this.midFilter, this.trebleFilter];
        const mag = new Float32Array(frequencies.length);
        const phase = new Float32Array(frequencies.length);

        for (const filter of filters) {
            if (!filter) continue;
            filter.getFrequencyResponse(frequencies, mag, phase);
            for (let i = 0; i < frequencies.length; i++) {
                totalDb[i] += 20 * Math.log10(Math.max(mag[i], 1e-6));
            }
        }
        return totalDb;
    }
}