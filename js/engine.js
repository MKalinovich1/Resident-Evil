// ============================================
// GAME ENGINE — Core systems
// ============================================
const Engine = {
    // ---- CONSTANTS ----
    GRAVITY: 0.5,
    GROUND_Y: 440,
    GAME_W: 960,
    GAME_H: 540,
    TILE: 40,

    // ---- INPUT ----
    keys: {},
    keysPressed: {},
    initInput() {
        document.addEventListener('keydown', e => {
            if (!this.keys[e.code]) this.keysPressed[e.code] = true;
            this.keys[e.code] = true;
        });
        document.addEventListener('keyup', e => {
            this.keys[e.code] = false;
            this.keysPressed[e.code] = false;
        });
    },
    isDown(codes) { return codes.some(c => this.keys[c]); },
    wasPressed(codes) {
        const p = codes.some(c => this.keysPressed[c]);
        if (p) codes.forEach(c => this.keysPressed[c] = false);
        return p;
    },

    // ---- CAMERA ----
    camera: { x: 0, y: 0, targetX: 0, shaking: false },
    updateCamera(playerX) {
        this.camera.targetX = Math.max(0, playerX - this.GAME_W / 3);
        const maxCam = (Game.currentLevel ? Game.currentLevel.width : 3000) - this.GAME_W;
        this.camera.targetX = Math.min(this.camera.targetX, Math.max(0, maxCam));
        this.camera.x += (this.camera.targetX - this.camera.x) * 0.08;
    },
    shakeScreen(duration = 150) {
        const gs = document.getElementById('game-screen');
        gs.classList.add('screen-shake');
        setTimeout(() => gs.classList.remove('screen-shake'), duration);
    },
    flashScreen(duration = 80) {
        const f = document.getElementById('screen-flash');
        f.style.opacity = '0.6';
        setTimeout(() => f.style.opacity = '0', duration);
    },
    setDamageOverlay(intensity) {
        document.getElementById('screen-damage').style.opacity = intensity;
    },

    // ---- COLLISION ----
    rectsOverlap(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    },
    pointInRect(px, py, r) {
        return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
    },
    distBetween(a, b) {
        return Math.hypot((a.x + a.w / 2) - (b.x + b.w / 2), (a.y + a.h / 2) - (b.y + b.h / 2));
    },

    // ---- PARTICLES ----
    particles: [],
    spawnBlood(x, y, count = 5) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x, y, vx: (Math.random() - 0.5) * 6, vy: -Math.random() * 4 - 1,
                life: 30 + Math.random() * 20, maxLife: 50, type: 'blood'
            });
        }
    },
    spawnGlass(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x + Math.random() * 30, y: y + Math.random() * 60,
                vx: (Math.random() - 0.5) * 8, vy: -Math.random() * 5 - 2,
                life: 40 + Math.random() * 20, maxLife: 60, type: 'glass'
            });
        }
    },
    spawnSpark(x, y) {
        for (let i = 0; i < 3; i++) {
            this.particles.push({
                x, y, vx: (Math.random() - 0.5) * 4, vy: -Math.random() * 3,
                life: 10 + Math.random() * 10, maxLife: 20, type: 'spark'
            });
        }
    },
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2; // gravity
            p.life--;
            if (p.life <= 0) this.particles.splice(i, 1);
        }
    },
    renderParticles(world) {
        // Remove old particle elements
        world.querySelectorAll('.particle').forEach(el => el.remove());
        this.particles.forEach(p => {
            const el = document.createElement('div');
            el.className = 'particle';
            el.style.cssText = `position:absolute;left:${p.x - this.camera.x}px;top:${p.y}px;width:4px;height:4px;border-radius:50%;pointer-events:none;opacity:${p.life / p.maxLife};z-index:35;`;
            if (p.type === 'blood') el.style.background = '#8b0000';
            else if (p.type === 'glass') { el.style.background = '#aaccee'; el.style.width = '3px'; el.style.height = '3px'; }
            else if (p.type === 'spark') { el.style.background = '#ff8'; el.style.width = '2px'; el.style.height = '2px'; }
            world.appendChild(el);
        });
    },

    // ---- ECG WAVE ----
    ecgPhase: 0,
    updateECG(healthPercent) {
        this.ecgPhase += 0.05;
        const wave = document.getElementById('ecg-wave');
        if (!wave) return;
        let pts = '';
        for (let i = 0; i < 120; i++) {
            const t = (i / 120) * Math.PI * 4 + this.ecgPhase;
            let y = 15;
            const beat = (t % (Math.PI * 2));
            if (beat > 1.8 && beat < 2.2) y = 5;
            else if (beat > 2.2 && beat < 2.6) y = 25;
            else if (beat > 2.6 && beat < 3.0) y = 10;
            else y = 15 + Math.sin(t * 0.5) * 1;
            // Speed based on health
            pts += `${i},${y} `;
        }
        wave.setAttribute('points', pts.trim());
    },

    // ---- AMBIENT ----
    ambientTimer: 0,
    updateAmbient() {
        this.ambientTimer++;
        if (this.ambientTimer % 300 === 0 && Math.random() > 0.5) {
            AudioEngine.ambientCreak();
        }
        if (this.ambientTimer % 500 === 0 && Math.random() > 0.6) {
            AudioEngine.ambientDrip();
        }
    }
};
