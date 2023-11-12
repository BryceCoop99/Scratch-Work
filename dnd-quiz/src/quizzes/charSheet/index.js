import React, { useEffect, useState } from "react";
import "./index.css"; // Assuming this is the correct path for your CSS

// Constants for races and classes
const races = [
  "Elf",
  "High-Elf",
  "Dwarf",
  "Gnome",
  "Human",
  "Halfling",
  "Tiefling",
  "Dragonborn",
  "Half-Orc",
  "Half-Elf",
];
const classes = [
  "Barbarian",
  "Fighter",
  "Wizard",
  "Rogue",
  "Cleric",
  "Bard",
  "Ranger",
  "Druid",
  "Paladin",
  "Artificer",
  "Warlock",
  "Sorcerer",
  "Monk",
];

const racialBonuses = {
  Elf: { dexterity: 2 },
  "High-Elf": { dexterity: 2, intelligence: 1 },
  Dwarf: { constitution: 2 },
  Gnome: { intelligence: 2 },
  Human: {
    strength: 1,
    dexterity: 1,
    constitution: 1,
    intelligence: 1,
    wisdom: 1,
    charisma: 1,
  },
  Halfling: { dexterity: 2 },
  Tiefling: { intelligence: 1, charisma: 2 },
  Dragonborn: { strength: 2, charisma: 1 },
  "Half-Orc": { strength: 2, constitution: 1 },
  "Half-Elf": { charisma: 2, wisdom: 1, intelligence: 1 }, // Updated bonuses for Half-Elf
};
const classPrimaryAbilities = {
  Barbarian: { strength: 6, constitution: 4 },
  Fighter: { strength: 5, dexterity: 3, constitution: 2 },
  Wizard: { intelligence: 6, constitution: 2 },
  Rogue: { dexterity: 6, intelligence: 2, charisma: 2 },
  Cleric: { wisdom: 5, constitution: 3 },
  Bard: { charisma: 5, dexterity: 3 },
  Ranger: { dexterity: 5, wisdom: 3 },
  Druid: { wisdom: 5, intelligence: 3 },
  Paladin: { strength: 4, charisma: 4, constitution: 2 },
  Artificer: { intelligence: 5, constitution: 3 },
  Warlock: { charisma: 6, constitution: 2 },
  Sorcerer: { charisma: 6, constitution: 2 },
  Monk: { dexterity: 5, wisdom: 3 },
};

