# Resident Evil (1996) — Game Design & Mechanics Reference

## Core Design Philosophy

Resident Evil is built on **friction and resource scarcity** as the foundation of horror. Every system works together to make the player feel vulnerable, underprepared, and constantly making difficult decisions.

### The Three Pillars
1. **Exploration** — Navigate a complex, interconnected environment
2. **Puzzle-Solving** — Find and use items to unlock new areas
3. **Combat** — Fight or flee from enemies using limited resources

---

## Health System

### Health States (No Numerical HP Bar)
Instead of a health bar, RE uses a vitals status system:

| Status | Color | Meaning | Effect |
|--------|-------|---------|--------|
| **Fine** | Green | Full or near-full health | Normal movement speed |
| **Caution (Yellow)** | Yellow | Moderate damage taken | Slightly slower movement |
| **Caution (Orange)** | Orange | Significant damage taken | Noticeably slower, character holds side |
| **Danger** | Red | Near death | Very slow movement, limping animation, vulnerable to instant-kill attacks (Hunter decapitation) |
| **Poison** | Purple | Poisoned | Health slowly drains over time until cured with Blue Herb |

### Key Design Insight
The lack of numerical HP creates **anxiety** — the player is never sure exactly how close to death they are. "Caution" could mean one more hit will kill them, or three. This uncertainty is part of the horror.

### Side-Scroller Notes
Consider using a similar non-numerical system: character animation/color changes to indicate health rather than a traditional HP bar. Or use a small, vague blood-splatter screen effect that intensifies with damage.

---

## Movement & Controls

