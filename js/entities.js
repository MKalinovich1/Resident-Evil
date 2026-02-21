// ============================================
// ENTITIES — Player, Enemies, Items, NPCs
// ============================================

// ---- WEAPON DATA ----
const WEAPONS = {
    knife: { name: 'KNIFE', damage: 8, range: 35, fireRate: 15, spread: false, ammoKey: null, auto: false, sound: 'knifeSlash', capacity: 0 },
    handgun: { name: 'BERETTA', damage: 12, range: 400, fireRate: 12, spread: false, ammoKey: 'handgun', auto: false, sound: 'pistolShot', capacity: 15 },
    shotgun: { name: 'SHOTGUN', damage: 35, range: 180, fireRate: 30, spread: true, ammoKey: 'shotgun', auto: false, sound: 'shotgunBlast', capacity: 7 },
    grenade: { name: 'G.LAUNCHER', damage: 60, range: 300, fireRate: 40, spread: false, ammoKey: 'grenade', auto: false, sound: 'grenadeExplode', capacity: 6 },
    magnum: { name: 'MAGNUM', damage: 80, range: 400, fireRate: 25, spread: false, ammoKey: 'magnum', auto: false, sound: 'magnumShot', capacity: 6 },
    rocket: { name: 'ROCKET', damage: 999, range: 500, fireRate: 60, spread: false, ammoKey: 'rocket', auto: false, sound: 'rocketLaunch', capacity: 1 }
};

// ---- PLAYER ----
class Player {
    constructor(x, y) {
        this.x = x; this.y = y; this.w = 40; this.h = 40;
        this.vx = 0; this.vy = 0;
        this.facingRight = true;
        this.speed = 2.5; this.runSpeed = 4;
        this.grounded = false;
        this.state = 'idle'; // idle, walk, run, aim, shoot, hurt, crouch, dead
        this.hurtTimer = 0;
        this.shootTimer = 0;
        this.stepTimer = 0;

        // Health
        this.hp = 100; this.maxHp = 100;
        this.poisoned = false;
        this.invulnerable = 0;
        this.immortalMode = false; // Testing mode: cannot be killed

        // Weapons & inventory
        this.weapons = ['knife', 'handgun'];
        this.currentWeapon = 1;
        this.ammo = { handgun: 15, shotgun: 0, grenade: 0, magnum: 0, rocket: 0 };
        this.ammoReserve = { handgun: 30, shotgun: 0, grenade: 0, magnum: 0, rocket: 0 };

        // Inventory (8 slots for Jill)
        this.inventory = [];
        this.maxSlots = 8;
        this.keyItems = [];

        // DOM
        this.el = null;
        this.sprite = null;
    }

    get weapon() { return WEAPONS[this.weapons[this.currentWeapon]]; }
    get weaponId() { return this.weapons[this.currentWeapon]; }

    get healthStatus() {
        if (this.poisoned) return 'poison';
        if (this.hp > 70) return 'fine';
        if (this.hp > 40) return 'caution-y';
        if (this.hp > 15) return 'caution-o';
        return 'danger';
    }

    spawn(world) {
        this.el = document.createElement('div');
        this.el.className = 'entity entity-player';
        this.el.style.width = this.w + 'px';
        this.el.style.height = this.h + 'px';
        this.updateSprite();
        world.appendChild(this.el);
    }

    updateSprite() {
        const s = Sprites.jill(this.state === 'crouch' ? 'crouch' :
            this.state === 'aim' || this.state === 'shoot' ? 'aim' :
                this.state === 'hurt' ? 'hurt' :
                    this.state === 'walk' || this.state === 'run' ? 'walk' : 'idle',
            this.facingRight);
        if (this.sprite) this.el.removeChild(this.sprite);
        this.sprite = s;
        this.el.appendChild(s);
    }