const classSpells = {
  Wizard: [
    {
      name: "Fire Bolt",
      description:
        "You hurl a mote of fire at a creature or object within range.",
      spellModifier: "Intelligence",
      damage: "1d10 fire damage",
      slots: "At-will (Cantrip)",
    },
    {
      name: "Mage Hand",
      description:
        "A spectral, floating hand appears at a point you choose within range.",
      spellModifier: "Intelligence",
      damage: "N/A",
      slots: "At-will (Cantrip)",
    },
    {
      name: "Magic Missile",
      description: "You create three glowing darts of magical force.",
      spellModifier: "Intelligence",
      damage: "1d4+1 force damage per dart",
      slots: 3, // 1st-level slots
    },
    {
      name: "Shield",
      description:
        "An invisible barrier of magical force appears and protects you. +2 AC",
      spellModifier: "Intelligence",
      damage: "N/A",
      slots: 1, // 1st-level slots
    },
    {
      name: "Misty Step",
      description:
        "Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see.",
      spellModifier: "Intelligence",
      damage: "N/A",
      slots: 1, // 2nd-level slots
    },
    {
      name: "Scorching Ray",
      description:
        "You create three rays of fire and hurl them at targets within range.",
      spellModifier: "Intelligence",
      damage: "2d6 fire damage per ray",
      slots: 2, // 2nd-level slots
    },
    {
      name: "Fireball",
      description:
        "A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame.",
      spellModifier: "Intelligence",
      damage: "8d6 fire damage",
      slots: 1, // 3rd-level slots
    },
    {
      name: "Counterspell",
      description:
        "You attempt to interrupt a creature in the process of casting a spell.",
      spellModifier: "Intelligence",
      damage: "N/A",
      slots: 1, // 3rd-level slots
    },
  ],
  Cleric: [
    {
      name: "Cure Wounds",
      description:
        "A creature you touch regains a number of hit points equal to 1d8 + your Wisdom modifier.",
      spellModifier: "Wisdom",
      damage: "N/A",
      slots: 4, // 1st-level slots
    },
    {
      name: "Bless",
      description:
        "You bless up to three creatures of your choice within range. They gain a +1d4 bonus to attack rolls and saving throws.",
      spellModifier: "Wisdom",
      damage: "N/A",
      slots: 2, // 1st-level slots
    },
    {
      name: "Spiritual Weapon",
      description:
        "You create a floating, spectral weapon that attacks on your behalf.",
      spellModifier: "Wisdom",
      damage: "1d8 + your Wisdom modifier force damage",
      slots: 2, // 2nd-level slots
    },
    {
      name: "Cure Serious Wounds",
      description:
        "A creature you touch regains a number of hit points equal to 3d8 + your Wisdom modifier.",
      spellModifier: "Wisdom",
      damage: "N/A",
      slots: 2, // 2nd-level slots
    },
    {
      name: "Divine Spirit",
      description:
        "You channel the power of your deity to grant temporary hit points to creatures of your choice within range. 1d8 + Wisdom modifier.",
      spellModifier: "Wisdom",
      damage: "N/A",
      slots: 1, // 3rd-level slots
    },
    {
      name: "Mass Heal",
      description:
        "You channel positive energy to restore a large number of hit points to multiple creatures within range. 3d8 + Wisdom modifier.",
      spellModifier: "Wisdom",
      damage: "N/A",
      slots: 1, // 4th-level slots
    },
  ],
  Bard: [
    {
      name: "Blade Ward",
      description:
        "You extend your hand and trace a sigil of warding in the air. Until the end of your next turn, you have resistance against bludgeoning, piercing, and slashing damage dealt by weapon attacks.",
      spellModifier: "Charisma",
      damage: "N/A",
      slots: "At-will (Cantrip)",
    },
    {
      name: "Thunderclap",
      description:
        "You create a burst of thunderous sound that can be heard up to 100 feet away. Each creature within range, other than you, must make a Constitution saving throw or take 1d6 thunder damage.",
      spellModifier: "Charisma",
      damage: "1d6 thunder damage",
      slots: "At-will (Cantrip)",
    },
    {
      name: "Thunderwave",
      description:
        "A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube originating from you must make a Constitution saving throw.",
      spellModifier: "Charisma",
      damage: "2d8 thunder damage",
      slots: "2",
    },
    {
      name: "Charm Person",
      description:
        "You attempt to charm a humanoid you can see within range. It must make a Wisdom saving throw, and if it fails, it is charmed by you until the spell ends or until you or your companions do anything harmful to it.",
      spellModifier: "Charisma",
      damage: "N/A",
      slots: "1",
    },
  ],
  Paladin: [
    {
      name: "Divine Smite",
      description:
        "When you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage to the target, in addition to the weapon's damage.",
      spellModifier: "Charisma",
      damage: "2d8 radiant damage",
      slots: "2",
    },
    {
      name: "Lay on Hands",
      description:
        "Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you take a long rest.",
      spellModifier: "N/A",
      damage:
        "Heals a total number of hit points equal to your Paladin level x 5",
      slots: "N/A",
    },
    {
      name: "Shield of Faith",
      description:
        "You create a shimmering field of magical force around a creature of your choice within range. The target gains a +2 bonus to AC for the duration.",
      spellModifier: "Charisma",
      damage: "N/A",
      slots: "1",
    },
  ],
  Rogue: [
    {
      name: "Mage Hand",
      description:
        "A spectral, floating hand appears at a point you choose within range.",
      spellModifier: "Intelligence",
      damage: "N/A",
      slots: "At-will (Cantrip)",
    },
    {
      name: "Minor Illusion",
      description: "You create a sound or an image of an object within range.",
      spellModifier: "Intelligence",
      damage: "N/A",
      slots: "At-will (Cantrip)",
    },
    {
      name: "Mage Armor",
      description:
        "You touch a willing creature who isn't wearing armor, and a protective magical force surrounds it until the spell ends. The target's base AC becomes 13 + its Dexterity modifier.",
      spellModifier: "Intelligence",
      damage: "N/A",
      slots: "1 ",
    },
    {
      name: "Find Familiar",
      description:
        "You gain the service of a familiar, a spirit that takes an animal form you choose.",
      spellModifier: "Intelligence",
      damage: "N/A",
      slots: "1",
    },
  ],
  Ranger: [
    {
      name: "Hunter's Mark",
      description:
        "You choose a creature you can see within range and mystically mark it as your quarry.",
      spellModifier: "Wisdom",
      damage: "Extra 1d6 damage on all weapon attacks against the target",
      slots: "2",
    },
    {
      name: "Cure Wounds",
      description:
        "A creature you touch regains a number of hit points equal to 1d8 + your Wisdom modifier.",
      spellModifier: "Wisdom",
      damage: "N/A",
      slots: "2",
    },
    {
      name: "Ensnaring Strike",
      description:
        "The next time you hit a creature with a weapon attack before this spell ends, a writhing mass of thorny vines appears at the point of impact, and the target must succeed on a Strength saving throw or be restrained.",
      spellModifier: "Wisdom",
      damage: "N/A",
      slots: "1",
    },
  ],
  Druid: [
    {
      name: "Entangle",
      description:
        "You conjure plants and create difficult terrain. A creature in the area when you cast the spell must succeed on a Strength saving throw or be restrained.",
      spellModifier: "Wisdom",
      damage: "N/A",
      slots: "2",
    },
    {
      name: "Cure Wounds",
      description:
        "A creature you touch regains a number of hit points equal to 1d8 + your Wisdom modifier.",
      spellModifier: "Wisdom",
      damage: "N/A",
      slots: "2",
    },
    {
      name: "Animal Friendship",
      description:
        "This spell lets you convince a beast that you mean it no harm.",
      spellModifier: "Wisdom",
      damage: "N/A",
      slots: "1",
    },
    {
      name: "Barkskin",
      description:
        "You touch a willing creature and grant it the resilience of a tree. +2 AC",
      spellModifier: "Wisdom",
      damage: "N/A",
      slots: "1",
    },
  ],
  Artificer: [
    {
      name: "Magic Missile",
      description: "You create three glowing darts of magical force.",
      spellModifier: "Intelligence",
      damage: "1d4+1 force damage per dart",
      slots: "2",
    },
    {
      name: "Cure Wounds",
      description:
        "A creature you touch regains a number of hit points equal to 1d8 + your Intelligence modifier.",
      spellModifier: "Intelligence",
      damage: "N/A",
      slots: "2",
    },
    {
      name: "Shield",
      description:
        "An invisible barrier of magical force appears and protects you. +2 AC.",
      spellModifier: "Intelligence",
      damage: "N/A",
      slots: "1",
    },
    {
      name: "Arcane Weapon",
      description:
        "You bond a weapon to yourself, infusing it with magic. The weapon gains a +1 bonus to attack and damage rolls.",
      spellModifier: "Intelligence",
      damage: "N/A",
      slots: "1",
    },
  ],
  Warlock: [
    {
      name: "Eldritch Blast",
      description:
        "A beam of crackling energy streaks toward a creature within range.",
      spellModifier: "Charisma",
      damage: "1d10 force damage",
      slots: "At-will (Cantrip)",
    },
    {
      name: "Hex",
      description:
        "You place a curse on a creature that you can see within range. You gain a bonus to damage rolls against the cursed target equal to your proficiency bonus. Any attack roll you make against the cursed target is a critical hit on a roll of 19 or 20 on the d20. If the cursed target dies, you regain hit points equal to your Warlock level + your Charisma modifier (minimum of 1 hit point).",
      spellModifier: "Charisma",
      damage: "N/A",
      slots: "1",
    },
    {
      name: "Armor of Agathys",
      description:
        "A protective magical force surrounds you, manifesting as frost on your body. +2 AC",
      spellModifier: "Charisma",
      damage: "N/A",
      slots: "1",
    },
    {
      name: "Darkness",
      description:
        "Magical darkness spreads from a point you choose within range to fill a 15-foot radius sphere for the duration.",
      spellModifier: "Charisma",
      damage: "N/A",
      slots: "2",
    },
  ],
  Sorcerer: [
    {
      name: "Mage Armor",
      description:
        "You touch a willing creature who isn't wearing armor, and a protective magical force surrounds it until the spell ends. The target's base AC becomes 13 + its Dexterity modifier.",
      spellModifier: "Charisma",
      damage: "N/A",
      slots: "1",
    },
    {
      name: "Magic Missile",
      description: "You create three glowing darts of magical force.",
      spellModifier: "Charisma",
      damage: "1d4+1 force damage per dart",
      slots: "1",
    },
    {
      name: "Thunderwave",
      description:
        "A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube originating from you must make a Constitution saving throw.",
      spellModifier: "Charisma",
      damage: "2d8 thunder damage",
      slots: "1",
    },
    {
      name: "Invisibility",
      description:
        "A creature you touch becomes invisible until the spell ends. Anything the target is wearing or carrying is invisible as long as it is on the target's person.",
      spellModifier: "Charisma",
      damage: "N/A",
      slots: "1",
    },
    {
      name: "Fireball",
      description:
        "A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame.",
      spellModifier: "Charisma",
      damage: "8d6 fire damage",
      slots: "1",
    },

    {
      name: "Lightning Bolt",
      description:
        "A stroke of lightning forming a line 100 feet long and 5 feet wide blasts out from you in a direction you choose.",
      spellModifier: "Charisma",
      damage: "8d6 lightning damage",
      slots: "1 (3rd-level slot)",
    },
  ],
};
const dndRaceAbilities = {
  Elf: [
    {
      name: "Darkvision",
      description:
        "Accustomed to twilit forests and the night sky, you have superior vision in dark and dim conditions.",
    },
    {
      name: "Keen Senses",
      description: "You have proficiency in the Perception skill.",
    },
    {
      name: "Fey Ancestry",
      description:
        "You have advantage on saving throws against being charmed and can't be put to sleep by magic.",
    },
    // Add more Elf racial abilities here if needed
  ],
  Dwarf: [
    {
      name: "Stonecunning",
      description:
        "Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check.",
    },
    {
      name: "Dwarven Resilience",
      description:
        "You have advantage on saving throws against poison, and you have resistance against poison damage.",
    },
    {
      name: "Dwarven Combat Training",
      description:
        "You have proficiency with the battleaxe, handaxe, throwing hammer, and warhammer.",
    },
    // Add more Dwarf racial abilities here if needed
  ],
  Human: [
    {
      name: "Versatile",
      description: "You gain one additional skill proficiency of your choice.",
    },
  ],
  Dragonborn: [
    {
      name: "Breath Weapon",
      description:
        "You can use your breath weapon to exhale destructive energy. The type and damage of the breath weapon depend on your draconic ancestry.",
    },
    {
      name: "Damage Resistance",
      description:
        "You have resistance to the damage type associated with your draconic ancestry.",
    },
    // Add more Dragonborn racial abilities here if needed
  ],
  Halfling: [
    {
      name: "Lucky",
      description:
        "When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.",
    },
    {
      name: "Brave",
      description:
        "You have advantage on saving throws against being frightened.",
    },
    // Add more Halfling racial abilities here if needed
  ],
  Gnome: [
    {
      name: "Gnome Cunning",
      description:
        "You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.",
    },
    {
      name: "Artificer's Lore",
      description:
        "Whenever you make an Intelligence (History) check related to magic items, alchemical objects, or technological devices, you can add twice your proficiency bonus, instead of any proficiency bonus you normally apply.",
    },
    // Add more Gnome racial abilities here if needed
  ],
  "Half-Elf": [
    {
      name: "Fey Ancestry",
      description:
        "You have advantage on saving throws against being charmed, and magic can't put you to sleep.",
    },
    // Add more Half-Elf racial abilities here if needed
  ],
  "Half-Orc": [
    {
      name: "Relentless Endurance",
      description:
        "When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. You can't use this feature again until you finish a long rest.",
    },
    {
      name: "Savage Attacks",
      description:
        "When you score a critical hit with a melee weapon attack, you can roll one of the weapon's damage dice one additional time and add it to the extra damage of the critical hit.",
    },
    // Add more Half-Orc racial abilities here if needed
  ],
  Tiefling: [
    {
      name: "Darkvision",
      description:
        "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray.",
    },
    {
      name: "Hellish Resistance",
      description: "You have resistance to fire damage.",
    },
  ],

  "High-Elf": [
    {
      name: "Darkvision",
      description:
        "Accustomed to twilit forests and the night sky, you have superior vision in dark and dim conditions.",
    },
    {
      name: "Keen Senses",
      description: "You have proficiency in the Perception skill.",
    },
    {
      name: "Fey Ancestry",
      description:
        "You have advantage on saving throws against being charmed and can't be put to sleep by magic.",
    },
  ],
};