### Tank Controls
- **Up:** Move character forward (in the direction they're facing)
- **Down:** Move character backward
- **Left/Right:** Rotate character in place
- **Run Button:** Hold to run (faster, but noisier — may attract enemies)
- **Aim Button:** Stop in place, raise weapon
- **Fire Button:** Shoot while aiming
- **Action Button:** Open doors, pick up items, interact

### Why Tank Controls Matter for Horror
- Forces **deliberate, slow movement** — you can't quickly dodge
- Makes **aiming stressful** — must stop completely, aim, then fire
- Creates **panic moments** — fumbling with controls while a Hunter charges
- **Every encounter feels dangerous** because escape is difficult

### Side-Scroller Adaptation
In a side-scroller, direct tank controls don't apply. Instead, preserve the feeling through:
- Slightly weighted/deliberate movement (not ultrasnappy platformer controls)
- Aim-lock mechanic (stop moving to shoot precisely)
- Limited dodge ability (not unlimited, maybe a stamina-based roll)
- Slower turning around / weapon switching

---

## Camera System

### Fixed Camera Angles
- Pre-rendered background images with 3D character models composited on top
- Camera positions change as the player moves between zones in each room
- Creates **blind spots** — enemies can be heard but not seen
- Allows for **cinematic framing** — dramatic reveals, creepy compositions
- **Door loading screens** — transition animations of doors opening, building tension between rooms while masking load times

### Horror Through Camera Design
- Corridors shot from the end, so the player walks toward the camera (can't see what's ahead)
- Rooms shot from above, making the player feel watched
- Sudden angle changes disorienting the player

### Side-Scroller Adaptation
In a side-scroller, camera is always following. Instead, create tension through:
- Limiting visibility (fog of war, darkness, flashlight cone)
- No clear view of what's ahead until you walk into it
- Screen scrolling that occasionally reveals enemies at the last second
- Environmental foreground elements that obscure parts of the level

---

## Save System

### Typewriter + Ink Ribbons
- **Typewriters** are physical save points located in Safe Rooms
- **Ink Ribbons** are a consumable item required to save (1 ribbon = 1 save)
- Ink Ribbons take up an inventory slot
- Limited supply throughout the game (~20-30 total)
- Creates a meta-game of deciding WHEN to save

### Design Tension
- "Do I save now and use a ribbon, or push forward and risk losing progress?"
- "Do I carry Ink Ribbons and lose an inventory slot, or leave them in the item box?"
- Dying after a long stretch without saving is devastating — and that threat makes every encounter more meaningful

### Side-Scroller Notes
Options for save system:
- **Checkpoint system** — Save at specific points between levels/areas
- **Limited save items** — Keep the Ink Ribbon concept
- **Typewriter save points** — Visual callback with limited uses per level
- **Autosave at safe rooms** — More modern but less tense

---

## Inventory Management

### Limited Slots
- Chris: 6 slots / Jill: 8 slots
- Each item occupies 1 slot (weapon, ammo stack, herb, key item)
- Weapons + their ammo loaded = 1 slot (ammo in reserves = separate slot)

### Item Boxes
- Interconnected storage containers in Safe Rooms
- Deposit items you don't currently need
- All Item Boxes share the same inventory — put something in one, retrieve from any other

### Strategic Decisions
- "Do I bring the Magnum (rare ammo) or extra healing herbs?"
- "Should I carry this key item through dangerous halls, or come back for it?"
- "Do I mix herbs now to free a slot, or keep them separate for flexibility?"

### Side-Scroller Notes
Preserve limited inventory in side-scroller:
- Maybe 4–6 weapon slots + limited consumable slots
- Force weapon/loadout decisions at Safe Rooms
- Keep ammo as a visible, countable resource
- Quick-use consumable slots (herb, spray)

---

## Door System

### Doors as Level Transitions
- Doors between rooms are accompanied by a **brief loading animation** — a first-person view of the door slowly opening
- These create **micro-tension moments** — the player doesn't know what's on the other side
- Enemies cannot pass through doors — doors are always safe boundaries
- Different door types: wooden doors, locked doors (require keys), metal doors (lab), iron gates

### Side-Scroller Notes
In a side-scroller, doors can serve as section transitions. A brief "door opening" animation with darkened screen can preserve the tension of not knowing what's next.

---

## Auto-Aim System

### How Aiming Works
- When the player holds the aim button, the character automatically targets the nearest enemy
- Player can shift aim up/down for different targets
- **No manual free-aim** — this is intentionally imprecise to increase vulnerability
- Missing shots wastes precious ammo

### Side-Scroller Notes
In a side-scroller, aiming can be:
- Auto-aim toward nearest enemy in firing direction
- Analog stick for angle adjustment
- Or classic left/right + up/down aiming grid

---

## Map System

### In-Game Maps
- Maps are **physical items** found in the game world
- Each floor/area has its own map
- Maps show room layout and indicate:
  - Rooms you've visited (lit up)
  - Rooms with remaining items (different color)
  - Locked doors (marked)
- Maps are accessed via the menu

### Side-Scroller Notes
A simple level map in the menu showing explored areas and remaining pickups would preserve this mechanic.

---

## Ranking / End-Game Grading

### How It Works
The game grades the player's performance at the end:

| Criteria | Better Rank |
|----------|------------|
| Time taken | Faster = better |
| Saves used | Fewer = better |
| Healing items used | Fewer = better |
| First Aid Sprays used | Fewer = better |
| Special weapon used | Not using infinite weapons = better |

### Unlockable Rewards
| Condition | Reward |
|-----------|--------|
| Best ending + fast time | **Infinite Rocket Launcher** |
| Various conditions | Alternate costumes |
| Speed run | Special rankings |

### Side-Scroller Notes
End-of-level grading based on time, hits taken, ammo used, and items found would add replayability.

---

## Difficulty Design (Chris vs. Jill)

| Aspect | Chris (Hard Mode) | Jill (Easy Mode) |
|--------|------------------|-----------------|
| Inventory | 6 slots | 8 slots |
| Starting weapon | Knife only | Beretta handgun |
| Lock mechanic | Must find Small Keys | Has lockpick |
| Exclusive weapon | Flamethrower | Grenade Launcher |
| Partner | Rebecca (heals, piano) | Barry (saves, provides weapons) |
| Lighter | Always carried | Must find or receive |
| Damage taken | Takes more hits before death | Slightly less durable |
| Overall | More challenging, less resources | More forgiving, more tools |

---

## Core Gameplay Loop

```
Explore Room
    ↓
Find enemies? → Fight (spend ammo) OR Flee (save ammo, risk damage)
    ↓
Find items? → Pick up (manage inventory) → May need to visit Item Box
    ↓
Find locked door/puzzle? → Need specific item from elsewhere
    ↓
Backtrack through previously explored areas
    ↓
Areas may have respawned enemies OR new enemies (Hunters)
    ↓
Reach Safe Room → Save? (spend Ink Ribbon) → Manage inventory → Plan next route
    ↓
Repeat
```

This loop creates constant tension because:
- Resources deplete with each loop iteration
- Backtracking means retraversing dangerous areas
- New enemies appear in previously "safe" areas
- The player's capacity is always limited