    update() {
        if (this.state === 'dead') return;
        if (this.invulnerable > 0) this.invulnerable--;
        if (this.hurtTimer > 0) { this.hurtTimer--; if (this.hurtTimer === 0) this.state = 'idle'; return; }
        if (this.shootTimer > 0) this.shootTimer--;

        // Poison damage
        if (this.poisoned && Game.frameCount % 120 === 0) {
            this.takeDamage(2, false);
        }

        let prevState = this.state;
        let moving = false;
        const running = Engine.isDown(['ShiftLeft', 'ShiftRight']);
        const spd = running ? this.runSpeed : this.speed;
        const crouching = Engine.isDown(['KeyS', 'ArrowDown']);
        const shootPressed = Engine.wasPressed(['KeyJ', 'KeyZ']);

        if (crouching && this.grounded) {
            this.state = 'crouch';
            this.vx = 0;
        } else if (shootPressed || Engine.isDown(['KeyJ', 'KeyZ'])) {
            this.state = 'aim';
            this.vx = 0;
            // Fire on press
            if (shootPressed && this.shootTimer <= 0) {
                this.shoot();
            }
        } else {
            if (Engine.isDown(['KeyA', 'ArrowLeft'])) {
                this.vx = -spd; this.facingRight = false; moving = true;
            } else if (Engine.isDown(['KeyD', 'ArrowRight'])) {
                this.vx = spd; this.facingRight = true; moving = true;
            } else {
                this.vx = 0;
            }
            this.state = moving ? (running ? 'run' : 'walk') : 'idle';
        }

        // Jump
        if (Engine.wasPressed(['Space']) && this.grounded && this.state !== 'crouch') {
            this.vy = -8;
            this.grounded = false;
        }

        // Weapon switch
        if (Engine.wasPressed(['KeyQ'])) this.switchWeapon(-1);
        if (Engine.wasPressed(['KeyE'])) this.switchWeapon(1);

        // Reload
        if (Engine.wasPressed(['KeyR'])) this.reload();

        // Physics
        this.x += this.vx;
        this.vy += Engine.GRAVITY;
        this.y += this.vy;

        // Ground collision
        if (this.y + this.h >= Engine.GROUND_Y) {
            this.y = Engine.GROUND_Y - this.h;
            this.vy = 0;
            this.grounded = true;
        }

        // Section boundary clamping — player can't walk past section edges
        if (Game.currentLevel && Game.currentSection) {
            const sec = Game.currentLevel.sections[Game.currentSection];
            if (sec) {
                this.x = Math.max(sec.start + 5, Math.min(this.x, sec.end - this.w - 5));
            }
        } else {
            this.x = Math.max(0, Math.min(this.x, (Game.currentLevel ? Game.currentLevel.width : 3000) - this.w));
        }

        // Platform collision
        if (Game.currentLevel) {
            Game.currentLevel.platforms.forEach(p => {
                if (this.vy >= 0 && this.x + this.w > p.x && this.x < p.x + p.w &&
                    this.y + this.h >= p.y && this.y + this.h <= p.y + 10) {
                    this.y = p.y - this.h;
                    this.vy = 0;
                    this.grounded = true;
                }
            });
        }

        // Footstep sounds
        if (moving && this.grounded) {
            this.stepTimer++;
            if (this.stepTimer % (running ? 12 : 18) === 0) {
                AudioEngine.footstepWood();
            }
        }

        // Update sprite if state changed
        if (this.state !== prevState) this.updateSprite();
    }