const classSavingThrows = {
  Barbarian: ["strength", "constitution"],
  Fighter: ["strength", "constitution"],
  Wizard: ["intelligence", "wisdom"],
  Rogue: ["dexterity", "intelligence"],
  Cleric: ["wisdom", "charisma"],
  Bard: ["dexterity", "charisma"],
  Ranger: ["strength", "dexterity"],
  Druid: ["intelligence", "wisdom"],
  Paladin: ["wisdom", "charisma"],
  Artificer: ["constitution", "intelligence"],
  Warlock: ["wisdom", "charisma"],
  Sorcerer: ["constitution", "charisma"],
  Monk: ["strength", "dexterity"],
};
const classSkills = {
  Barbarian: ["Athletics", "Intimidation"],
  Fighter: ["Athletics", "Survival"],
  Wizard: ["Arcana", "History"],
  Rogue: ["Stealth", "Acrobatics"],
  Cleric: ["Religion", "Persuasion"],
  Bard: ["Performance", "Persuasion"],
  Ranger: ["Nature", "Survival"],
  Druid: ["Nature", "Animal Handling"],
  Paladin: ["Medicine", "Persuasion"],
  Artificer: ["Arcana", "Investigation"],
  Warlock: ["Deception", "Intimidation"],
  Sorcerer: ["Arcana", "Deception"],
  Monk: ["Acrobatics", "Stealth"],
};

