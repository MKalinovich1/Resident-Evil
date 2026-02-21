// ============================================
// LEVELS — Level data definitions
// ============================================

const Levels = {
    // ---- LEVEL 1: MANSION GROUND FLOOR ----
    mansion1F: {
        name: 'SPENCER MANSION — GROUND FLOOR',
        width: 5000,
        groundY: 440,
        bgColor: '#1a120b',

        // Background layers for parallax
        bgLayers: [
            { color: '#0d0805', speed: 0.1 }, // deep bg
            { color: '#1a120b', speed: 0.3 }, // mid bg
            { color: '#2d1f10', speed: 0.6 }  // near bg
        ],

        // Platforms / elevated surfaces
        platforms: [
            { x: 400, y: 380, w: 120, h: 10 },   // shelf
            { x: 1200, y: 360, w: 160, h: 10 },  // balcony
            { x: 2600, y: 350, w: 200, h: 10 },  // mezzanine
            { x: 3800, y: 380, w: 100, h: 10 }   // lab shelf
        ],

        // Named sections within the level (for door transitions)
        sections: {
            mainHall: { start: 0, end: 600 },
            kennethHall: { start: 600, end: 1100 },
            diningRoom: { start: 1100, end: 1700 },
            lCorridor: { start: 1700, end: 2400 },
            mirrorRoom: { start: 2400, end: 3000 },
            pianoRoom: { start: 3000, end: 3600 },
            galleryHall: { start: 3600, end: 4200 },
            graveyard: { start: 4200, end: 5000 }
        },

        // Enemies
        enemySpawns: [
            // Kenneth's corridor — first zombie (scripted reveal)
            { type: 'zombie', x: 850, y: 400, variant: 0, scripted: 'firstZombie' },
            // Dining room zombies
            { type: 'zombie', x: 1300, y: 400, variant: 1 },
            { type: 'zombie', x: 1500, y: 400, variant: 2 },
            // L-Corridor — dogs through windows (scripted)
            { type: 'cerberus', x: 1900, y: 410, scripted: 'dogsWindow' },
            { type: 'cerberus', x: 1950, y: 410, scripted: 'dogsWindow' },
            // More corridor zombies
            { type: 'zombie', x: 2700, y: 400, variant: 0 },
            { type: 'zombie', x: 2900, y: 400, variant: 1 },
            // Piano room area
            { type: 'zombie', x: 3200, y: 400, variant: 2 },
            // Gallery
            { type: 'zombie', x: 3900, y: 400, variant: 0 },
            { type: 'zombie', x: 4100, y: 400, variant: 1 },
            // Graveyard crows
            { type: 'crow', x: 4400, y: 280 },
            { type: 'crow', x: 4500, y: 260 },
            { type: 'crow', x: 4600, y: 290 },
        ],

        // Items
        itemSpawns: [
            // Main Hall — safe room supplies
            { type: 'handgunAmmo', x: 200, y: 425, data: { amount: 15 } },
            { type: 'inkRibbon', x: 250, y: 425 },
            { type: 'greenHerb', x: 300, y: 425 },
            // Kenneth's corridor
            { type: 'handgunAmmo', x: 900, y: 425, data: { amount: 15 } },
            // Dining room
            { type: 'greenHerb', x: 1400, y: 425 },
            { type: 'handgunAmmo', x: 1600, y: 425, data: { amount: 15 } },
            // After L-corridor
            { type: 'shotgunAmmo', x: 2200, y: 425, data: { amount: 7 } },
            { type: 'greenHerb', x: 2300, y: 425 },
            // Mirror room (shotgun!)
            { type: 'firstAidSpray', x: 2800, y: 425 },
            // Piano room
            { type: 'handgunAmmo', x: 3400, y: 425, data: { amount: 15 } },
            // Gallery
            { type: 'blueHerb', x: 4000, y: 425 },
            // Graveyard
            { type: 'greenHerb', x: 4500, y: 425 },
            { type: 'handgunAmmo', x: 4700, y: 425, data: { amount: 15 } },
            // Key items
            { type: 'key', x: 1650, y: 425, data: { keyName: 'Sword Key', color: '#c9a84c' } },
        ],

        // Interactive objects
        objects: [
            // Main Hall — typewriter and item box (safe room)
            { type: 'typewriter', x: 100, y: 420, w: 28, h: 20 },
            { type: 'itemBox', x: 150, y: 416, w: 30, h: 24 },
            // Forward Doors (to next section)
            { type: 'door', x: 580, y: 390, w: 24, h: 50, data: { locked: false, targetSection: 'kennethHall' } },
            { type: 'door', x: 1080, y: 390, w: 24, h: 50, data: { locked: false, targetSection: 'diningRoom' } },
            { type: 'door', x: 1680, y: 390, w: 24, h: 50, data: { locked: false, targetSection: 'lCorridor' } },
            { type: 'door', x: 2380, y: 390, w: 24, h: 50, data: { locked: false, targetSection: 'mirrorRoom' } },
            { type: 'door', x: 2980, y: 390, w: 24, h: 50, data: { locked: true, requiredKey: 'Sword Key', targetSection: 'pianoRoom' } },
            { type: 'door', x: 3580, y: 390, w: 24, h: 50, data: { locked: false, targetSection: 'galleryHall' } },
            { type: 'door', x: 4180, y: 390, w: 24, h: 50, data: { locked: false, targetSection: 'graveyard' } },

            // Backward Doors (return to previous section)
            { type: 'door', x: 620, y: 390, w: 24, h: 50, data: { locked: false, targetSection: 'mainHall' } },
            { type: 'door', x: 1120, y: 390, w: 24, h: 50, data: { locked: false, targetSection: 'kennethHall' } },
            { type: 'door', x: 1720, y: 390, w: 24, h: 50, data: { locked: false, targetSection: 'diningRoom' } },
            { type: 'door', x: 2420, y: 390, w: 24, h: 50, data: { locked: false, targetSection: 'lCorridor' } },
            { type: 'door', x: 3020, y: 390, w: 24, h: 50, data: { locked: false, targetSection: 'mirrorRoom' } },
            { type: 'door', x: 3620, y: 390, w: 24, h: 50, data: { locked: false, targetSection: 'pianoRoom' } },
            { type: 'door', x: 4220, y: 390, w: 24, h: 50, data: { locked: false, targetSection: 'galleryHall' } },
            // Windows for L-corridor (dogs crash through)
            { type: 'window', x: 1850, y: 360, w: 30, h: 60, data: { breakable: true, triggerId: 'dogsWindow' } },
            { type: 'window', x: 1950, y: 360, w: 30, h: 60, data: { breakable: true, triggerId: 'dogsWindow' } },
        ],

        // Scripted events
        triggers: [
            {
                id: 'firstZombie',
                x: 750, w: 50,
                triggered: false,
                action: 'firstZombieReveal'
            },
            {
                id: 'dogsWindow',
                x: 1850, w: 100,
                triggered: false,
                action: 'dogsThruWindows'
            },
            {
                id: 'shotgunTrap',
                x: 2550, w: 50,
                triggered: false,
                action: 'shotgunTrapSequence'
            },
            {
                id: 'barryIntro',
                x: 100, w: 100,
                triggered: false,
                action: 'barryDialogue'
            }
        ],

        // Background decorations per section
        decorations: [
            // Main Hall
            { x: 50, y: 300, w: 500, type: 'mainHall' },
            // Kenneth's hall
            { x: 650, y: 300, w: 400, type: 'darkCorridor' },
            // Dining room
            { x: 1100, y: 300, w: 600, type: 'diningRoom' },
            // L-Corridor
            { x: 1700, y: 300, w: 700, type: 'corridor' },
            // Mirror room
            { x: 2400, y: 300, w: 600, type: 'mirrorRoom' },
            // Piano room
            { x: 3000, y: 300, w: 600, type: 'pianoRoom' },
            // Gallery
            { x: 3600, y: 300, w: 600, type: 'gallery' },
            // Graveyard
            { x: 4200, y: 300, w: 800, type: 'graveyard' }
        ]
    }
};