    shoot() {
        const w = this.weapon;
        if (!w) return;

        // Check ammo
        if (w.ammoKey) {
            if (this.ammo[w.ammoKey] <= 0) {
                AudioEngine.emptyClick();
                return;
            }
            this.ammo[w.ammoKey]--;
            this.updateHUD();
        }

        this.shootTimer = w.fireRate;
        this.state = 'shoot';

        // Sound
        AudioEngine[w.sound]();

        // Muzzle flash
        if (w.ammoKey) {
            const fx = this.facingRight ? this.x + this.w + 5 : this.x - 20;
            const fy = this.state === 'crouch' ? this.y + 22 : this.y + 12;
            const mf = document.createElement('div');
            mf.className = 'muzzle-flash';
            mf.style.cssText = `left:${fx - Engine.camera.x}px;top:${fy}px;`;
            if (!this.facingRight) mf.style.transform = 'scaleX(-1)';
            mf.appendChild(Sprites.muzzleFlash());
            document.getElementById('game-world').appendChild(mf);
            setTimeout(() => mf.remove(), 80);
            Engine.shakeScreen(50);
        }

        // Damage enemies in range
        const dir = this.facingRight ? 1 : -1;
        const startX = this.facingRight ? this.x + this.w : this.x;
        const hitY = this.state === 'crouch' ? this.y + 20 : this.y + 10;

        Game.enemies.forEach(enemy => {
            if (enemy.dead) return;
            const ex = enemy.x + enemy.w / 2;
            const ey = enemy.y + enemy.h / 2;
            const dx = ex - startX;

            if (dir === 1 && dx > 0 && dx < w.range || dir === -1 && dx < 0 && Math.abs(dx) < w.range) {
                const dy = Math.abs(ey - hitY);
                const hitThreshold = enemy.type === 'crow' ? 200 : (w.spread ? 50 : 30);
                if (dy < hitThreshold) {
                    const dmg = w.spread ? w.damage * (1 - Math.abs(dx) / w.range * 0.5) : w.damage;
                    enemy.takeDamage(dmg);
                    Engine.spawnBlood(enemy.x + enemy.w / 2, enemy.y + enemy.h / 3, w.spread ? 8 : 4);
                    AudioEngine.hit();
                }
            }
        });
    }

    switchWeapon(dir) {
        this.currentWeapon = (this.currentWeapon + dir + this.weapons.length) % this.weapons.length;
        this.updateHUD();
        this.updateSprite();
    }

    takeDamage(amount, knockback = true) {
        if (this.invulnerable > 0 || this.state === 'dead' || this.immortalMode) return;
        this.hp = Math.max(0, this.hp - amount);
        this.invulnerable = 30;
        this.hurtTimer = 15;
        this.state = 'hurt';
        this.updateSprite();
        AudioEngine.playerHurt();
        Engine.shakeScreen(100);

        if (knockback) {
            this.vx = this.facingRight ? -3 : 3;
            this.vy = -2;
        }

        // Damage overlay
        const intensity = 1 - (this.hp / this.maxHp);
        Engine.setDamageOverlay(intensity * 0.5);

        this.updateHUD();

        if (this.hp <= 0) {
            this.state = 'dead';
            this.updateSprite();
            Game.gameOver();
        }
    }

    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
        Engine.setDamageOverlay((1 - this.hp / this.maxHp) * 0.5);
        this.updateHUD();
    }

    curePoison() {
        this.poisoned = false;
        this.updateHUD();
    }

    addAmmo(type, amount) {
        this.ammoReserve[type] = (this.ammoReserve[type] || 0) + amount;
        AudioEngine.itemPickup();
        this.updateHUD();
    }

    reload() {
        const w = this.weapon;
        if (!w.ammoKey) return;

        const capacity = w.capacity || 15;
        if (this.ammo[w.ammoKey] >= capacity) return;

        const available = this.ammoReserve[w.ammoKey];
        if (available <= 0) return;

        const transfer = Math.min(available, capacity - this.ammo[w.ammoKey]);
        this.ammo[w.ammoKey] += transfer;
        this.ammoReserve[w.ammoKey] -= transfer;

        AudioEngine.itemPickup(); // simple tick sound for reload
        this.updateHUD();
    }

    updateHUD() {
        const status = document.getElementById('health-status');
        status.textContent = this.healthStatus === 'poison' ? 'POISON' :
            this.healthStatus === 'fine' ? 'FINE' :
                this.healthStatus === 'danger' ? 'DANGER' : 'CAUTION';
        status.className = `health-${this.healthStatus}`;

        document.getElementById('weapon-name').textContent = this.weapon.name;
        const ak = this.weapon.ammoKey;
        document.getElementById('ammo-current').textContent = ak ? this.ammo[ak] : '∞';
        document.getElementById('ammo-reserve').textContent = ak ? this.ammoReserve[ak] : '';
    }

    render() {
        if (!this.el) return;
        this.el.style.left = (this.x - Engine.camera.x) + 'px';
        this.el.style.top = this.y + 'px';
        if (this.invulnerable > 0 && this.invulnerable % 4 < 2) {
            this.el.style.opacity = '0.5';
        } else {
            this.el.style.opacity = '1';
        }
    }
}

