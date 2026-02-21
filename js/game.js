// ============================================
// GAME — Main game controller
// ============================================
const Game = {
    state: 'title', // title, intro, playing, paused, inventory, gameover
    player: null,
    enemies: [],
    items: [],
    objects: [],
    currentLevel: null,
    currentSection: 'mainHall',
    frameCount: 0,
    animFrame: null,
    messageTimer: 0,
    messageEl: null,
    visitedSections: new Set(['mainHall']),
    immortalMode: false,

    // Inventory system
    selectedSlot: -1,
    inventory: {
        useItem() {
            if (Game.selectedSlot < 0 || Game.selectedSlot >= Game.player.weapons.length) {
                Game.showMessage('No item selected.');
                return;
            }
            // Equip the selected weapon
            Game.player.currentWeapon = Game.selectedSlot;
            Game.player.updateHUD();
            Game.player.updateSprite();
            const w = WEAPONS[Game.player.weapons[Game.selectedSlot]];
            Game.showMessage(`Equipped ${w.name}`);
            Game.renderInventory();
        },
        combineItem() {
            Game.showMessage('Select two items to combine.');
        },
        examineItem() {
            if (Game.selectedSlot < 0 || Game.selectedSlot >= Game.player.weapons.length) {
                Game.showMessage('No item selected.');
                return;
            }
            const wId = Game.player.weapons[Game.selectedSlot];
            const w = WEAPONS[wId];
            const descriptions = {
                knife: 'A standard survival knife. Weak but infinite use. Last resort only.',
                handgun: 'Beretta 92F. Standard-issue S.T.A.R.S. sidearm. Reliable but weak.',
                shotgun: 'Remington M870. Devastating at close range. Spread damage.',
                grenade: 'M79 Grenade Launcher. Explosive rounds. Area damage.',
                magnum: 'Colt Python .357 Magnum. Extremely powerful. Rare ammo.',
                rocket: 'Rocket Launcher. One-hit kill. Save for the final battle.'
            };
            const desc = descriptions[wId] || 'Unknown weapon.';
            const descEl = document.getElementById('inv-description');
            if (descEl) descEl.textContent = desc;
        }
    },

    // ---- SECTION HELPER ----
    getSectionForX(x) {
        if (!this.currentLevel) return null;
        for (const [name, sec] of Object.entries(this.currentLevel.sections)) {
            if (x >= sec.start && x < sec.end) return name;
        }
        return null;
    },

    // ---- SCREEN MANAGEMENT ----
    showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const el = document.getElementById(id);
        if (el) el.classList.add('active');
    },

    // ---- TITLE SCREEN ----
    showControls() {
        this.showScreen('controls-screen');
    },
    hideControls() {
        this.showScreen('title-screen');
    },

    toggleImmortalMode() {
        this.immortalMode = !this.immortalMode;
        const btn = document.getElementById('btn-immortal');
        const status = document.getElementById('immortal-status');
        if (this.immortalMode) {
            btn.classList.add('selected');
            status.textContent = 'ON';
            status.className = 'status-on';
            status.style.color = 'var(--clr-fine)';
        } else {
            btn.classList.remove('selected');
            status.textContent = 'OFF';
            status.className = 'status-off';
            status.style.color = '';
        }
    },

    inputInitialized: false,

    // ---- START GAME ----
    startGame() {
        AudioEngine.init();
        AudioEngine.resume();
        if (!this.inputInitialized) {
            Engine.initInput();
            this.inputInitialized = true;
        }
        // Clear any stale key presses
        Engine.keys = {};
        Engine.keysPressed = {};
        this.state = 'intro';
        this.showScreen('intro-screen');
        this.playIntro();
    },

    // ---- INTRO CINEMATIC ----
    playIntro() {
        const lines = [
            "Raccoon City, 1998.",
            "",
            "A series of bizarre cannibalistic murders have plagued",
            "the Arklay Mountains surrounding the city.",
            "",
            "S.T.A.R.S. Alpha Team has been dispatched to investigate",
            "after Bravo Team went silent...",
            "",
            "In the forest, the team is ambushed by monstrous dogs.",
            "Joseph Frost is torn apart. The helicopter abandons them.",
            "",
            "The survivors — Jill, Chris, Wesker, and Barry —",
            "flee into a mysterious mansion.",
            "",
            "What horrors await inside...",
        ];

        const textEl = document.getElementById('intro-text');
        textEl.textContent = '';
        textEl.style.opacity = '1';

        let lineIdx = 0;
        let charIdx = 0;
        let fullText = '';

        const typeInterval = setInterval(() => {
            if (lineIdx >= lines.length) {
                clearInterval(typeInterval);
                setTimeout(() => {
                    textEl.style.transition = 'opacity 2s';
                    textEl.style.opacity = '0';
                    setTimeout(() => this.startLevel(), 2000);
                }, 2000);
                return;
            }

            if (charIdx < lines[lineIdx].length) {
                fullText += lines[lineIdx][charIdx];
                textEl.textContent = fullText;
                charIdx++;
                if (Math.random() > 0.7) AudioEngine.typewriter();
            } else {
                fullText += '\n';
                textEl.textContent = fullText;
                lineIdx++;
                charIdx = 0;
            }
        }, 40);

        // Skip intro on key press
        const skipHandler = (e) => {
            if (e.code === 'Enter' || e.code === 'Space' || e.code === 'Escape') {
                clearInterval(typeInterval);
                textEl.style.opacity = '0';
                setTimeout(() => this.startLevel(), 500);
                document.removeEventListener('keydown', skipHandler);
            }
        };
        document.addEventListener('keydown', skipHandler);
    },

    // ---- START LEVEL ----
    startLevel() {
        // Cancel any existing game loop
        if (this.animFrame) cancelAnimationFrame(this.animFrame);
        this.state = 'playing';
        this.showScreen('game-screen');
        this.currentLevel = JSON.parse(JSON.stringify(Levels.mansion1F)); // Deep copy to reset triggers

        const world = document.getElementById('game-world');
        world.innerHTML = '';

        // Create player
        this.player = new Player(80, 400);
        this.player.immortalMode = this.immortalMode;
        this.player.spawn(world);
        this.player.updateHUD();

        // Spawn enemies
        this.enemies = [];
        this.currentLevel.enemySpawns.forEach(e => {
            let enemy;
            switch (e.type) {
                case 'zombie': enemy = new Zombie(e.x, e.y, e.variant || 0); break;
                case 'cerberus': enemy = new Cerberus(e.x, e.y); break;
                case 'crow': enemy = new Crow(e.x, e.y); break;
                case 'hunter': enemy = new Hunter(e.x, e.y); break;
                default: return;
            }
            if (e.scripted) {
                enemy.activated = false;
                enemy.scriptedId = e.scripted;
                enemy.el = null; // Don't spawn yet
            } else {
                enemy.spawn(world);
            }
            // Assign enemy to its home section based on spawn position
            enemy.section = this.getSectionForX(e.x);
            this.enemies.push(enemy);
        });

        // Spawn items
        this.items = [];
        this.currentLevel.itemSpawns.forEach(i => {
            const item = new ItemPickup(i.x, i.y, i.type, i.data || {});
            item.spawn(world);
            this.items.push(item);
        });

        // Spawn objects
        this.objects = [];
        this.currentLevel.objects.forEach(o => {
            const obj = new InteractiveObject(o.x, o.y, o.w, o.h, o.type, o.data || {});
            obj.spawn(world);
            this.objects.push(obj);
        });

        // Set starting section and visited set
        this.currentSection = 'mainHall';
        this.visitedSections = new Set(['mainHall']);

        // Render background decorations
        this.renderBackgrounds();

        // Start safe room music briefly
        AudioEngine.playSafeRoomMusic();
        setTimeout(() => AudioEngine.stopSafeRoomMusic(), 6000);

        // Initial dialogue - Barry
        setTimeout(() => {
            this.showDialogue('BARRY', '"What IS this place...? Jill, be careful. I\'ll stay here and secure the main hall."');
        }, 1500);

        // Start game loop
        this.frameCount = 0;
        this.gameLoop();
    },

    // ---- RENDER BACKGROUNDS ----
    renderBackgrounds() {
        const bg0 = document.getElementById('bg-layer-0');
        const bg1 = document.getElementById('bg-layer-1');
        const bg2 = document.getElementById('bg-layer-2');

        // Deep background — gradient sky/darkness
        bg0.style.background = 'linear-gradient(180deg, #050208 0%, #0d0805 60%, #1a120b 100%)';

        // Mid background — mansion walls
        bg1.innerHTML = '';
        this.renderMansionBG(bg1);

        // Near background - foreground detail
        bg2.innerHTML = '';
    },

    renderMansionBG(container) {
        // Generate procedural mansion background
        const level = this.currentLevel;
        const sections = level.sections;

        Object.entries(sections).forEach(([name, sec]) => {
            const div = document.createElement('div');
            div.setAttribute('data-section', name);
            // Hide sections the player hasn't visited yet
            const visible = this.visitedSections.has(name);
            div.style.cssText = `position:absolute;left:${sec.start}px;top:0;width:${sec.end - sec.start}px;height:100%;display:${visible ? 'block' : 'none'};`;

            switch (name) {
                case 'mainHall':
                    div.innerHTML = this.bgMainHall(sec.end - sec.start);
                    break;
                case 'kennethHall':
                    div.innerHTML = this.bgDarkCorridor(sec.end - sec.start);
                    break;
                case 'diningRoom':
                    div.innerHTML = this.bgDiningRoom(sec.end - sec.start);
                    break;
                case 'lCorridor':
                    div.innerHTML = this.bgLCorridor(sec.end - sec.start);
                    break;
                case 'mirrorRoom':
                    div.innerHTML = this.bgMirrorRoom(sec.end - sec.start);
                    break;
                case 'pianoRoom':
                    div.innerHTML = this.bgPianoRoom(sec.end - sec.start);
                    break;
                case 'galleryHall':
                    div.innerHTML = this.bgGallery(sec.end - sec.start);
                    break;
                case 'graveyard':
                    div.innerHTML = this.bgGraveyard(sec.end - sec.start);
                    break;
            }
            container.appendChild(div);
        });
    },

    // Background SVGs for each section
    bgMainHall(w) {
        return `<svg width="${w}" height="540" viewBox="0 0 ${w} 540">
            <!-- Floor -->
            <rect x="0" y="440" width="${w}" height="100" fill="#3a2a18"/>
            <rect x="0" y="440" width="${w}" height="3" fill="#4a3a28"/>
            <!-- Carpet -->
            <rect x="100" y="440" width="${w - 200}" height="100" fill="#6a2020" opacity="0.4"/>
            <rect x="100" y="440" width="${w - 200}" height="3" fill="#8a3030" opacity="0.3"/>
            <!-- Walls -->
            <rect x="0" y="0" width="${w}" height="440" fill="#2d1f10"/>
            <!-- Wainscoting -->
            <rect x="0" y="300" width="${w}" height="140" fill="#3a2a18"/>
            <rect x="0" y="300" width="${w}" height="4" fill="#4a3a28"/>
            <!-- Columns -->
            <rect x="0" y="100" width="20" height="340" fill="#3a2a1a"/>
            <rect x="${w - 20}" y="100" width="20" height="340" fill="#3a2a1a"/>
            <!-- Chandelier -->
            <circle cx="${w / 2}" cy="60" r="4" fill="#c9a84c"/>
            <line x1="${w / 2}" y1="0" x2="${w / 2}" y2="60" stroke="#c9a84c" stroke-width="1"/>
            <line x1="${w / 2 - 20}" y1="65" x2="${w / 2 + 20}" y2="65" stroke="#c9a84c" stroke-width="1.5"/>
            <circle cx="${w / 2 - 15}" cy="70" r="3" fill="#ff8" opacity="0.6"/>
            <circle cx="${w / 2}" cy="70" r="3" fill="#ff8" opacity="0.6"/>
            <circle cx="${w / 2 + 15}" cy="70" r="3" fill="#ff8" opacity="0.6"/>
            <!-- Paintings -->
            <rect x="100" y="150" width="60" height="80" fill="#2a1a0a" stroke="#6a4a2a" stroke-width="2"/>
            <rect x="${w - 180}" y="160" width="50" height="60" fill="#2a1a0a" stroke="#6a4a2a" stroke-width="2"/>
            <!-- Staircase hint -->
            <path d="M${w / 2 - 60} 440 L${w / 2 - 60} 250 L${w / 2 + 60} 250 L${w / 2 + 60} 440" fill="none" stroke="#4a3a28" stroke-width="2"/>
            <text x="${w / 2}" y="140" text-anchor="middle" font-size="10" fill="#6a5a3a" font-family="serif">MAIN HALL</text>
        </svg>`;
    },

    bgDarkCorridor(w) {
        return `<svg width="${w}" height="540" viewBox="0 0 ${w} 540">
            <rect x="0" y="440" width="${w}" height="100" fill="#2a1a10"/>
            <rect x="0" y="440" width="${w}" height="3" fill="#3a2a18"/>
            <rect x="0" y="0" width="${w}" height="440" fill="#1a120b"/>
            <rect x="0" y="300" width="${w}" height="140" fill="#2a1a10"/>
            <!-- Blood pool -->
            <ellipse cx="${w / 2}" cy="435" rx="40" ry="8" fill="#5a0000" opacity="0.6"/>
            <ellipse cx="${w / 2 + 10}" cy="432" rx="15" ry="4" fill="#7a0000" opacity="0.4"/>
            <!-- Very dim lighting -->
            <rect x="0" y="0" width="${w}" height="540" fill="rgba(0,0,0,0.3)"/>
            <!-- Kenneth's body hint -->
            <rect x="${w / 2 - 15}" y="415" width="30" height="20" rx="3" fill="#4a4a3a" opacity="0.5"/>
            <text x="${w / 2}" y="200" text-anchor="middle" font-size="8" fill="#3a2a1a" font-family="serif">Something is hunched over in the darkness...</text>
        </svg>`;
    },

    bgDiningRoom(w) {
        return `<svg width="${w}" height="540" viewBox="0 0 ${w} 540">
            <rect x="0" y="440" width="${w}" height="100" fill="#3a2a18"/>
            <rect x="0" y="0" width="${w}" height="440" fill="#2d1f10"/>
            <rect x="0" y="300" width="${w}" height="140" fill="#3a2a18"/>
            <!-- Dining table -->
            <rect x="80" y="360" width="${w - 160}" height="8" fill="#5a3a1a"/>
            <rect x="100" y="368" width="8" height="72" fill="#4a2a10"/>
            <rect x="${w - 120}" y="368" width="8" height="72" fill="#4a2a10"/>
            <!-- Candles on table -->
            <rect x="200" y="348" width="4" height="12" fill="#ddd"/>
            <circle cx="202" cy="345" r="3" fill="#ff8" opacity="0.7"/>
            <rect x="${w - 220}" y="348" width="4" height="12" fill="#ddd"/>
            <circle cx="${w - 218}" cy="345" r="3" fill="#ff8" opacity="0.7"/>
            <!-- Fireplace -->
            <rect x="${w / 2 - 40}" y="240" width="80" height="60" fill="#1a0a00" stroke="#5a3a1a" stroke-width="3"/>
            <rect x="${w / 2 - 30}" y="260" width="60" height="40" fill="#0a0500"/>
            <circle cx="${w / 2}" cy="285" r="8" fill="#ff4400" opacity="0.3"/>
            <!-- Grandfather clock -->
            <rect x="30" y="200" width="30" height="100" fill="#4a3020" stroke="#6a4a30" stroke-width="1"/>
            <circle cx="45" cy="230" r="10" fill="#2a1a0a" stroke="#c9a84c" stroke-width="0.5"/>
            <text x="${w / 2}" y="130" text-anchor="middle" font-size="10" fill="#6a5a3a" font-family="serif">DINING ROOM</text>
        </svg>`;
    },

    bgLCorridor(w) {
        return `<svg width="${w}" height="540" viewBox="0 0 ${w} 540">
            <rect x="0" y="440" width="${w}" height="100" fill="#2a1a10"/>
            <rect x="0" y="0" width="${w}" height="440" fill="#1a120b"/>
            <rect x="0" y="300" width="${w}" height="140" fill="#2a1a10"/>
            <!-- Tall windows -->
            <rect x="120" y="140" width="40" height="100" fill="#0a1520" stroke="#4a3a2a" stroke-width="2"/>
            <line x1="140" y1="140" x2="140" y2="240" stroke="#4a3a2a" stroke-width="1"/>
            <line x1="120" y1="190" x2="160" y2="190" stroke="#4a3a2a" stroke-width="1"/>
            <rect x="280" y="140" width="40" height="100" fill="#0a1520" stroke="#4a3a2a" stroke-width="2"/>
            <line x1="300" y1="140" x2="300" y2="240" stroke="#4a3a2a" stroke-width="1"/>
            <rect x="440" y="140" width="40" height="100" fill="#0a1520" stroke="#4a3a2a" stroke-width="2"/>
            <!-- Moonlight patches -->
            <polygon points="130,440 110,300 170,300 150,440" fill="rgba(100,120,160,0.05)"/>
            <polygon points="290,440 270,300 330,300 310,440" fill="rgba(100,120,160,0.05)"/>
            <text x="${w / 2}" y="120" text-anchor="middle" font-size="8" fill="#3a2a1a" font-family="serif">L-SHAPED CORRIDOR</text>
        </svg>`;
    },

    bgMirrorRoom(w) {
        return `<svg width="${w}" height="540" viewBox="0 0 ${w} 540">
            <rect x="0" y="440" width="${w}" height="100" fill="#3a2a18"/>
            <rect x="0" y="0" width="${w}" height="440" fill="#2d1f10"/>
            <rect x="0" y="300" width="${w}" height="140" fill="#3a2a18"/>
            <!-- Mirror -->
            <rect x="${w / 2 - 60}" y="160" width="120" height="100" fill="#1a2a3a" stroke="#c9a84c" stroke-width="2" opacity="0.6"/>
            <rect x="${w / 2 - 55}" y="165" width="110" height="90" fill="#0a1520" opacity="0.4"/>
            <!-- Shotgun on wall mount -->
            <rect x="${w / 2 - 30}" y="340" width="60" height="6" fill="#4a3a2a"/>
            <rect x="${w / 2 - 25}" y="330" width="50" height="6" rx="2" fill="#5a4a3a"/>
            <text x="${w / 2}" y="310" text-anchor="middle" font-size="7" fill="#8a6a3a" font-family="serif">A shotgun hangs on the wall...</text>
            <text x="${w / 2}" y="130" text-anchor="middle" font-size="10" fill="#6a5a3a" font-family="serif">MIRROR ROOM</text>
        </svg>`;
    },

    bgPianoRoom(w) {
        return `<svg width="${w}" height="540" viewBox="0 0 ${w} 540">
            <rect x="0" y="440" width="${w}" height="100" fill="#3a2a18"/>
            <rect x="0" y="0" width="${w}" height="440" fill="#2d1f10"/>
            <rect x="0" y="300" width="${w}" height="140" fill="#3a2a18"/>
            <!-- Grand piano -->
            <path d="M150 380 Q150 340 200 330 L350 330 Q400 340 400 380 Z" fill="#1a1a1a"/>
            <rect x="170" y="380" width="210" height="8" fill="#2a2a2a"/>
            <rect x="180" y="388" width="8" height="52" fill="#1a1a1a"/>
            <rect x="360" y="388" width="8" height="52" fill="#1a1a1a"/>
            <!-- Piano keys -->
            <rect x="190" y="375" width="170" height="6" fill="#eee"/>
            <rect x="200" y="375" width="3" height="4" fill="#222"/>
            <rect x="210" y="375" width="3" height="4" fill="#222"/>
            <rect x="225" y="375" width="3" height="4" fill="#222"/>
            <rect x="235" y="375" width="3" height="4" fill="#222"/>
            <rect x="250" y="375" width="3" height="4" fill="#222"/>
            <!-- Bar/bookshelves -->
            <rect x="30" y="200" width="80" height="200" fill="#3a2a1a"/>
            <rect x="35" y="210" width="70" height="15" fill="#2a1a0a"/>
            <rect x="35" y="230" width="70" height="15" fill="#2a1a0a"/>
            <rect x="35" y="250" width="70" height="15" fill="#2a1a0a"/>
            <text x="${w / 2}" y="130" text-anchor="middle" font-size="10" fill="#6a5a3a" font-family="serif">BAR / PIANO ROOM</text>
        </svg>`;
    },

    bgGallery(w) {
        return `<svg width="${w}" height="540" viewBox="0 0 ${w} 540">
            <rect x="0" y="440" width="${w}" height="100" fill="#3a2a18"/>
            <rect x="0" y="0" width="${w}" height="440" fill="#2d1f10"/>
            <rect x="0" y="300" width="${w}" height="140" fill="#3a2a18"/>
            <!-- Paintings -->
            <rect x="60" y="160" width="70" height="90" fill="#1a0a00" stroke="#8a6a3a" stroke-width="2"/>
            <rect x="200" y="170" width="50" height="70" fill="#1a0a00" stroke="#8a6a3a" stroke-width="2"/>
            <rect x="320" y="155" width="80" height="100" fill="#1a0a00" stroke="#8a6a3a" stroke-width="2"/>
            <rect x="480" y="175" width="45" height="55" fill="#1a0a00" stroke="#8a6a3a" stroke-width="2"/>
            <!-- Stained glass hint -->
            <rect x="${w / 2 - 20}" y="80" width="40" height="60" rx="20" fill="rgba(100,60,140,0.2)" stroke="#6a4a8a" stroke-width="1"/>
            <!-- Knight armor -->
            <rect x="${w - 80}" y="340" width="20" height="60" fill="#6a6a7a"/>
            <circle cx="${w - 70}" cy="330" r="10" fill="#6a6a7a"/>
            <text x="${w / 2}" y="130" text-anchor="middle" font-size="10" fill="#6a5a3a" font-family="serif">ART GALLERY</text>
        </svg>`;
    },

    bgGraveyard(w) {
        return `<svg width="${w}" height="540" viewBox="0 0 ${w} 540">
            <!-- Sky -->
            <rect x="0" y="0" width="${w}" height="440" fill="#0a0e18"/>
            <!-- Moon -->
            <circle cx="${w - 100}" cy="60" r="25" fill="#dde8ff" opacity="0.6"/>
            <circle cx="${w - 90}" cy="55" r="25" fill="#0a0e18"/>
            <!-- Ground -->
            <rect x="0" y="400" width="${w}" height="140" fill="#2a3a1a"/>
            <rect x="0" y="400" width="${w}" height="8" fill="#3a4a2a"/>
            <!-- Tombstones -->
            <rect x="80" y="360" width="20" height="40" rx="3" fill="#5a5a6a"/>
            <rect x="180" y="370" width="25" height="35" rx="3" fill="#5a5a6a"/>
            <rect x="300" y="355" width="22" height="45" rx="3" fill="#5a5a6a"/>
            <rect x="450" y="365" width="18" height="38" rx="3" fill="#5a5a6a"/>
            <rect x="580" y="360" width="24" height="42" rx="3" fill="#5a5a6a"/>
            <!-- Dead trees -->
            <line x1="250" y1="400" x2="250" y2="200" stroke="#3a2a1a" stroke-width="4"/>
            <line x1="250" y1="250" x2="220" y2="200" stroke="#3a2a1a" stroke-width="2"/>
            <line x1="250" y1="280" x2="290" y2="230" stroke="#3a2a1a" stroke-width="2"/>
            <line x1="550" y1="400" x2="550" y2="250" stroke="#3a2a1a" stroke-width="3"/>
            <line x1="550" y1="300" x2="530" y2="260" stroke="#3a2a1a" stroke-width="2"/>
            <!-- Fog -->
            <ellipse cx="${w / 2}" cy="420" rx="${w / 2}" ry="40" fill="rgba(100,120,140,0.08)"/>
            <text x="${w / 2}" y="130" text-anchor="middle" font-size="10" fill="#4a5a6a" font-family="serif">GRAVEYARD</text>
        </svg>`;
    },

    // ---- GAME LOOP ----
    gameLoop() {
        if (this.state !== 'playing') return;

        this.frameCount++;
        const world = document.getElementById('game-world');

        // Update player
        this.player.update();
        Engine.updateCamera(this.player.x);

        // Update enemies
        this.enemies.forEach(e => {
            if (e.el) e.update(this.player);
        });

        // Update items
        this.items.forEach(i => i.update(this.player));

        // Update objects
        this.objects.forEach(o => o.update(this.player));

        // Check triggers
        this.checkTriggers();

        // Enemy-player collision
        this.enemies.forEach(e => {
            if (e.dead || !e.activated || !e.el) return;
            if (Engine.rectsOverlap(e, this.player)) {
                // Contact damage handled in individual enemy update
            }
        });

        // Pause / Inventory
        if (Engine.wasPressed(['Escape'])) this.pause();
        if (Engine.wasPressed(['KeyI', 'Tab'])) this.toggleInventory();

        // Update particles
        Engine.updateParticles();

        // Update ECG
        Engine.updateECG(this.player.hp / this.player.maxHp);

        // Ambient sounds
        Engine.updateAmbient();

        // ---- RENDER ----
        // Update parallax
        const bg1 = document.getElementById('bg-layer-1');
        bg1.style.transform = `translateX(${-Engine.camera.x}px)`;

        // Render entities — hide those in unvisited sections
        this.player.render();
        this.enemies.forEach(e => {
            if (!e.el) return;
            const sec = e.section || this.getSectionForX(e.x);
            if (sec && !this.visitedSections.has(sec)) {
                e.el.style.display = 'none';
            } else {
                e.el.style.display = '';
                e.render();
            }
        });
        this.items.forEach(i => {
            if (!i.el) return;
            const sec = this.getSectionForX(i.x);
            if (sec && !this.visitedSections.has(sec)) {
                i.el.style.display = 'none';
            } else {
                i.el.style.display = '';
                i.render();
            }
        });
        this.objects.forEach(o => {
            if (!o.el) return;
            const sec = this.getSectionForX(o.x);
            if (sec && !this.visitedSections.has(sec)) {
                o.el.style.display = 'none';
            } else {
                o.el.style.display = '';
                o.render();
            }
        });

        // Render particles
        Engine.renderParticles(world);

        // Message timer
        if (this.messageTimer > 0) {
            this.messageTimer--;
            if (this.messageTimer === 0 && this.messageEl) {
                this.messageEl.style.opacity = '0';
                setTimeout(() => { if (this.messageEl) this.messageEl.remove(); this.messageEl = null; }, 500);
            }
        }

        this.animFrame = requestAnimationFrame(() => this.gameLoop());
    },

    // ---- TRIGGERS / SCRIPTED EVENTS ----
    checkTriggers() {
        if (!this.currentLevel) return;
        this.currentLevel.triggers.forEach(t => {
            if (t.triggered) return;
            if (this.player.x >= t.x && this.player.x <= t.x + t.w) {
                t.triggered = true;
                this.executeScript(t.action);
            }
        });
    },

    executeScript(action) {
        switch (action) {
            case 'firstZombieReveal':
                this.firstZombieScene();
                break;
            case 'dogsThruWindows':
                this.dogsThruWindowsScene();
                break;
            case 'shotgunTrapSequence':
                this.shotgunTrapScene();
                break;
            case 'barryDialogue':
                break;
        }
    },

    // ---- SCRIPTED: First Zombie ----
    firstZombieScene() {
        // Pause briefly, show the zombie turning
        const zombie = this.enemies.find(e => e.scriptedId === 'firstZombie');
        if (!zombie) return;

        // Spawn the zombie now
        const world = document.getElementById('game-world');
        zombie.spawn(world);
        zombie.activated = false; // Don't move yet

        // Audio stinger
        AudioEngine.stinger();
        Engine.shakeScreen(200);

        // Dialogue
        this.showDialogue('', '"What... what IS that?!"');

        // After a beat, zombie activates
        setTimeout(() => {
            zombie.activated = true;
            AudioEngine.zombieGroan();
        }, 2000);
    },

    // ---- SCRIPTED: Dogs Through Windows ----
    dogsThruWindowsScene() {
        const dogs = this.enemies.filter(e => e.scriptedId === 'dogsWindow');
        const world = document.getElementById('game-world');

        // Glass crash effect
        AudioEngine.glassCrash();
        AudioEngine.stinger();
        Engine.shakeScreen(300);
        Engine.flashScreen(60);

        // Spawn glass particles at window locations
        Engine.spawnGlass(1850, 380, 15);
        Engine.spawnGlass(1950, 380, 15);

        // Replace windows with broken versions and disable interaction
        this.objects.forEach(obj => {
            if (obj.data && obj.data.triggerId === 'dogsWindow' && obj.el) {
                obj.el.innerHTML = '';
                obj.el.appendChild(Sprites.windowBroken());
                obj.used = true; // Stop showing [X] LOOK prompt
            }
        });

        // Spawn and activate dogs
        dogs.forEach((dog, i) => {
            setTimeout(() => {
                dog.spawn(world);
                dog.activated = true;
                dog.x = 1850 + i * 100;
                AudioEngine.dogSnarl();
            }, i * 200);
        });
    },

    // ---- SCRIPTED: Shotgun Trap ----
    shotgunTrapScene() {
        // Check if player picks up shotgun in mirror room area
        AudioEngine.ceilingTrap();
        Engine.shakeScreen(500);

        // Add shotgun to player
        if (!this.player.weapons.includes('shotgun')) {
            this.player.weapons.push('shotgun');
            this.player.ammo.shotgun = 7;
        }

        // Barry saves!
        setTimeout(() => {
            this.showDialogue('BARRY', '"Jill!! Hold on!"');
            AudioEngine.doorOpen();
        }, 1000);

        setTimeout(() => {
            // Spawn Barry briefly
            const world = document.getElementById('game-world');
            const barryEl = document.createElement('div');
            barryEl.className = 'entity entity-npc';
            barryEl.style.cssText = `width:44px;height:42px;position:absolute;left:${2500 - Engine.camera.x}px;top:398px;z-index:18;`;
            barryEl.appendChild(Sprites.barry());
            world.appendChild(barryEl);

            this.showDialogue('BARRY', '"That was too close! You were almost a Jill sandwich!"');

            setTimeout(() => {
                barryEl.style.transition = 'opacity 2s';
                barryEl.style.opacity = '0';
                setTimeout(() => barryEl.remove(), 2000);
            }, 4000);
        }, 2500);

        this.showMessage('Acquired Shotgun!');
    },

    // ---- DOOR TRANSITION ----
    doorTransition(targetSection) {
        this.state = 'transition';
        cancelAnimationFrame(this.animFrame);
        const doorScreen = document.getElementById('door-transition');
        doorScreen.classList.add('active');
        doorScreen.classList.remove('opening');
        AudioEngine.doorOpen();

        setTimeout(() => {
            doorScreen.classList.add('opening');
        }, 100);

        setTimeout(() => {
            // Move player to section start
            if (this.currentLevel && this.currentLevel.sections[targetSection]) {
                const sec = this.currentLevel.sections[targetSection];
                const oldSec = this.currentLevel.sections[this.currentSection];
                const movingForward = !oldSec || sec.start > oldSec.start;

                this.currentSection = targetSection;
                // Mark section as visited and reveal its background
                this.visitedSections.add(targetSection);
                const bg1 = document.getElementById('bg-layer-1');
                if (bg1) {
                    const secDiv = bg1.querySelector(`[data-section="${targetSection}"]`);
                    if (secDiv) secDiv.style.display = 'block';
                }

                // Spawn player near the correct door
                if (movingForward) {
                    this.player.x = sec.start + 60; // Next to backward door
                    this.player.facingRight = true;
                } else {
                    this.player.x = sec.end - 100; // Next to forward door
                    this.player.facingRight = false;
                }

                this.player.y = Engine.GROUND_Y - this.player.h;
                this.player.vx = 0;
                this.player.vy = 0;
                this.player.updateSprite();
                Engine.updateCamera(this.player.x);
            }
            doorScreen.classList.remove('active', 'opening');
            this.state = 'playing';
            this.gameLoop();
        }, 1800);
    },

    // ---- DIALOGUE SYSTEM ----
    showDialogue(speaker, text) {
        const box = document.getElementById('dialogue-box');
        const nameEl = document.getElementById('dialogue-name');
        const textEl = document.getElementById('dialogue-text');

        nameEl.textContent = speaker;
        textEl.textContent = '';
        box.classList.remove('hidden');

        // Typewriter effect
        let idx = 0;
        const typeInterval = setInterval(() => {
            if (idx < text.length) {
                textEl.textContent += text[idx];
                idx++;
                if (idx % 3 === 0) AudioEngine.typewriter();
            } else {
                clearInterval(typeInterval);
            }
        }, 30);

        // Auto-hide after reading time
        const readTime = Math.max(3000, text.length * 50);
        setTimeout(() => {
            box.classList.add('hidden');
            clearInterval(typeInterval);
        }, readTime);

        // Skip on key press
        const skipFn = () => {
            clearInterval(typeInterval);
            textEl.textContent = text;
            setTimeout(() => box.classList.add('hidden'), 1000);
            document.removeEventListener('keydown', skipFn);
        };
        setTimeout(() => document.addEventListener('keydown', skipFn, { once: true }), 500);
    },

    // ---- SIMPLE MESSAGE (HUD) ----
    showMessage(text) {
        if (this.messageEl) this.messageEl.remove();
        this.messageEl = document.createElement('div');
        this.messageEl.style.cssText = `position:absolute;top:60px;left:50%;transform:translateX(-50%);
            z-index:55;font-family:'Special Elite',serif;font-size:14px;color:#c9a84c;
            letter-spacing:2px;text-shadow:0 0 10px rgba(0,0,0,0.8);
            background:rgba(10,5,2,0.7);padding:8px 20px;border:1px solid rgba(139,0,0,0.3);
            border-radius:2px;transition:opacity 0.5s;pointer-events:none;white-space:nowrap;`;
        this.messageEl.textContent = text;
        document.getElementById('game-screen').appendChild(this.messageEl);
        this.messageTimer = 180; // ~3 seconds
    },

    // ---- PAUSE ----
    pause() {
        if (this.state === 'paused') { this.resume(); return; }
        this.state = 'paused';
        cancelAnimationFrame(this.animFrame);
        // Overlay pause on top of game (don't hide game)
        document.getElementById('pause-screen').classList.add('active');
    },
    resume() {
        this.state = 'playing';
        document.getElementById('pause-screen').classList.remove('active');
        this.gameLoop();
    },

    // ---- INVENTORY ----
    toggleInventory() {
        if (this.state === 'inventory') {
            this.state = 'playing';
            document.getElementById('inventory-screen').classList.remove('active');
            this.gameLoop();
        } else if (this.state === 'playing') {
            this.state = 'inventory';
            cancelAnimationFrame(this.animFrame);
            // Overlay inventory on top of game
            document.getElementById('inventory-screen').classList.add('active');
            this.renderInventory();
        }
    },
    showInventoryFromPause() {
        document.getElementById('pause-screen').classList.remove('active');
        this.state = 'inventory';
        document.getElementById('inventory-screen').classList.add('active');
        this.renderInventory();
    },
    renderInventory() {
        const grid = document.getElementById('inv-grid');
        grid.innerHTML = '';
        const descEl = document.getElementById('inv-description');
        if (descEl) descEl.textContent = 'Select an item...';

        // ---- WEAPONS PANEL ----
        const weaponSlots = 6; // 3x2 grid
        for (let i = 0; i < weaponSlots; i++) {
            const slot = document.createElement('div');
            slot.className = 'inv-slot';

            if (i < this.player.weapons.length) {
                const wId = this.player.weapons[i];
                const w = WEAPONS[wId];

                const container = document.createElement('div');
                container.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100%;gap:2px;';

                const spriteWrapper = document.createElement('div');
                spriteWrapper.style.cssText = 'transform:scale(1.4);display:flex;align-items:center;justify-content:center;';
                const sprite = Sprites.inventoryWeapon(wId);
                if (sprite) spriteWrapper.appendChild(sprite);
                container.appendChild(spriteWrapper);

                const label = document.createElement('div');
                label.style.cssText = `font-size:7px;color:#c9a84c;text-align:center;font-family:'Special Elite',serif;letter-spacing:1px;margin-top:2px;`;
                label.textContent = w.name;
                container.appendChild(label);

                if (i === this.player.currentWeapon) {
                    slot.style.borderColor = '#c9a84c';
                    slot.style.boxShadow = '0 0 8px rgba(201,168,76,0.4)';
                    const eqBadge = document.createElement('div');
                    eqBadge.style.cssText = `position:absolute;top:1px;right:2px;font-size:6px;color:#c9a84c;font-family:'Special Elite',serif;letter-spacing:1px;`;
                    eqBadge.textContent = 'EQ';
                    slot.style.position = 'relative';
                    container.appendChild(eqBadge);
                }

                slot.appendChild(container);

                // Tooltip
                const tooltip = document.createElement('div');
                tooltip.className = 'inv-tooltip';
                const fireRateDesc = w.fireRate > 20 ? 'Slow' : w.fireRate > 10 ? 'Medium' : 'Fast';
                tooltip.innerHTML = `<div class="inv-tooltip-title">${w.name}</div>
                    <div class="inv-tooltip-desc">Damage: ${w.damage} | Range: ${w.range} | Speed: ${fireRateDesc}</div>`;
                slot.appendChild(tooltip);

                if (i === this.selectedSlot) {
                    slot.classList.add('selected');
                }
            }

            const idx = i;
            slot.addEventListener('click', () => {
                this.selectedSlot = idx;
                this.renderInventory();
                if (idx < this.player.weapons.length) {
                    const wId = this.player.weapons[idx];
                    const w = WEAPONS[wId];
                    const ammoInfo = w.ammoKey ? ` | Ammo: ${this.player.ammo[w.ammoKey]}/${this.player.ammoReserve[w.ammoKey]}` : ' | ∞ uses';
                    if (descEl) descEl.textContent = `${w.name} — DMG: ${w.damage} | RNG: ${w.range}${ammoInfo}`;
                } else {
                    if (descEl) descEl.textContent = '— Empty Slot —';
                }
            });

            grid.appendChild(slot);
        }

        // ---- ITEMS PANEL ----
        const itemsGrid = document.getElementById('inv-items-grid');
        itemsGrid.innerHTML = '';
        const itemSlots = 6; // 3x2 grid

        // Build items list: key items + ammo reserves
        const displayItems = [];
        // Key items
        this.player.keyItems.forEach(k => {
            displayItems.push({
                type: 'key',
                name: k,
                desc: 'A crucial item needed to unlock new areas or solve puzzles.',
                sprite: () => Sprites.key('#c9a84c')
            });
        });
        // Ammo reserves (show as items if player has any)
        const ammoTypes = [
            { key: 'handgun', name: 'Handgun Ammo', desc: 'Standard 9mm parabellum rounds.', sprite: () => Sprites.handgunAmmo() },
            { key: 'shotgun', name: 'Shotgun Shells', desc: '12-gauge buckshot. Deadly at close range.', sprite: () => Sprites.shotgunAmmo() },
        ];
        ammoTypes.forEach(a => {
            const total = (this.player.ammo[a.key] || 0) + (this.player.ammoReserve[a.key] || 0);
            if (total > 0) {
                displayItems.push({ type: 'ammo', name: `${a.name} (${total})`, desc: a.desc, sprite: a.sprite });
            }
        });

        for (let i = 0; i < itemSlots; i++) {
            const slot = document.createElement('div');
            slot.className = 'inv-slot';

            if (i < displayItems.length) {
                const item = displayItems[i];
                const container = document.createElement('div');
                container.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100%;gap:2px;';

                const spriteWrapper = document.createElement('div');
                spriteWrapper.style.cssText = 'transform:scale(1.8);display:flex;align-items:center;justify-content:center;';
                const sprite = item.sprite();
                if (sprite) spriteWrapper.appendChild(sprite);
                container.appendChild(spriteWrapper);

                const label = document.createElement('div');
                label.style.cssText = `font-size:6px;color:${item.type === 'key' ? '#c9a84c' : '#aaa'};text-align:center;font-family:'Special Elite',serif;letter-spacing:1px;margin-top:2px;max-width:52px;overflow:hidden;`;
                label.textContent = item.name;
                container.appendChild(label);

                slot.appendChild(container);

                // Tooltip
                const tooltip = document.createElement('div');
                tooltip.className = 'inv-tooltip';
                const displayName = item.type === 'ammo' ? item.name.split(' (')[0] : item.name; // strip count for title
                tooltip.innerHTML = `<div class="inv-tooltip-title">${displayName}</div>
                    <div class="inv-tooltip-desc">${item.desc}</div>`;
                slot.appendChild(tooltip);
            }

            itemsGrid.appendChild(slot);
        }

        // Health display
        const hd = document.getElementById('inv-health-display');
        if (hd) {
            const statusColor = this.player.healthStatus === 'fine' ? '#4a4' :
                this.player.healthStatus === 'danger' ? '#f22' :
                    this.player.healthStatus === 'poison' ? '#6b2d8b' : '#ca0';
            hd.innerHTML = `<div style="font-family:'Special Elite',serif;color:${statusColor};font-size:18px;letter-spacing:4px">${this.player.healthStatus.toUpperCase()}</div>`;
        }
    },

    // ---- GAME OVER ----
    gameOver() {
        this.state = 'gameover';
        cancelAnimationFrame(this.animFrame);
        setTimeout(() => {
            // Overlay game over on top of game
            document.getElementById('gameover-screen').classList.add('active');
        }, 1000);
    },

    // ---- RESTART ----
    restart() {
        document.getElementById('gameover-screen').classList.remove('active');
        this.startLevel();
    },

    // ---- QUIT ----
    quitToTitle() {
        this.state = 'title';
        cancelAnimationFrame(this.animFrame);
        AudioEngine.stopSafeRoomMusic();
        // Hide all overlays
        document.getElementById('pause-screen').classList.remove('active');
        document.getElementById('inventory-screen').classList.remove('active');
        document.getElementById('gameover-screen').classList.remove('active');
        this.showScreen('title-screen');
    }
};

// ---- GLOBAL KEY HANDLER ----
document.addEventListener('keydown', (e) => {
    // Title screen
    if (Game.state === 'title' && (e.code === 'Enter' || e.code === 'Space')) {
        Game.startGame();
        return;
    }
    // Close inventory
    if (Game.state === 'inventory' && (e.code === 'KeyI' || e.code === 'Tab' || e.code === 'Escape')) {
        e.preventDefault();
        Game.toggleInventory();
        return;
    }
    // Resume from pause
    if (Game.state === 'paused' && e.code === 'Escape') {
        Game.resume();
        return;
    }
});