const classWeaponProficiency = {
  Barbarian: ["Greataxe", "Handaxe", "Greatsword"],
  Fighter: ["Longsword", "Greatsword", "Crossbow", "Shield"],
  Wizard: ["Dagger", "Staff", "Light Crossbow"],
  Rogue: ["Shortsword", "Rapier", "Crossbow", "Dagger"],
  Cleric: ["Mace", "Warhammer", "Shield", "Sling"],
  Bard: ["Rapier", "Longsword", "Crossbow", "Dagger"],
  Ranger: ["Longbow", "Shortsword", "Shortbow"],
  Druid: ["Scimitar", "Staff", "Sling"],
  Paladin: ["Longsword", "Warhammer", "Shield", "Javelin"],
  Artificer: ["Crossbow", "Hammer", "Dagger"],
  Warlock: ["Dagger", "Staff", "Light Crossbow"],
  Sorcerer: ["Dagger", "Staff", "Light Crossbow"],
  Monk: ["Shortsword", "Quarterstaff", "Darts"],
};

const classEquipment = {
  Barbarian: {
    items: ["Greataxe", "Handaxe x2", "Explorer's Pack"],
    armor: [],
    weapons: [
      { name: "Greataxe", attackBonus: 0, damage: "1d12 slashing" },
      { name: "Handaxe", attackBonus: 0, damage: "1d6 slashing" },
    ],
    armorClassBonus: 3,
  },
  Fighter: {
    items: ["Chain Mail", "Longsword", "Shield", "Dungeoneer's Pack"],
    armor: ["Chain Mail", "Shield"],
    weapons: [{ name: "Longsword", attackBonus: 0, damage: "1d8 slashing" }],
    armorClassBonus: 3,
  },
  Wizard: {
    items: ["Spellbook", "Dagger", "Component Pouch", "Scholar's Pack"],
    armor: [],
    weapons: [{ name: "Dagger", attackBonus: 0, damage: "1d4 piercing" }],
    armorClassBonus: 1,
  },
  Rogue: {
    items: ["Shortsword", "Rapier", "Thieves' Tools", "Burglar's Pack"],
    armor: ["Leather Armor"],
    weapons: [
      { name: "Shortsword", attackBonus: 0, damage: "1d6 piercing" },
      { name: "Rapier", attackBonus: 0, damage: "1d8 piercing" },
    ],
  },
  Cleric: {
    items: ["Mace", "Scale Mail", "Shield", "Holy Symbol", "Priest's Pack"],
    armor: ["Scale Mail", "Shield"],
    weapons: [{ name: "Mace", attackBonus: 0, damage: "1d6 bludgeoning" }],
    armorClassBonus: 2,
  },
  Bard: {
    items: ["Rapier", "Dagger", "Lute", "Entertainer's Pack"],
    armor: ["Leather Armor"],
    weapons: [
      { name: "Rapier", attackBonus: 0, damage: "1d8 piercing" },
      { name: "Dagger", attackBonus: 0, damage: "1d4 piercing" },
    ],
  },
  Ranger: {
    items: ["Longbow", "Shortsword", "Quiver with Arrows", "Explorer's Pack"],
    armor: ["Leather Armor"],
    weapons: [
      { name: "Longbow", attackBonus: 0, damage: "1d8 piercing" },
      { name: "Shortsword", attackBonus: 0, damage: "1d6 piercing" },
    ],
  },
  Druid: {
    items: ["Scimitar", "Wooden Shield", "Druidic Focus", "Explorer's Pack"],
    armor: ["Leather Armor", "Wooden Shield"],
    weapons: [{ name: "Scimitar", attackBonus: 0, damage: "1d6 slashing" }],
    armorClassBonus: 1,
  },
  Paladin: {
    items: ["Longsword", "Shield", "Holy Symbol", "Priest's Pack"],
    armor: ["Chain Mail", "Shield"],
    weapons: [{ name: "Longsword", attackBonus: 0, damage: "1d8 slashing" }],
    armorClassBonus: 4,
  },
  Artificer: {
    items: ["Light Crossbow", "Hammer", "Tinker's Tools", "Dungeoneer's Pack"],
    armor: ["Leather Armor"],
    weapons: [
      { name: "Light Crossbow", attackBonus: 0, damage: "1d8 piercing" },
      { name: "Hammer", attackBonus: 0, damage: "1d4 bludgeoning" },
    ],
    armorClassBonus: 1,
  },
  Warlock: {
    items: ["Dagger", "Light Crossbow", "Component Pouch", "Scholar's Pack"],
    armor: [],
    weapons: [
      { name: "Dagger", attackBonus: 0, damage: "1d4 piercing" },
      { name: "Light Crossbow", attackBonus: 0, damage: "1d8 piercing" },
    ],
    armorClassBonus: 2,
  },
  Sorcerer: {
    items: ["Light Crossbow", "Dagger", "Component Pouch", "Explorer's Pack"],
    armor: [],
    weapons: [
      { name: "Light Crossbow", attackBonus: 0, damage: "1d8 piercing" },
      { name: "Dagger", attackBonus: 0, damage: "1d4 piercing" },
    ],
    armorClassBonus: 1,
  },
  Monk: {
    items: ["Shortsword", "Dart x10", "Explorer's Pack"],
    armor: [],
    weapons: [
      { name: "Shortsword", attackBonus: 0, damage: "1d6 piercing" },
      { name: "Dart", attackBonus: 0, damage: "1d4 piercing" },
    ],
    armorClassBonus: 4,
  },
};