// ---- ENEMY BASE ----
class Enemy {
    constructor(x, y, w, h, type) {
        this.x = x; this.y = y; this.w = w; this.h = h;
        this.type = type;
        this.vx = 0; this.vy = 0;
        this.hp = 30;
        this.damage = 10;
        this.speed = 0.5;
        this.dead = false;
        this.state = 'idle';
        this.attackTimer = 0;
        this.attackCooldown = 60;
        this.groanTimer = 0;
        this.facingRight = false;
        this.activated = false;
        this.activateRange = 350;
        this.el = null;
        this.sprite = null;
        this.deathTimer = 0;
        this.section = null; // assigned in startLevel based on spawn position
    }

    spawn(world) {
        this.el = document.createElement('div');
        this.el.className = 'entity entity-enemy';
        this.el.style.width = this.w + 'px';
        this.el.style.height = this.h + 'px';
        this.updateSprite();
        world.appendChild(this.el);
    }

    updateSprite() { /* Override per enemy type */ }

    activate(player) {
        const dist = Engine.distBetween(this, player);
        if (dist < this.activateRange) this.activated = true;
    }

    update(player) {
        if (this.dead) { this.deathTimer++; return; }
        this.activate(player);
        if (!this.activated) return;
        if (this.attackTimer > 0) this.attackTimer--;
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.el) this.el.classList.add('entity-flash');
        setTimeout(() => { if (this.el) this.el.classList.remove('entity-flash'); }, 300);
        if (this.hp <= 0) this.die();
    }

    die() {
        this.dead = true;
        this.state = 'dead';
        if (this.el) this.el.style.opacity = '0.4';
        if (this.el) this.el.style.transform = 'scaleY(0.3) translateY(30px)';
    }

    render() {
        if (!this.el) return;
        this.el.style.left = (this.x - Engine.camera.x) + 'px';
        this.el.style.top = this.y + 'px';
        if (this.dead && this.deathTimer > 180) {
            this.el.style.opacity = Math.max(0, 0.4 - (this.deathTimer - 180) / 100);
        }
    }
}

// ---- ZOMBIE ----
class Zombie extends Enemy {
    constructor(x, y, variant = 0) {
        super(x, y, 40, 40, 'zombie');
        this.hp = 30 + Math.random() * 20;
        this.damage = 10;
        this.speed = 0.3 + Math.random() * 0.3;
        this.variant = variant;
        this.grabbing = false;
        this.grabTimer = 0;
    }

    updateSprite() {
        if (this.sprite) this.el.removeChild(this.sprite);
        this.sprite = Sprites.zombie(this.variant);
        if (!this.facingRight) this.sprite.style.transform = 'scaleX(-1)';
        this.el.appendChild(this.sprite);
    }

