// ============================================
// SVG SPRITES — All game characters & objects
// ============================================
const Sprites = {
    // Create SVG element helper
    svg(w, h, content, cls = '') {
        const el = document.createElement('div');
        el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" class="${cls}">${content}</svg>`;
        return el.firstChild;
    },

    // ---- JILL VALENTINE ----
    jill(state = 'idle', facingRight = true) {
        const flip = facingRight ? '' : 'transform="scale(-1,1) translate(-40,0)"';
        const states = {
            idle: `<g ${flip}>
                <rect x="16" y="2" width="8" height="9" rx="3" fill="#e8c99a"/>
                <path d="M14 5 Q15 0 20 1 Q25 0 26 5 L25 7 14 7Z" fill="#5a3520"/>
                <circle cx="22" cy="5" r="1" fill="#2a2a4a"/>
                <rect x="14" y="11" width="12" height="14" rx="2" fill="#3a5a8a"/>
                <rect x="14" y="11" width="12" height="3" fill="#4a6a9a"/>
                <rect x="12" y="13" width="3" height="8" rx="1" fill="#3a5a8a"/>
                <rect x="25" y="13" width="3" height="8" rx="1" fill="#3a5a8a"/>
                <rect x="14" y="25" width="5" height="10" rx="1" fill="#2a2a3a"/>
                <rect x="21" y="25" width="5" height="10" rx="1" fill="#2a2a3a"/>
                <rect x="13" y="34" width="6" height="3" rx="1" fill="#3a2a1a"/>
                <rect x="21" y="34" width="6" height="3" rx="1" fill="#3a2a1a"/>
                <rect x="15" y="0" width="10" height="3" rx="1" fill="#4a6a9a"/>
            </g>`,
            walk: `<g ${flip}>
                <rect x="16" y="2" width="8" height="9" rx="3" fill="#e8c99a"/>
                <path d="M14 5 Q15 0 20 1 Q25 0 26 5 L25 7 14 7Z" fill="#5a3520"/>
                <circle cx="22" cy="5" r="1" fill="#2a2a4a"/>
                <rect x="14" y="11" width="12" height="14" rx="2" fill="#3a5a8a"/>
                <rect x="12" y="13" width="3" height="8" rx="1" fill="#3a5a8a"/>
                <rect x="25" y="13" width="3" height="8" rx="1" fill="#3a5a8a"/>
                <rect x="12" y="25" width="5" height="10" rx="1" fill="#2a2a3a" transform="rotate(-15,14,25)"/>
                <rect x="23" y="25" width="5" height="10" rx="1" fill="#2a2a3a" transform="rotate(15,25,25)"/>
                <rect x="11" y="34" width="6" height="3" rx="1" fill="#3a2a1a"/>
                <rect x="23" y="34" width="6" height="3" rx="1" fill="#3a2a1a"/>
                <rect x="15" y="0" width="10" height="3" rx="1" fill="#4a6a9a"/>
            </g>`,
            aim: `<g ${flip}>
                <rect x="16" y="2" width="8" height="9" rx="3" fill="#e8c99a"/>
                <path d="M14 5 Q15 0 20 1 Q25 0 26 5 L25 7 14 7Z" fill="#5a3520"/>
                <circle cx="22" cy="5" r="1" fill="#2a2a4a"/>
                <rect x="14" y="11" width="12" height="14" rx="2" fill="#3a5a8a"/>
                <rect x="25" y="12" width="14" height="3" rx="1" fill="#3a5a8a"/>
                <rect x="37" y="11" width="8" height="3" rx="1" fill="#444"/>
                <rect x="12" y="16" width="3" height="6" rx="1" fill="#3a5a8a"/>
                <rect x="14" y="25" width="5" height="10" rx="1" fill="#2a2a3a"/>
                <rect x="21" y="25" width="5" height="10" rx="1" fill="#2a2a3a"/>
                <rect x="13" y="34" width="6" height="3" rx="1" fill="#3a2a1a"/>
                <rect x="21" y="34" width="6" height="3" rx="1" fill="#3a2a1a"/>
                <rect x="15" y="0" width="10" height="3" rx="1" fill="#4a6a9a"/>
            </g>`,
            hurt: `<g ${flip}>
                <rect x="16" y="4" width="8" height="9" rx="3" fill="#e8c99a"/>
                <path d="M14 7 Q15 2 20 3 Q25 2 26 7 L25 9 14 9Z" fill="#5a3520"/>
                <rect x="14" y="13" width="12" height="14" rx="2" fill="#3a5a8a"/>
                <rect x="10" y="16" width="4" height="6" rx="1" fill="#3a5a8a"/>
                <rect x="26" y="16" width="4" height="6" rx="1" fill="#3a5a8a"/>
                <rect x="14" y="27" width="5" height="10" rx="1" fill="#2a2a3a"/>
                <rect x="21" y="27" width="5" height="10" rx="1" fill="#2a2a3a"/>
                <circle cx="18" cy="18" r="2" fill="#8b0000" opacity="0.6"/>
            </g>`,
            crouch: `<g ${flip}>
                <rect x="16" y="12" width="8" height="9" rx="3" fill="#e8c99a"/>
                <path d="M14 15 Q15 10 20 11 Q25 10 26 15 L25 17 14 17Z" fill="#5a3520"/>
                <circle cx="22" cy="15" r="1" fill="#2a2a4a"/>
                <rect x="14" y="21" width="12" height="10" rx="2" fill="#3a5a8a"/>
                <rect x="25" y="22" width="10" height="3" rx="1" fill="#3a5a8a"/>
                <rect x="12" y="24" width="3" height="5" rx="1" fill="#3a5a8a"/>
                <rect x="12" y="30" width="8" height="4" rx="1" fill="#2a2a3a"/>
                <rect x="22" y="30" width="8" height="4" rx="1" fill="#2a2a3a"/>
                <rect x="11" y="33" width="8" height="3" rx="1" fill="#3a2a1a"/>
                <rect x="21" y="33" width="8" height="3" rx="1" fill="#3a2a1a"/>
            </g>`
        };
        return this.svg(50, 40, states[state] || states.idle);
    },

    // ---- ZOMBIE ----
    zombie(variant = 0) {
        const colors = ['#6a6a5a', '#5a5a4a', '#7a6a5a'];
        const shirt = colors[variant % 3];
        return this.svg(40, 40, `
            <g>
                <rect x="14" y="2" width="10" height="10" rx="3" fill="#8a9a7a"/>
                <circle cx="19" cy="6" r="1.5" fill="#ddd" opacity="0.8"/>
                <circle cx="23" cy="7" r="1" fill="#ddd" opacity="0.6"/>
                <line x1="17" y1="10" x2="19" y2="12" stroke="#700" stroke-width="0.8"/>
                <rect x="12" y="12" width="14" height="14" rx="2" fill="${shirt}"/>
                <rect x="8" y="14" width="5" height="10" rx="1" fill="${shirt}" transform="rotate(-20,10,14)"/>
                <rect x="25" y="14" width="5" height="10" rx="1" fill="${shirt}" transform="rotate(10,27,14)"/>
                <rect x="8" y="22" width="4" height="3" rx="1" fill="#8a9a7a"/>
                <rect x="27" y="22" width="4" height="3" rx="1" fill="#8a9a7a"/>
                <rect x="13" y="26" width="5" height="11" rx="1" fill="#4a4a3a"/>
                <rect x="20" y="26" width="5" height="11" rx="1" fill="#4a4a3a"/>
                <rect x="12" y="36" width="6" height="3" rx="1" fill="#3a2a1a"/>
                <rect x="20" y="36" width="6" height="3" rx="1" fill="#3a2a1a"/>
                <circle cx="16" cy="18" r="2" fill="#700" opacity="0.4"/>
            </g>
        `);
    },

    // ---- CERBERUS (Zombie Dog) ----
    cerberus() {
        return this.svg(50, 30, `
            <g>
                <ellipse cx="25" cy="15" rx="14" ry="7" fill="#6a3030"/>
                <rect x="8" y="14" width="8" height="5" rx="2" fill="#7a3535"/>
                <polygon points="6,12 10,10 10,16" fill="#5a2a2a"/>
                <circle cx="8" cy="13" r="1" fill="#ff4444"/>
                <rect x="4" y="15" width="4" height="2" rx="1" fill="#5a2a2a"/>
                <line x1="4" y1="16" x2="2" y2="15" stroke="#ddd" stroke-width="0.5"/>
                <line x1="4" y1="16.5" x2="2" y2="16.5" stroke="#ddd" stroke-width="0.5"/>
                <rect x="14" y="20" width="3" height="8" rx="1" fill="#5a2828"/>
                <rect x="20" y="20" width="3" height="8" rx="1" fill="#5a2828"/>
                <rect x="28" y="20" width="3" height="8" rx="1" fill="#5a2828"/>
                <rect x="34" y="20" width="3" height="8" rx="1" fill="#5a2828"/>
                <path d="M37 12 Q42 10 44 14 Q42 16 38 15Z" fill="#5a2828"/>
                <line x1="38" y1="10" x2="38" y2="8" stroke="#5a2828" stroke-width="1.5"/>
                <line x1="40" y1="10" x2="41" y2="7" stroke="#5a2828" stroke-width="1.5"/>
                <circle cx="14" cy="18" r="1.5" fill="#700" opacity="0.5"/>
                <circle cx="30" cy="14" r="1" fill="#700" opacity="0.3"/>
            </g>
        `);
    },

    // ---- HUNTER ----
    hunter() {
        return this.svg(44, 44, `
            <g>
                <rect x="14" y="2" width="14" height="10" rx="4" fill="#4a6a3a"/>
                <ellipse cx="21" cy="9" rx="6" ry="2" fill="#3a5a2a"/>
                <circle cx="18" cy="5" r="1" fill="#ff0"/>
                <circle cx="24" cy="5" r="1" fill="#ff0"/>
                <rect x="12" y="12" width="18" height="16" rx="3" fill="#4a6a3a"/>
                <rect x="10" y="12" width="4" height="3" fill="#5a7a4a"/>
                <rect x="4" y="14" width="8" height="4" rx="1" fill="#4a6a3a"/>
                <rect x="0" y="12" width="6" height="6" rx="1" fill="#6a8a4a"/>
                <line x1="0" y1="12" x2="-3" y2="10" stroke="#8a4" stroke-width="1.5"/>
                <line x1="2" y1="12" x2="0" y2="9" stroke="#8a4" stroke-width="1.5"/>
                <line x1="4" y1="12" x2="3" y2="9" stroke="#8a4" stroke-width="1.5"/>
                <rect x="28" y="14" width="8" height="4" rx="1" fill="#4a6a3a"/>
                <rect x="34" y="12" width="6" height="6" rx="1" fill="#6a8a4a"/>
                <rect x="14" y="28" width="6" height="12" rx="1" fill="#3a5a2a"/>
                <rect x="22" y="28" width="6" height="12" rx="1" fill="#3a5a2a"/>
                <rect x="12" y="38" width="8" height="4" rx="1" fill="#3a5a2a"/>
                <rect x="22" y="38" width="8" height="4" rx="1" fill="#3a5a2a"/>
            </g>
        `);
    },

    // ---- CROW ----
    crow() {
        return this.svg(20, 16, `
            <g>
                <ellipse cx="10" cy="8" rx="6" ry="4" fill="#1a1a2a"/>
                <circle cx="5" cy="7" r="2" fill="#2a2a3a"/>
                <circle cx="4" cy="6.5" r="0.5" fill="#ff0"/>
                <polygon points="2,7 0,6.5 0,7.5" fill="#aa5500"/>
                <path d="M8 5 Q3 0 0 3" stroke="#1a1a2a" stroke-width="1.5" fill="none"/>
                <path d="M12 5 Q17 0 20 3" stroke="#1a1a2a" stroke-width="1.5" fill="none"/>
                <line x1="14" y1="11" x2="14" y2="14" stroke="#555" stroke-width="0.8"/>
                <line x1="7" y1="11" x2="7" y2="14" stroke="#555" stroke-width="0.8"/>
            </g>
        `);
    },

    // ---- BARRY BURTON ----
    barry() {
        return this.svg(44, 42, `
            <g>
                <rect x="14" y="2" width="12" height="10" rx="4" fill="#e0b88a"/>
                <rect x="13" y="1" width="14" height="5" rx="2" fill="#6a3a20"/>
                <rect x="16" y="7" width="8" height="3" rx="1" fill="#8a5a3a"/>
                <circle cx="19" cy="5" r="1" fill="#2a2a4a"/>
                <circle cx="25" cy="5" r="1" fill="#2a2a4a"/>
                <rect x="12" y="12" width="16" height="16" rx="2" fill="#cc3333"/>
                <rect x="12" y="12" width="16" height="4" fill="#aa2222"/>
                <rect x="8" y="14" width="5" height="10" rx="1" fill="#cc3333"/>
                <rect x="28" y="14" width="5" height="10" rx="1" fill="#cc3333"/>
                <rect x="14" y="28" width="6" height="10" rx="1" fill="#3a3a4a"/>
                <rect x="22" y="28" width="6" height="10" rx="1" fill="#3a3a4a"/>
                <rect x="13" y="37" width="7" height="3" rx="1" fill="#3a2a1a"/>
                <rect x="22" y="37" width="7" height="3" rx="1" fill="#3a2a1a"/>
            </g>
        `);
    },

    // ---- ITEMS ----
    greenHerb() {
        return this.svg(16, 16, `
            <path d="M8 14 L8 8 Q4 4 6 2 Q8 0 8 4 Q8 0 10 2 Q12 4 8 8" fill="#2d8a3e"/>
            <rect x="7" y="10" width="2" height="5" fill="#1a5a2a"/>
        `);
    },
    redHerb() {
        return this.svg(16, 16, `
            <path d="M8 14 L8 8 Q4 4 6 2 Q8 0 8 4 Q8 0 10 2 Q12 4 8 8" fill="#a82020"/>
            <rect x="7" y="10" width="2" height="5" fill="#6a1010"/>
        `);
    },
    blueHerb() {
        return this.svg(16, 16, `
            <path d="M8 14 L8 8 Q4 4 6 2 Q8 0 8 4 Q8 0 10 2 Q12 4 8 8" fill="#2040a8"/>
            <rect x="7" y="10" width="2" height="5" fill="#102060"/>
        `);
    },
    handgunAmmo() {
        return this.svg(16, 12, `
            <rect x="2" y="3" width="12" height="7" rx="1" fill="#8a7a4a"/>
            <text x="8" y="9" text-anchor="middle" font-size="5" fill="#fff" font-family="monospace">9mm</text>
        `);
    },
    shotgunAmmo() {
        return this.svg(16, 12, `
            <rect x="1" y="2" width="14" height="8" rx="1" fill="#aa4444"/>
            <text x="8" y="8" text-anchor="middle" font-size="4" fill="#fff" font-family="monospace">SHELL</text>
        `);
    },
    firstAidSpray() {
        return this.svg(12, 18, `
            <rect x="2" y="2" width="8" height="14" rx="2" fill="#eee"/>
            <rect x="4" y="5" width="4" height="2" fill="#cc0000"/>
            <rect x="5" y="4" width="2" height="4" fill="#cc0000"/>
        `);
    },
    inkRibbon() {
        return this.svg(16, 12, `
            <rect x="2" y="3" width="12" height="6" rx="1" fill="#2a2a2a"/>
            <rect x="4" y="5" width="8" height="2" fill="#1a1a1a"/>
            <circle cx="5" cy="6" r="2" fill="#333" stroke="#555" stroke-width="0.5"/>
            <circle cx="11" cy="6" r="2" fill="#333" stroke="#555" stroke-width="0.5"/>
        `);
    },
    key(color = '#c9a84c') {
        return this.svg(16, 16, `
            <circle cx="5" cy="5" r="3" fill="none" stroke="${color}" stroke-width="1.5"/>
            <rect x="7" y="4" width="8" height="2" rx="0.5" fill="${color}"/>
            <rect x="12" y="4" width="2" height="4" rx="0.5" fill="${color}"/>
            <rect x="14" y="4" width="1" height="3" rx="0.5" fill="${color}"/>
        `);
    },
    typewriterObj() {
        return this.svg(28, 20, `
            <rect x="2" y="8" width="24" height="10" rx="2" fill="#3a3a3a"/>
            <rect x="4" y="4" width="20" height="6" rx="1" fill="#4a4a4a"/>
            <rect x="6" y="2" width="16" height="3" fill="#555"/>
            <rect x="8" y="6" width="2" height="1" fill="#888" rx="0.3"/>
            <rect x="12" y="6" width="2" height="1" fill="#888" rx="0.3"/>
            <rect x="16" y="6" width="2" height="1" fill="#888" rx="0.3"/>
            <rect x="7" y="15" width="14" height="2" rx="0.5" fill="#555"/>
        `);
    },
    itemBox() {
        return this.svg(30, 24, `
            <rect x="2" y="4" width="26" height="18" rx="2" fill="#5a4a2a"/>
            <rect x="2" y="4" width="26" height="4" fill="#6a5a3a"/>
            <rect x="12" y="12" width="6" height="4" rx="1" fill="#c9a84c"/>
            <rect x="4" y="6" width="22" height="1" fill="#4a3a1a"/>
        `);
    },

    // ---- WEAPONS (for HUD/pickup/inventory) ----
    weaponKnife() {
        return this.svg(24, 16, `
            <rect x="4" y="7" width="14" height="2" rx="0.5" fill="#bbb"/>
            <polygon points="18,6 22,8 18,10" fill="#ddd"/>
            <rect x="2" y="5" width="4" height="6" rx="1" fill="#5a3a1a"/>
            <rect x="3" y="6" width="2" height="4" rx="0.5" fill="#6a4a2a"/>
        `);
    },
    weaponHandgun() {
        return this.svg(24, 16, `
            <rect x="6" y="2" width="14" height="6" rx="1" fill="#555"/>
            <rect x="10" y="8" width="6" height="8" rx="1" fill="#444" transform="rotate(10,13,8)"/>
            <rect x="18" y="3" width="4" height="2" rx="0.5" fill="#666"/>
        `);
    },
    weaponShotgun() {
        return this.svg(36, 14, `
            <rect x="2" y="4" width="30" height="4" rx="1" fill="#5a4a3a"/>
            <rect x="2" y="3" width="6" height="6" rx="1" fill="#4a3a2a"/>
            <rect x="16" y="8" width="6" height="6" rx="1" fill="#4a3a2a" transform="rotate(15,19,8)"/>
            <rect x="30" y="5" width="4" height="2" rx="0.5" fill="#666"/>
        `);
    },
    weaponGrenade() {
        return this.svg(32, 16, `
            <rect x="2" y="4" width="24" height="6" rx="1" fill="#4a6a3a"/>
            <rect x="2" y="3" width="6" height="8" rx="1" fill="#3a5a2a"/>
            <rect x="16" y="9" width="6" height="6" rx="1" fill="#3a5a2a" transform="rotate(12,19,9)"/>
            <circle cx="28" cy="7" r="3" fill="#5a5a4a" stroke="#6a6a5a" stroke-width="0.5"/>
            <rect x="26" y="5" width="2" height="4" rx="0.5" fill="#4a6a3a"/>
        `);
    },
    weaponMagnum() {
        return this.svg(28, 18, `
            <rect x="4" y="2" width="18" height="7" rx="1" fill="#6a6a7a"/>
            <rect x="10" y="9" width="7" height="9" rx="1" fill="#5a5a6a" transform="rotate(8,13,9)"/>
            <rect x="20" y="3" width="6" height="3" rx="0.5" fill="#7a7a8a"/>
            <rect x="4" y="2" width="3" height="4" rx="0.5" fill="#8a8a9a"/>
            <circle cx="8" cy="5" r="2" fill="#4a4a5a"/>
        `);
    },
    weaponRocket() {
        return this.svg(40, 14, `
            <rect x="2" y="4" width="32" height="5" rx="1" fill="#5a6a4a"/>
            <rect x="2" y="3" width="8" height="7" rx="1" fill="#4a5a3a"/>
            <polygon points="34,3 40,6.5 34,10" fill="#6a7a5a"/>
            <rect x="14" y="2" width="3" height="9" rx="0.5" fill="#4a5a3a"/>
            <circle cx="6" cy="10" r="2" fill="#3a4a2a"/>
        `);
    },

    // Get weapon sprite by weapon ID (for inventory display)
    inventoryWeapon(weaponId) {
        const spriteMap = {
            knife: 'weaponKnife',
            handgun: 'weaponHandgun',
            shotgun: 'weaponShotgun',
            grenade: 'weaponGrenade',
            magnum: 'weaponMagnum',
            rocket: 'weaponRocket'
        };
        const fn = spriteMap[weaponId];
        if (fn && this[fn]) return this[fn]();
        return null;
    },

    // ---- MUZZLE FLASH ----
    muzzleFlash() {
        return this.svg(20, 16, `
            <polygon points="0,8 8,4 20,8 8,12" fill="#ff8" opacity="0.9"/>
            <polygon points="4,8 10,6 16,8 10,10" fill="#ffa" opacity="0.7"/>
            <circle cx="4" cy="8" r="3" fill="#ff6" opacity="0.5"/>
        `);
    },

    // ---- BLOOD SPLAT ----
    bloodSplat() {
        return this.svg(16, 16, `
            <circle cx="8" cy="8" r="4" fill="#8b0000" opacity="0.8"/>
            <circle cx="5" cy="5" r="2" fill="#8b0000" opacity="0.6"/>
            <circle cx="11" cy="6" r="1.5" fill="#700" opacity="0.5"/>
            <circle cx="7" cy="12" r="1" fill="#700" opacity="0.4"/>
        `);
    },

    // ---- WINDOW ----
    windowBG() {
        return this.svg(30, 60, `
            <rect x="0" y="0" width="30" height="60" fill="#2a352a" stroke="#4a3a2a" stroke-width="2"/>
            <rect x="3" y="3" width="24" height="26" fill="#1a2a3a" opacity="0.6"/>
            <rect x="3" y="31" width="24" height="26" fill="#1a2a3a" opacity="0.5"/>
            <line x1="15" y1="0" x2="15" y2="60" stroke="#4a3a2a" stroke-width="2"/>
            <line x1="0" y1="30" x2="30" y2="30" stroke="#4a3a2a" stroke-width="2"/>
        `);
    },
    windowBroken() {
        return this.svg(30, 60, `
            <rect x="0" y="0" width="30" height="60" fill="#2a352a" stroke="#4a3a2a" stroke-width="2"/>
            <polygon points="3,3 14,3 10,15 3,20" fill="#1a2a3a" opacity="0.6"/>
            <polygon points="16,3 27,3 27,12 20,18" fill="#1a2a3a" opacity="0.5"/>
            <polygon points="3,32 15,35 8,55 3,57" fill="#1a2a3a" opacity="0.5"/>
            <line x1="5" y1="20" x2="12" y2="25" stroke="#aab" stroke-width="0.5" opacity="0.5"/>
            <line x1="20" y1="15" x2="25" y2="22" stroke="#aab" stroke-width="0.5" opacity="0.5"/>
        `);
    },

    // ---- DOOR ----
    doorSVG(locked = false) {
        const lockColor = locked ? '#aa3333' : '#44aa44';
        return this.svg(24, 50, `
            <rect x="2" y="0" width="20" height="50" rx="1" fill="#4a3520" stroke="#6a4a30" stroke-width="1"/>
            <rect x="4" y="4" width="16" height="18" rx="1" fill="#3a2a15"/>
            <rect x="4" y="26" width="16" height="18" rx="1" fill="#3a2a15"/>
            <circle cx="18" cy="25" r="2" fill="${lockColor}"/>
        `);
    }
};
