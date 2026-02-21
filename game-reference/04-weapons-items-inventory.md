# Resident Evil (1996) — Weapons, Items & Inventory System

## Inventory System

### Core Design
- **Limited slots:** Chris has **6 slots**, Jill has **8 slots**
- Each weapon, ammo stack, key item, and healing item takes **1 slot**
- Forces constant decision-making about what to carry
- No item dropping — items must be stored in Item Boxes or used/discarded

### Item Boxes
- Found in **Safe Rooms** (rooms with typewriters, calming music, no enemies)
- All Item Boxes are **magically connected** — deposit an item in one, retrieve from any other
- Critical for inventory management — swap weapons/keys before heading to new areas
- Safe Room locations: Main Hall, certain save rooms on each floor, guardhouse save rooms, lab save rooms

### Saving System
- Save at **Typewriters** using **Ink Ribbons**
- Ink Ribbons are a limited, consumable resource
- Creates tension: "Should I save now or push forward?"
- Typewriters found in each safe room

---

## Weapons

### Combat Knife
- **Available to:** Both Chris and Jill
- **Type:** Melee
- **Damage:** Very low
- **Ammo:** Infinite (no ammo needed)
- **Notes:** Last-resort weapon. Useful only against downed zombies or very weak enemies. Risky to use as it requires close range.
- **Side-Scroller Notes:** Default/emergency weapon with short range

### Beretta M92FS (Handgun)
- **Available to:** Both (Jill starts with it; Chris finds it early)
- **Type:** Semi-automatic pistol
- **Damage:** Low-moderate
- **Capacity:** 15 rounds per magazine
- **Ammo Found:** Throughout the game — most common ammo type
- **Speed:** Fast rate of fire
- **Notes:** Workhorse weapon. Takes 3–5 shots to kill a zombie. Headshots possible. Reliable but not powerful.
- **Side-Scroller Notes:** The main starting weapon. Medium range, moderate fire rate.

### Remington M870 (Shotgun)
- **Available to:** Both (found in the mansion — shotgun room)
- **Type:** Pump-action shotgun
- **Damage:** High
- **Capacity:** 7 shells
- **Ammo Found:** Moderately common
- **Speed:** Slow (pump between shots)
- **Special:** At point-blank range, can decapitate zombies in one shot. Effective spread damage against groups.
- **Acquisition:** Found on a wall mount. Taking it triggers a **ceiling trap** — Jill is saved by Barry; Chris must swap in a Broken Shotgun to avoid the trap.
- **Side-Scroller Notes:** Powerful close-range weapon with spread. Slow fire rate balances its power.

### Grenade Launcher (Jill only)
- **Available to:** Jill only (exclusive weapon)
- **Type:** Break-action grenade launcher
- **Ammo Types:**
  - **Explosive Rounds** — Good general damage, area effect
  - **Acid Rounds** — Extra effective against Hunters and reptilian enemies
  - **Flame/Incendiary Rounds** — Extra effective against Plant 42, spiders
- **Capacity:** 6 rounds
- **Notes:** Versatile and powerful. The different ammo types add tactical depth.
- **Side-Scroller Notes:** Powerful AoE weapon exclusive to Jill. Different ammo types create variety.

### Flamethrower (Chris only)
- **Available to:** Chris only (exclusive weapon)
- **Type:** Fuel-based flamethrower
- **Damage:** High (continuous)
- **Ammo:** Fuel tank (limited, cannot be refilled)
- **Notes:** Extremely effective against Plant 42 and web spinners. Short range but devastating. Used primarily in guardhouse/cave areas.
- **Side-Scroller Notes:** Short-range continuous damage weapon exclusive to Chris. Fire visual effects.

### Colt Python .357 Magnum
- **Available to:** Both
- **Damage:** Very high
- **Capacity:** 6 rounds
- **Ammo Found:** Very rare
- **Notes:** The most powerful conventional weapon. Can kill most enemies in 1–2 shots. Save for Hunters and bosses. Barry's signature weapon — he gives it to Jill (in Jill's campaign). Chris must find it.
- **Side-Scroller Notes:** Rare, powerful weapon saved for tough enemies and bosses. High damage, slow fire rate, rare ammo.

### Rocket Launcher
- **Available to:** Both (only in the final fight)
- **Type:** Shoulder-fired rocket launcher
- **Damage:** Instant kill (practically)
- **Notes:** Dropped by Brad from the helicopter during the final rooftop Tyrant fight. One shot destroys the Tyrant. Not a regular weapon — scripted moment.
- **Special:** Unlocked with **infinite ammo** as a reward for completing the game under certain conditions (best ending + fast time).
- **Side-Scroller Notes:** Final boss weapon / reward unlock. Massive single-target damage.