    update(player) {
        super.update(player);
        if (this.dead || !this.activated) return;

        // Groan sound
        this.groanTimer++;
        if (this.groanTimer % 180 === 0 && Math.random() > 0.5) AudioEngine.zombieGroan();

        // Move toward player
        const dx = player.x - this.x;
        const dist = Math.abs(dx);
        this.facingRight = dx > 0;

        if (this.grabbing) {
            this.grabTimer++;
            if (this.grabTimer % 30 === 0) {
                player.takeDamage(this.damage, false);
            }
            if (this.grabTimer > 60 || player.hp <= 0) {
                this.grabbing = false;
                this.grabTimer = 0;
            }
            return;
        }

        if (dist > 30) {
            this.vx = this.facingRight ? this.speed : -this.speed;
            this.state = 'walk';
        } else {
            this.vx = 0;
            this.state = 'idle';
            // Attack
            if (this.attackTimer <= 0 && dist < 40) {
                this.attack(player);
            }
        }

        this.x += this.vx;
        this.vy += Engine.GRAVITY;
        this.y += this.vy;
        if (this.y + this.h >= Engine.GROUND_Y) { this.y = Engine.GROUND_Y - this.h; this.vy = 0; }

        // Section boundary clamping — stay in home section
        if (this.section && Game.currentLevel) {
            const sec = Game.currentLevel.sections[this.section];
            if (sec) this.x = Math.max(sec.start + 5, Math.min(this.x, sec.end - this.w - 5));
        }

        if (!this.facingRight && this.sprite) this.sprite.style.transform = 'scaleX(-1)';
        else if (this.sprite) this.sprite.style.transform = '';
    }

    attack(player) {
        this.attackTimer = this.attackCooldown;
        if (Math.random() > 0.5) {
            // Grab attack
            this.grabbing = true;
            this.grabTimer = 0;
        } else {
            player.takeDamage(this.damage);
        }
    }
}

// ---- CERBERUS (Zombie Dog) ----
class Cerberus extends Enemy {
    constructor(x, y) {
        super(x, y, 50, 30, 'cerberus');
        this.hp = 15;
        this.damage = 12;
        this.speed = 3;
        this.activateRange = 400;
        // State machine: 'charging', 'lunging', 'retreating'
        this.aiState = 'charging';
        this.lungeTimer = 0;
        this.retreatTimer = 0;
        this.retreatDir = 0;
        this.hasHitThisLunge = false;
    }

    updateSprite() {
        if (this.sprite) this.el.removeChild(this.sprite);
        this.sprite = Sprites.cerberus();
        if (this.facingRight) this.sprite.style.transform = 'scaleX(-1)';
        this.el.appendChild(this.sprite);
    }

    update(player) {
        super.update(player);
        if (this.dead || !this.activated) return;

        const dx = player.x - this.x;
        const dist = Math.abs(dx);
        const toPlayer = dx > 0;

        switch (this.aiState) {
            // ---- CHARGE toward player ----
            case 'charging':
                this.facingRight = toPlayer;
                if (dist > 80) {
                    // Run toward player
                    this.x += toPlayer ? this.speed : -this.speed;
                }
                // Close enough — initiate jump-lunge attack
                if (dist < 120 && this.attackTimer <= 0) {
                    this.aiState = 'lunging';
                    this.lungeTimer = 0;
                    this.hasHitThisLunge = false;
                    this.vy = -7; // jump up
                    this.facingRight = toPlayer;
                    AudioEngine.dogSnarl();
                }
                break;

            // ---- LUNGE (airborne attack) ----
            case 'lunging':
                this.lungeTimer++;
                this.x += this.facingRight ? 5.5 : -5.5;

                // Hit check — only damage once per lunge
                if (!this.hasHitThisLunge && Engine.rectsOverlap(this, player)) {
                    player.takeDamage(this.damage);
                    this.hasHitThisLunge = true;
                    this.attackTimer = 30;
                    AudioEngine.dogBark();
                }

                // End lunge when landing or after max time
                if (this.lungeTimer > 24 || (this.lungeTimer > 5 && this.y + this.h >= Engine.GROUND_Y)) {
                    // Transition to retreat
                    this.aiState = 'retreating';
                    this.retreatTimer = 30 + Math.floor(Math.random() * 20);
                    // Retreat away from player
                    this.retreatDir = toPlayer ? -1 : 1;
                }
                break;

            // ---- RETREAT (back off after attack) ----
            case 'retreating':
                this.retreatTimer--;
                this.facingRight = toPlayer; // keep facing the player while backing off
                this.x += this.retreatDir * this.speed * 0.8;

                // Done retreating — charge again
                if (this.retreatTimer <= 0) {
                    this.aiState = 'charging';
                }
                break;
        }

        // Physics
        this.vy += Engine.GRAVITY;
        this.y += this.vy;
        if (this.y + this.h >= Engine.GROUND_Y) { this.y = Engine.GROUND_Y - this.h; this.vy = 0; }

        // Section boundary clamping — stay in home section
        if (this.section && Game.currentLevel) {
            const sec = Game.currentLevel.sections[this.section];
            if (sec) this.x = Math.max(sec.start + 5, Math.min(this.x, sec.end - this.w - 5));
        }

        if (this.facingRight && this.sprite) this.sprite.style.transform = 'scaleX(-1)';
        else if (this.sprite) this.sprite.style.transform = '';
    }
}

