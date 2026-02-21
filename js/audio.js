// ============================================
// AUDIO ENGINE — Web Audio API Sound System
// ============================================
const AudioEngine = {
    ctx: null,
    masterGain: null,
    musicGain: null,
    sfxGain: null,
    initialized: false,

    init() {
        if (this.initialized) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.7;
        this.masterGain.connect(this.ctx.destination);
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = 0.3;
        this.musicGain.connect(this.masterGain);
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = 0.6;
        this.sfxGain.connect(this.masterGain);
        this.initialized = true;
    },

    resume() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); },

    // Generate noise buffer
    noiseBuffer(duration = 1) {
        const sr = this.ctx.sampleRate;
        const buf = this.ctx.createBuffer(1, sr * duration, sr);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        return buf;
    },

    // Play a tone
    tone(freq, duration, type = 'sine', gain = 0.3, dest = null) {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = type;
        o.frequency.value = freq;
        g.gain.setValueAtTime(gain, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        o.connect(g);
        g.connect(dest || this.sfxGain);
        o.start();
        o.stop(this.ctx.currentTime + duration);
    },

    // Play noise burst
    noise(duration = 0.1, gain = 0.2, filterFreq = 4000) {
        const src = this.ctx.createBufferSource();
        src.buffer = this.noiseBuffer(duration);
        const g = this.ctx.createGain();
        const f = this.ctx.createBiquadFilter();
        f.type = 'lowpass';
        f.frequency.value = filterFreq;
        g.gain.setValueAtTime(gain, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        src.connect(f);
        f.connect(g);
        g.connect(this.sfxGain);
        src.start();
        src.stop(this.ctx.currentTime + duration);
    },

    // ---- SOUND EFFECTS ----
    pistolShot() {
        this.noise(0.08, 0.5, 3000);
        this.tone(150, 0.05, 'square', 0.4);
        this.tone(80, 0.1, 'sawtooth', 0.2);
    },
    shotgunBlast() {
        this.noise(0.15, 0.7, 2500);
        this.tone(80, 0.12, 'square', 0.5);
        this.tone(40, 0.2, 'sawtooth', 0.3);
        setTimeout(() => this.noise(0.1, 0.15, 1500), 200); // pump
    },
    knifeSlash() {
        this.noise(0.06, 0.15, 6000);
        this.tone(800, 0.05, 'sine', 0.1);
    },
    grenadeExplode() {
        this.noise(0.4, 0.8, 1500);
        this.tone(40, 0.5, 'sawtooth', 0.6);
        this.tone(60, 0.3, 'square', 0.4);
    },
    magnumShot() {
        this.noise(0.12, 0.8, 2000);
        this.tone(60, 0.15, 'square', 0.6);
        this.tone(30, 0.25, 'sawtooth', 0.4);
    },
    rocketLaunch() {
        this.noise(0.5, 0.9, 1000);
        this.tone(30, 0.8, 'sawtooth', 0.7);
    },
    emptyClick() {
        this.tone(600, 0.03, 'square', 0.15);
        this.tone(200, 0.05, 'sine', 0.1);
    },
    itemPickup() {
        this.tone(523, 0.1, 'sine', 0.2);
        setTimeout(() => this.tone(659, 0.1, 'sine', 0.2), 80);
        setTimeout(() => this.tone(784, 0.15, 'sine', 0.25), 160);
    },
    doorOpen() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => this.tone(80 + Math.random() * 40, 0.15, 'sawtooth', 0.05), i * 100);
        }
        this.noise(0.6, 0.05, 800);
    },
    zombieGroan() {
        const t = this.ctx.currentTime;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        const f = this.ctx.createBiquadFilter();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(80 + Math.random() * 30, t);
        o.frequency.linearRampToValueAtTime(60 + Math.random() * 20, t + 0.8);
        f.type = 'lowpass'; f.frequency.value = 600;
        g.gain.setValueAtTime(0.12, t);
        g.gain.linearRampToValueAtTime(0.15, t + 0.3);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
        o.connect(f); f.connect(g); g.connect(this.sfxGain);
        o.start(t); o.stop(t + 0.8);
    },
    dogBark() {
        this.noise(0.08, 0.25, 3500);
        this.tone(300, 0.05, 'square', 0.2);
        this.tone(400, 0.04, 'sawtooth', 0.15);
    },
    dogSnarl() {
        this.noise(0.2, 0.2, 2500);
        this.tone(200, 0.15, 'sawtooth', 0.15);
    },
    hunterChirp() {
        this.tone(1200, 0.05, 'sine', 0.2);
        setTimeout(() => this.tone(1600, 0.08, 'sine', 0.25), 60);
        setTimeout(() => this.tone(1400, 0.06, 'sine', 0.15), 140);
    },
    glassCrash() {
        this.noise(0.2, 0.6, 8000);
        this.noise(0.15, 0.3, 6000);
        for (let i = 0; i < 4; i++) {
            setTimeout(() => this.tone(2000 + Math.random() * 3000, 0.03, 'sine', 0.1), i * 30);
        }
    },
    footstepWood() {
        this.noise(0.04, 0.08, 2000);
        this.tone(150, 0.03, 'sine', 0.05);
    },
    footstepStone() {
        this.noise(0.03, 0.06, 4000);
    },
    hit() {
        this.noise(0.06, 0.3, 2000);
        this.tone(100, 0.08, 'square', 0.2);
    },
    playerHurt() {
        this.noise(0.1, 0.3, 2500);
        this.tone(200, 0.15, 'sawtooth', 0.15);
    },
    typewriter() {
        this.tone(800 + Math.random() * 400, 0.02, 'square', 0.08);
        this.noise(0.015, 0.06, 6000);
    },
    stinger() {
        this.tone(120, 0.4, 'sawtooth', 0.5);
        this.tone(80, 0.6, 'square', 0.3);
        this.noise(0.3, 0.4, 1500);
    },
    crowCaw() {
        this.tone(900, 0.08, 'sawtooth', 0.1);
        setTimeout(() => this.tone(1100, 0.06, 'sawtooth', 0.08), 100);
    },
    ceilingTrap() {
        this.noise(0.8, 0.3, 800);
        this.tone(40, 1.0, 'sawtooth', 0.2);
    },
    saveRoom: null,
    _safeRoomNodes: null,

    playSafeRoomMusic() {
        if (this._safeRoomNodes) return;
        const t = this.ctx.currentTime;
        const notes = [262, 330, 392, 330, 262, 294, 349, 294];
        const playSequence = (startTime) => {
            notes.forEach((freq, i) => {
                const o = this.ctx.createOscillator();
                const g = this.ctx.createGain();
                o.type = 'sine';
                o.frequency.value = freq;
                g.gain.setValueAtTime(0, startTime + i * 0.8);
                g.gain.linearRampToValueAtTime(0.08, startTime + i * 0.8 + 0.1);
                g.gain.linearRampToValueAtTime(0.06, startTime + i * 0.8 + 0.6);
                g.gain.linearRampToValueAtTime(0, startTime + i * 0.8 + 0.8);
                o.connect(g); g.connect(this.musicGain);
                o.start(startTime + i * 0.8);
                o.stop(startTime + i * 0.8 + 0.8);
            });
        };
        this._safeRoomNodes = { interval: setInterval(() => playSequence(this.ctx.currentTime), notes.length * 800) };
        playSequence(t);
    },

    stopSafeRoomMusic() {
        if (this._safeRoomNodes) {
            clearInterval(this._safeRoomNodes.interval);
            this._safeRoomNodes = null;
        }
    },

    ambientDrip() {
        this.tone(2000 + Math.random() * 1000, 0.08, 'sine', 0.03);
    },
    ambientCreak() {
        const t = this.ctx.currentTime;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(60, t);
        o.frequency.linearRampToValueAtTime(80, t + 0.5);
        g.gain.setValueAtTime(0.02, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        o.connect(g); g.connect(this.sfxGain);
        o.start(t); o.stop(t + 0.5);
    }
};