### Self-Defense Gun (Jill only, some versions)
- **Type:** Derringer-style small pistol
- **Damage:** High (single shot)
- **Notes:** Emergency defensive weapon used when grabbed by enemies

---

## Recovery Items

### Herb System

| Herb | Color | Effect When Used Alone |
|------|-------|----------------------|
| Green Herb | Green | Restores ~25% health |
| Red Herb | Red | **Cannot be used alone** — booster only |
| Blue Herb | Blue | Cures poison status only |

### Herb Combinations

| Combination | Effect |
|-------------|--------|
| Green (G) | Small heal (~25%) |
| G + G | Medium heal (~50%) |
| G + G + G | Full heal (100%) |
| G + Red (R) | Full heal (100%) |
| G + Blue (B) | Small heal + cure poison |
| G + G + B | Full heal + cure poison |
| G + R + B | Full heal + cure poison (best combo) |

### First Aid Spray
- **Effect:** Instantly fully restores health
- **Notes:** Rare and valuable. Using too many can affect end-game ranking.
- **Side-Scroller Notes:** Full heal pickup item. Should be rare and rewarding to find.

### Serum
- **Effect:** Cures Yawn's venom (specific poison)
- **Context:** Must be retrieved from the medical room after being bitten by Yawn. Time-limited — if too slow, the character dies.

---

## Key Items (Progression Items)

### Door Keys
| Key | Color/Symbol | Areas Unlocked |
|-----|-------------|----------------|
| Sword Key | Sword emblem | Initial mansion rooms (1F) |
| Armor Key | Armor emblem | Additional 1F + some 2F rooms |
| Shield Key | Shield emblem | 2F rooms, attic, connecting halls |
| Helmet Key | Helmet emblem | Final mansion areas, labs access |
| Master Key | — | Various locked simple doors |
| Small Keys | — | Common locks (Chris needs these; Jill uses lockpick) |

### Crests (Gate of New Life)
| Crest | Location Found | Purpose |
|-------|---------------|---------|
| Sun Crest | Graveyard tombstone puzzle | Opens courtyard gate |
| Moon Crest | Mansion attic (Yawn's room) | Opens courtyard gate |
| Star Crest | Graveyard tombstone puzzle | Opens courtyard gate |
| Wind Crest | Bug collection puzzle | Opens courtyard gate |

### Death Masks (4 total)
| Mask | How Obtained |
|------|-------------|
| Mask Without Mouth | Yawn's attic room |
| Mask Without Eyes | Gallery painting puzzle |
| Mask Without Nose | Armor room trap puzzle |
| Mask Without All | Chemical plant room |

**Use:** Place all 4 on the coffin in the cemetery to unlock underground passage.

### Other Key Items
| Item | Purpose |
|------|---------|
| Wooden/Golden Emblem | Moonlight Sonata puzzle — swap to proceed |
| Sheet Music (2 halves) | Required for piano puzzle |
| Broken Shotgun | Swap for real shotgun to avoid ceiling trap (Chris) |
| Square Crank | Turn water valves in guardhouse |
| Hex Crank | Turn underground mechanisms |
| Red/Blue Jewels | Placed in tiger statue eyes to unlock areas |
| MO Disks (Lab) | Used in lab computers to unlock doors/self-destruct |
| Lab Passcodes | Found on documents, entered into computer terminals |
| V-JOLT chemicals | Mixed to weaken Plant 42 |
| Battery / Crank Handle | Various environmental puzzles |
| Lighter | Needed for burning items, lighting candles (Chris always has one; Jill must find one or Barry provides) |
| Lockpick | Jill's starting item — opens simple locks |
| Ink Ribbons | Typewriter saves |
| Maps | Reveal room layouts for each floor |
| Radio | Given by Richard before he dies |

---

## Resource Economy (Ammo Scarcity Design)

The original game has very carefully tuned resource scarcity:

| Ammo Type | Total Available (approx.) | Enemies It Can Kill |
|-----------|--------------------------|-------------------|
| Handgun Ammo | ~200 rounds | ~40–60 zombies |
| Shotgun Shells | ~40 shells | ~30 zombies or ~10 Hunters |
| Grenade Rounds | ~20–30 total (mixed types) | ~15–20 enemies |
| Magnum Rounds | ~15 rounds | ~10 tough enemies |
| Knife | Infinite | Risky vs. most enemies |

**Design principle:** There are more enemies than ammo. Players MUST choose when to fight and when to run. This is the core tension of survival horror.

### Side-Scroller Notes on Economy
- Ammo should be scarce enough to force strategic decisions
- Players should sometimes need to dodge/avoid enemies rather than fight
- Health items should be limited but findable through exploration
- Reward thorough exploration with ammo/health pickups in hidden areas