// ---- CROW ----
class Crow extends Enemy {
    constructor(x, y) {
        super(x, y, 20, 16, 'crow');
        this.hp = 3;
        this.damage = 3;
        this.speed = 2;
        this.activateRange = 250;
        this.baseY = y;
        this.phase = Math.random() * Math.PI * 2;
        this.diving = false;
    }

    updateSprite() {
        if (this.sprite) this.el.removeChild(this.sprite);
        this.sprite = Sprites.crow();
        this.el.appendChild(this.sprite);
    }

    update(player) {
        super.update(player);
        if (this.dead || !this.activated) return;

        this.phase += 0.05;
        const dx = player.x - this.x;

        if (!this.diving) {
            // Circle above
            this.y = this.baseY + Math.sin(this.phase) * 20;
            this.x += (dx > 0 ? 0.5 : -0.5);

            // Occasionally dive
            if (Math.random() > 0.99 && Math.abs(dx) < 150) {
                this.diving = true;
                AudioEngine.crowCaw();
            }
        } else {
            // Dive toward player
            this.x += (dx > 0 ? 3 : -3);
            this.y += 3;

            if (Engine.rectsOverlap(this, player) && this.attackTimer <= 0) {
                player.takeDamage(this.damage);
                this.attackTimer = 60;
            }

            if (this.y > Engine.GROUND_Y - 50) {
                this.diving = false;
                this.baseY = Engine.GROUND_Y - 100 - Math.random() * 100;
                this.y = this.baseY;
            }
        }

        // Section boundary clamping — stay in home section
        if (this.section && Game.currentLevel) {
            const sec = Game.currentLevel.sections[this.section];
            if (sec) this.x = Math.max(sec.start + 5, Math.min(this.x, sec.end - this.w - 5));
        }
    }
}

// ---- HUNTER ----
class Hunter extends Enemy {
    constructor(x, y) {
        super(x, y, 44, 44, 'hunter');
        this.hp = 80;
        this.damage = 25;
        this.speed = 2;
        this.activateRange = 350;
        this.leaping = false;
        this.leapTimer = 0;
    }

    updateSprite() {
        if (this.sprite) this.el.removeChild(this.sprite);
        this.sprite = Sprites.hunter();
        if (!this.facingRight) this.sprite.style.transform = 'scaleX(-1)';
        this.el.appendChild(this.sprite);
    }