const baseScore = 8;
const totalPoints = 70;
const proficiencyBonus = 3;
const baseArmorClass = 10;

// AbilityScoreCalculator component
export default function CharSheet() {
  const [race, setRace] = useState("");
  const [characterClass, setCharacterClass] = useState("");
  const [abilityScores, setAbilityScores] = useState({
    strength: baseScore,
    dexterity: baseScore,
    constitution: baseScore,
    intelligence: baseScore,
    wisdom: baseScore,
    charisma: baseScore,
  });
  // Additional state for saving throws, skills, and other attributes
  const [savingThrows, setSavingThrows] = useState({});
  const [skills, setSkills] = useState({});
  const [armorClass, setArmorClass] = useState(10);
  const [initiative, setInitiative] = useState(0);
  const [speed, setSpeed] = useState(30); // Default speed, can be adjusted based on race
  const [maxHitPoints, setMaxHitPoints] = useState(0);
  const [weapons, setWeapons] = useState([]);

  const [selectedSpells, setSelectedSpells] = useState([]);
  const [racialAbilities, setRacialAbilities] = useState([]);

  useEffect(() => {
    if (characterClass) {
      setSelectedSpells(classSpells[characterClass] || []);
    }
  }, [characterClass]);

  useEffect(() => {
    if (race) {
      setRacialAbilities(dndRaceAbilities[race] || []);
    }
  }, [race]);

  // Constants for hit dice per class, speeds per race, etc.
  const classHitDice = {
    Barbarian: 12, // d12
    Fighter: 10, // d10
    Wizard: 6, // d6
    Rogue: 8, // d8
    Cleric: 8, // d8
    Bard: 8, // d8
    Ranger: 10, // d10
    Druid: 8, // d8
    Paladin: 10, // d10
    Artificer: 8, // d8
    Warlock: 8, // d8
    Sorcerer: 6, // d6
    Monk: 8, // d8
  };

  const raceSpeeds = {
    Elf: 30,
    "High-Elf": 30,
    Dwarf: 25,
    Gnome: 25,
    Human: 30,
    Halfling: 25,
    Tiefling: 30,
    Dragonborn: 30,
    "Half-Orc": 30,
    "Half-Elf": 30,
  };

  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    if (characterClass) {
      setEquipment(classEquipment[characterClass]?.items || []);
      // Example: Update armor class if the class has an armor bonus
      console.log(classEquipment[characterClass]?.armorClassBonus);
      setArmorClass(
        baseArmorClass + (classEquipment[characterClass]?.armorClassBonus || 0)
      );
    }
  }, [characterClass]);

  useEffect(() => {
    if (characterClass) {
      const selectedClassEquipment = classEquipment[characterClass] || {};
      setEquipment(selectedClassEquipment.items || []);

      const updatedWeapons = selectedClassEquipment.weapons.map((weapon) => {
        const attackBonus = calculateAttackBonus(
          weapon,
          abilityScores,
          characterClass
        );
        return { ...weapon, attackBonus };
      });
      setWeapons(updatedWeapons);

      let totalArmorClass = baseArmorClass;
      const dexterityModifier = Math.floor((abilityScores.dexterity - 10) / 2);

      // Consider armor type and add Dexterity modifier accordingly
      if (selectedClassEquipment.armor.includes("Leather Armor")) {
        // Light armor
        totalArmorClass += dexterityModifier;
      } else if (
        selectedClassEquipment.armor.includes("Chain Mail") ||
        selectedClassEquipment.armor.includes("Scale Mail")
      ) {
        // Heavy armor
        // No Dexterity modifier for heavy armor
      } else {
        // Medium armor or other types
        totalArmorClass += Math.min(dexterityModifier, 2);
      }

      // Add shield bonus if applicable
      if (selectedClassEquipment.armor.includes("Shield")) {
        totalArmorClass += 2; // Standard shield bonus
      }

      // Apply any class-specific armor class bonuses
      totalArmorClass += selectedClassEquipment.armorClassBonus || 0;

      setArmorClass(totalArmorClass);
    }
  }, [characterClass, abilityScores]);

  // Calculate modifiers and update related attributes
  useEffect(() => {
    const modifiers = calculateModifiers(abilityScores);

    // Ensure classSavingThrows and classSkills have the selected class, or default to an empty array
    const classThrows = classSavingThrows[characterClass] || [];
    const classSkillsList = classSkills[characterClass] || [];

    setSavingThrows(calculateSavingThrows(modifiers, classThrows));
    setSkills(calculateSkills(modifiers, classSkillsList));

    // setArmorClass(10 + modifiers.dexterity);
    setInitiative(modifiers.dexterity);
    setSpeed(raceSpeeds[race] || 30);
    setMaxHitPoints(
      calculateMaxHitPoints(characterClass, modifiers.constitution)
    );
  }, [abilityScores, characterClass, race]);

  const calculateSavingThrows = (modifiers, classThrows) => {
    let throws = {};
    for (const ability in modifiers) {
      throws[ability] = {
        modifier: modifiers[ability],
        isProficient: classThrows.includes(ability),
        total:
          modifiers[ability] +
          (classThrows.includes(ability) ? proficiencyBonus : 0),
      };
    }
    return throws;
  };

  const calculateSkills = (modifiers, classSkillsList) => {
    const skillsConfig = {
      Acrobatics: "dexterity",
      "Animal Handling": "wisdom",
      Arcana: "intelligence",
      Athletics: "strength",
      Deception: "charisma",
      History: "intelligence",
      Insight: "wisdom",
      Intimidation: "charisma",
      Investigation: "intelligence",
      Medicine: "wisdom",
      Nature: "intelligence",
      Perception: "wisdom",
      Performance: "charisma",
      Persuasion: "charisma",
      Religion: "intelligence",
      "Sleight of Hand": "dexterity",
      Stealth: "dexterity",
      Survival: "wisdom",
    };

    let calculatedSkills = {};

    for (const skill in skillsConfig) {
      const associatedAbility = skillsConfig[skill];
      calculatedSkills[skill] = {
        modifier: modifiers[associatedAbility],
        isProficient: classSkillsList.includes(skill),
        total:
          modifiers[associatedAbility] +
          (classSkillsList.includes(skill) ? proficiencyBonus : 0),
      };
    }

    return calculatedSkills;
  };

  // Function to calculate ability score modifiers
  const calculateModifiers = (scores) => {
    let modifiers = {};
    for (const ability in scores) {
      modifiers[ability] = Math.floor((scores[ability] - 10) / 2);
    }
    return modifiers;
  };

  // Function to calculate max hit points
  const calculateMaxHitPoints = (characterClass, constitutionModifier) => {
    const hitDiceValue = classHitDice[characterClass] || 6; // Default to d6 if class is unknown
    const averageHitDiceValue = Math.ceil(hitDiceValue / 2) + 1;
    return 5 * (averageHitDiceValue + constitutionModifier);
  };

  function calculateAttackBonus(weapon, abilityScores, characterClass) {
    let abilityModifier;

    // Determine the relevant ability score for the weapon
    // For simplicity, using Strength for melee weapons and Dexterity for ranged
    if (
      ["Greataxe", "Handaxe", "Longsword", "Mace", "Scimitar"].includes(
        weapon.name
      )
    ) {
      abilityModifier = Math.floor((abilityScores.strength - 10) / 2);
    } else {
      abilityModifier = Math.floor((abilityScores.dexterity - 10) / 2);
    }

    // Check if the class is proficient with the weapon
    const isProficient =
      classWeaponProficiency[characterClass]?.includes(weapon.name) || false;

    // Calculate the attack bonus
    return abilityModifier + (isProficient ? proficiencyBonus : 0);
  }

  function getAbilityModifier(score) {
    return Math.floor((score - 10) / 2);
  }

  /**
   * ABILITY SCORES
   */
  const distributePoints = () => {
    const primaryAbilities = classPrimaryAbilities[characterClass] || {};
    let pointsToDistribute = totalPoints - baseScore * 6; // Remaining points after base scores

    // Start with the base score for each ability
    let scores = {
      strength: baseScore,
      dexterity: baseScore,
      constitution: baseScore,
      intelligence: baseScore,
      wisdom: baseScore,
      charisma: baseScore,
    };

    // Distribute points to primary abilities of the class
    for (const ability in primaryAbilities) {
      let points = primaryAbilities[ability];
      if (pointsToDistribute >= points) {
        scores[ability] += points;
        pointsToDistribute -= points;
      } else {
        scores[ability] += pointsToDistribute;
        pointsToDistribute = 0;
      }
    }

    // Distribute remaining points randomly
    const abilities = Object.keys(scores);
    while (pointsToDistribute > 0) {
      const randomAbility =
        abilities[Math.floor(Math.random() * abilities.length)];
      if (scores[randomAbility] < 16) {
        scores[randomAbility]++;
        pointsToDistribute--;
      }
    }

    // Apply racial bonuses
    const bonuses = racialBonuses[race] || {};
    for (const ability in bonuses) {
      scores[ability] = Math.min(16, scores[ability] + bonuses[ability]);
    }

    setAbilityScores(scores);
  };

  return (
    <div className="character-sheet">
      <h1 className="sheet-title">D&D Character Sheet</h1>

      <div className="selections">
        <div className="selection-item">
          <label>Race: </label>
          <select value={race} onChange={(e) => setRace(e.target.value)}>
            {races.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="selection-item">
          <label>Class: </label>
          <select
            value={characterClass}
            onChange={(e) => setCharacterClass(e.target.value)}
          >
            {classes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button className="generate-button" onClick={distributePoints}>
        Generate Scores
      </button>

      {/* Ability Scores Table */}
      <table className="table">
        <thead>
          <tr>
            <th colSpan="2">Ability Scores</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(abilityScores).map((key) => (
            <tr key={key}>
              <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
              <td>{abilityScores[key]}</td>
              <td>{getAbilityModifier(abilityScores[key])}</td>{" "}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Character Attributes Table */}
      <table className="table">
        <thead>
          <tr>
            <th colSpan="2">Character Attributes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Armor Class</td>
            <td>{armorClass}</td>
          </tr>
          <tr>
            <td>Initiative</td>
            <td>{initiative}</td>
          </tr>
          <tr>
            <td>Speed</td>
            <td>{speed}</td>
          </tr>
          <tr>
            <td>Max Hit Points</td>
            <td>{maxHitPoints}</td>
          </tr>
        </tbody>
      </table>

      {/* Saving Throws Table */}
      <table className="table">
        <thead>
          <tr>
            <th colSpan="2">Saving Throws</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(savingThrows).map((key) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{savingThrows[key].total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Skills Table */}
      <table className="table">
        <thead>
          <tr>
            <th colSpan="2">Skills</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(skills).map((key) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{skills[key].total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Equipment Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Equipment</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map((item, index) => (
            <tr key={index}>
              <td>{item}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Weapon Attacks Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Weapon</th>
            <th>Attack Bonus</th>
            <th>Damage/Type</th>
          </tr>
        </thead>
        <tbody>
          {weapons.map((weapon, index) => (
            <tr key={index}>
              <td>{weapon.name}</td>
              <td>
                {weapon.attackBonus >= 0
                  ? `+${weapon.attackBonus}`
                  : weapon.attackBonus}
              </td>
              <td>{weapon.damage}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Class Spells Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Modifier</th>
            <th>Damage</th>
          </tr>
        </thead>
        <tbody>
          {classSpells[characterClass]?.map((spell, index) => (
            <tr key={index}>
              <td>{spell.name}</td>
              <td>{spell.description}</td>
              <td>{spell.spellModifier}</td>
              <td>{spell.damage}</td>
              <td>{spell.slots}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Racial Abilities Table */}
      {/* Racial Abilities Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Ability</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {dndRaceAbilities[race]?.map((ability, index) => {
            // Log the ability information to the console
            console.log(`Ability Name: ${ability.name}`);
            console.log(`Description: ${ability.description}`);

            return (
              <tr key={index}>
                <td>{ability.name}</td>
                <td>{ability.description}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
