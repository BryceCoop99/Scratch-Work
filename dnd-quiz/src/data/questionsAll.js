
const classQuestions = [
  {
    text: "When confronted with a conflict, you:",
    options: [
      "Charge headfirst into the fray",
      "Strategize and plan the best approach",
      "Look for a peaceful resolution",
      "Use the environment to your advantage",
    ],
    classes: [
      "Barbarian,Fighter",
      "Wizard,Rogue",
      "Cleric,Bard",
      "Ranger,Druid",
    ],
  },
  {
    text: "In a group project, you usually:",
    options: [
      "Lead and make the decisions",
      "Support the team with your skills",
      "Think critically to solve problems",
      "Help everyone get along",
    ],
    classes: [
      "Paladin,Fighter",
      "Rogue,Bard",
      "Wizard,Artificer",
      "Cleric,Druid",
    ],
  },
  {
    text: "Which appeals to you more?",
    options: [
      "Exploring the wilderness",
      "Studying ancient tomes",
      "Protecting the innocent",
      "Seeking thrills and adventure",
    ],
    classes: [
      "Ranger,Druid",
      "Wizard,Warlock",
      "Paladin,Cleric",
      "Barbarian,Rogue",
    ],
  },
  {
    text: "Pick a hobby that you’re most likely to enjoy:",
    options: [
      "Crafting or building things",
      "Performing music or theater",
      "Meditating in nature",
      "Collecting rare items",
    ],
    classes: [
      "Artificer,Fighter",
      "Bard,Sorcerer",
      "Druid,Ranger",
      "Rogue,Wizard",
    ],
  },
  {
    text: "If you found a treasure chest, you would:",
    options: [
      "Share it with your companions",
      "Study it for historical significance",
      "Check for traps and then loot it",
      "Use the wealth to boost your own power",
    ],
    classes: [
      "Cleric,Paladin",
      "Wizard,Bard",
      "Rogue,Ranger",
      "Warlock,Sorcerer",
    ],
  },
  {
    text: "What role do you play in your friend group?",
    options: [
      "The leader who makes plans",
      "The advisor who offers help",
      "The protector who watches out for dangers",
      "The innovator who suggests new ideas",
    ],
    classes: [
      "Paladin,Fighter",
      "Cleric,Bard",
      "Barbarian,Ranger",
      "Artificer,Wizard",
    ],
  },
  {
    text: "Choose an element that you resonate with:",
    options: [
      "Earth – stable and strong",
      "Air – free and unpredictable",
      "Fire – passionate and fierce",
      "Water – adaptable and resilient",
    ],
    classes: [
      "Fighter,Barbarian",
      "Rogue,Sorcerer",
      "Wizard,Warlock",
      "Druid,Cleric",
    ],
  },
  {
    text: "How do you approach learning a new skill?",
    options: [
      "Practice it until you perfect it",
      "Study its history and theory",
      "Find a teacher or a mentor",
      "Learn by doing it in a real scenario",
    ],
    classes: [
      "Fighter,Monk",
      "Wizard,Artificer",
      "Bard,Paladin",
      "Rogue,Ranger",
    ],
  },
  {
    text: "What is your preferred method of travel?",
    options: [
      "On foot, to stay grounded and ready",
      "Teleportation or magical means",
      "Riding a trusty steed or companion",
      "Stealthily to avoid notice",
    ],
    classes: [
      "Barbarian,Monk",
      "Wizard,Sorcerer",
      "Paladin,Ranger",
      "Rogue,Druid",
    ],
  },
];

const raceQuestions = [
  {
    text: "Choose a landscape that feels like home:",
    options: [
      "Deep forests and ancient trees",
      "Underground cities or caverns",
      "Bustling cities or large towns",
      "Remote or mystical places"
    ],
    races: [
      "Elf,High-Elf",
      "Dwarf,Gnome",
      "Human,Halfling",
      "Tiefling,Dragonborn"
    ],
  },
  {
    text: "In a conflict, you are more likely to:",
    options: [
      "Stand your ground and fight bravely",
      "Use wit and cunning to gain an advantage",
      "Seek a diplomatic resolution",
      "Use magic or charm to shift the odds"
    ],
    races: [
      "Dwarf,Half-Orc",
      "Halfling,Gnome",
      "Human,Half-Elf",
      "High-Elf,Tiefling"
    ],
  },
  {
    text: "What is your favorite type of story?",
    options: [
      "Epic tales of heroes and battles",
      "Mysteries or tales of intrigue",
      "Stories of discovery and exploration",
      "Tales of magic and the arcane"
    ],
    races: [
      "Human,Half-Orc",
      "Halfling,Gnome",
      "Elf,Half-Elf",
      "High-Elf,Tiefling"
    ],
  },
  {
    text: "Which of these items would you prefer to possess?",
    options: [
      "A reliable, sturdy weapon",
      "A mysterious, ancient artifact",
      "A practical tool or gadget",
      "A magical amulet or ring"
    ],
    races: [
      "Dwarf,Half-Orc",
      "Elf,Gnome",
      "Human,Halfling",
      "High-Elf,Tiefling"
    ],
  },
  {
    text: "What is your approach to solving problems?",
    options: [
      "Direct action and confrontation",
      "Clever planning and strategy",
      "Negotiation and diplomacy",
      "Using magic or mystical methods"
    ],
    races: [
      "Dwarf,Half-Orc",
      "Halfling,Gnome",
      "Human,Half-Elf",
      "High-Elf,Tiefling"
    ],
  },
  {
    text: "Choose a leisure activity:",
    options: [
      "Training or physical exercise",
      "Reading or studying",
      "Socializing or partying",
      "Meditating or connecting with nature"
    ],
    races: [
      "Human,Half-Orc",
      "High-Elf,Gnome",
      "Halfling,Tiefling",
      "Elf,Druid"
    ],
  },
  {
    text: "Which of these traits do you value most?",
    options: [
      "Strength and bravery",
      "Intelligence and wisdom",
      "Charm and charisma",
      "Dexterity and agility"
    ],
    races: [
      "Dwarf,Half-Orc",
      "Elf,High-Elf",
      "Human,Tiefling",
      "Halfling,Gnome"
    ],
  },
  {
    text: "If you could have any pet, which would it be?",
    options: [
      "A loyal dog or wolf",
      "An exotic bird or dragon",
      "A clever cat or monkey",
      "A mystical creature, like a unicorn or phoenix"
    ],
    races: [
      "Human,Half-Orc",
      "Dragonborn,Elf",
      "Halfling,Gnome",
      "High-Elf,Tiefling"
    ],
  },
  {
    text: "How do you prefer to travel?",
    options: [
      "Walking or riding a beast",
      "By ship or watercraft",
      "Using magical means, like teleportation",
      "In a crafted vehicle or flying device"
    ],
    races: [
      "Human,Half-Orc",
      "Elf,Half-Elf",
      "High-Elf,Tiefling",
      "Gnome,Dwarf"
    ],
  },
  {
    text: "What is your favorite time of day?",
    options: [
      "Dawn, the start of a new day",
      "Dusk, when night and day meet",
      "Night, under the cover of darkness",
      "Midday, when the sun is highest"
    ],
    races: [
      "Human,Half-Elf",
      "Elf,High-Elf",
      "Dwarf,Half-Orc",
      "Dragonborn,Tiefling"
    ],
  }
];


export { classQuestions, raceQuestions };