    update(player) {
        super.update(player);
        if (this.dead || !this.activated) return;

        const dx = player.x - this.x;
        const dist = Math.abs(dx);
        this.facingRight = dx > 0;

        // Chirp
        if (Game.frameCount % 120 === 0 && Math.random() > 0.6) AudioEngine.hunterChirp();

        if (this.leaping) {
            this.leapTimer++;
            this.x += this.facingRight ? 5 : -5;
            if (this.leapTimer > 15) {
                this.leaping = false;
                this.leapTimer = 0;
            }
            if (Engine.rectsOverlap(this, player) && this.attackTimer <= 0) {
                // Decapitation check at low health
                if (player.healthStatus === 'danger') {
                    player.takeDamage(999); // Instant kill!
                } else {
                    player.takeDamage(this.damage);
                }
                this.attackTimer = 60;
            }
        } else if (dist > 40) {
            this.x += this.facingRight ? this.speed : -this.speed;
            // Leap attack
            if (dist < 200 && dist > 80 && this.attackTimer <= 0 && Math.random() > 0.97) {
                this.leaping = true;
                this.vy = -7;
                AudioEngine.hunterChirp();
            }
        } else if (this.attackTimer <= 0) {
            if (player.healthStatus === 'danger') {
                player.takeDamage(999);
            } else {
                player.takeDamage(this.damage);
            }
            this.attackTimer = 50;
        }

        this.vy += Engine.GRAVITY;
        this.y += this.vy;
        if (this.y + this.h >= Engine.GROUND_Y) { this.y = Engine.GROUND_Y - this.h; this.vy = 0; }

        // Section boundary clamping — stay in home section
        if (this.section && Game.currentLevel) {
            const sec = Game.currentLevel.sections[this.section];
            if (sec) this.x = Math.max(sec.start + 5, Math.min(this.x, sec.end - this.w - 5));
        }

        if (!this.facingRight && this.sprite) this.sprite.style.transform = 'scaleX(-1)';
        else if (this.sprite) this.sprite.style.transform = '';
    }
}

// ---- ITEM PICKUP ----
class ItemPickup {
    constructor(x, y, type, data = {}) {
        this.x = x; this.y = y; this.w = 16; this.h = 16;
        this.type = type; // 'greenHerb', 'handgunAmmo', 'shotgunAmmo', 'firstAidSpray', 'key', etc.
        this.data = data; // { amount, keyName, color, etc. }
        this.collected = false;
        this.el = null;
    }

    spawn(world) {
        this.el = document.createElement('div');
        this.el.className = 'entity entity-item item-glow';
        this.el.style.width = this.w + 'px';
        this.el.style.height = this.h + 'px';
        const s = this.getSprite();
        if (s) this.el.appendChild(s);
        world.appendChild(this.el);
    }

    getSprite() {
        switch (this.type) {
            case 'greenHerb': return Sprites.greenHerb();
            case 'redHerb': return Sprites.redHerb();
            case 'blueHerb': return Sprites.blueHerb();
            case 'handgunAmmo': return Sprites.handgunAmmo();
            case 'shotgunAmmo': return Sprites.shotgunAmmo();
            case 'firstAidSpray': return Sprites.firstAidSpray();
            case 'inkRibbon': return Sprites.inkRibbon();
            case 'key': return Sprites.key(this.data.color || '#c9a84c');
            default: return null;
        }
    }

    update(player) {
        if (this.collected) return;

        const near = Engine.distBetween(this, player) < 40;

        // Show interact prompt
        if (near && !this.el.querySelector('.interact-prompt')) {
            const p = document.createElement('div');
            p.className = 'interact-prompt';
            p.textContent = '[X] PICK UP';
            this.el.appendChild(p);
        } else if (!near) {
            const p = this.el.querySelector('.interact-prompt');
            if (p) p.remove();
        }

        if (near && Engine.wasPressed(['KeyK', 'KeyX'])) {
            this.collect(player);
        }
    }

    collect(player) {
        this.collected = true;
        AudioEngine.itemPickup();
        if (this.el) {
            this.el.style.transition = 'opacity 0.3s, transform 0.3s';
            this.el.style.opacity = '0';
            this.el.style.transform = 'translateY(-20px)';
            setTimeout(() => { if (this.el) this.el.remove(); }, 300);
        }

        switch (this.type) {
            case 'greenHerb':
                player.heal(25);
                Game.showMessage('Picked up Green Herb. Health restored.');
                break;
            case 'redHerb':
                Game.showMessage('Picked up Red Herb. Combine with Green Herb for full heal.');
                break;
            case 'blueHerb':
                player.curePoison();
                player.heal(5);
                Game.showMessage('Picked up Blue Herb. Poison cured.');
                break;
            case 'handgunAmmo':
                player.addAmmo('handgun', this.data.amount || 15);
                Game.showMessage(`Found Handgun Ammo (${this.data.amount || 15} rounds)`);
                break;
            case 'shotgunAmmo':
                player.addAmmo('shotgun', this.data.amount || 7);
                Game.showMessage(`Found Shotgun Shells (${this.data.amount || 7})`);
                break;
            case 'firstAidSpray':
                player.heal(100);
                Game.showMessage('Used First Aid Spray. Fully healed!');
                break;
            case 'key':
                player.keyItems.push(this.data.keyName || 'Unknown Key');
                Game.showMessage(`Found ${this.data.keyName || 'a Key'}`);
                break;
            default:
                Game.showMessage(`Picked up ${this.type}`);
        }
    }

    render() {
        if (!this.el || this.collected) return;
        this.el.style.left = (this.x - Engine.camera.x) + 'px';
        this.el.style.top = this.y + 'px';
    }
}

// ---- INTERACTIVE OBJECT ----
class InteractiveObject {
    constructor(x, y, w, h, type, data = {}) {
        this.x = x; this.y = y; this.w = w; this.h = h;
        this.type = type;
        this.data = data;
        this.used = false;
        this.el = null;
    }

    spawn(world) {
        this.el = document.createElement('div');
        this.el.className = 'entity';
        this.el.style.width = this.w + 'px';
        this.el.style.height = this.h + 'px';
        this.el.style.zIndex = '12';
        const s = this.getSprite();
        if (s) this.el.appendChild(s);
        world.appendChild(this.el);
    }

    getSprite() {
        switch (this.type) {
            case 'typewriter': return Sprites.typewriterObj();
            case 'itemBox': return Sprites.itemBox();
            case 'door': return Sprites.doorSVG(this.data.locked);
            case 'window': return Sprites.windowBG();
            default: return null;
        }
    }

    update(player) {
        if (this.used) return;

        // Suppress interactions during combat
        const inCombat = Game.enemies.some(e => !e.dead && e.activated && e.el && e.section === Game.currentSection);
        const near = Engine.distBetween(this, player) < 50;

        if (near && !inCombat && !this.el.querySelector('.interact-prompt')) {
            const p = document.createElement('div');
            p.className = 'interact-prompt';
            p.textContent = this.type === 'door' ? '[X] OPEN' :
                this.type === 'typewriter' ? '[X] SAVE' :
                    this.type === 'itemBox' ? '[X] OPEN' :
                        this.type === 'window' ? '[X] LOOK' : '[X] USE';
            this.el.appendChild(p);
        } else if (!near || inCombat) {
            const p = this.el.querySelector('.interact-prompt');
            if (p) p.remove();
        }

        if (near && !inCombat && Engine.wasPressed(['KeyK', 'KeyX'])) {
            this.interact(player);
        }
    }

    interact(player) {
        switch (this.type) {
            case 'typewriter':
                Game.showDialogue('SYSTEM', 'Game saved at typewriter.');
                AudioEngine.typewriter();
                break;
            case 'itemBox':
                Game.showDialogue('SYSTEM', 'Item Box — Your items are stored safely.');
                break;
            case 'door':
                if (this.data.locked) {
                    const needKey = this.data.requiredKey;
                    if (player.keyItems.includes(needKey)) {
                        this.data.locked = false;
                        Game.showMessage(`Used ${needKey}. Door unlocked.`);
                        AudioEngine.doorOpen();
                    } else {
                        Game.showMessage(`The door is locked. You need the ${needKey}.`);
                    }
                } else {
                    Game.doorTransition(this.data.targetSection);
                }
                break;
            case 'window':
                Game.showDialogue('', 'A tall window. Moonlight casts pale shadows across the corridor. Something feels wrong...');
                break;
        }
    }

    render() {
        if (!this.el) return;
        this.el.style.left = (this.x - Engine.camera.x) + 'px';
        this.el.style.top = this.y + 'px';
    }
}
