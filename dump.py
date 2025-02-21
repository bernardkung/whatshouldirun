import json

charClasses = [

  {
      "class": "shaman",
      "specializations": [
          "restoration",
          "elemental",
          "enhancement"
      ]
  },
  {
      "class": "death_knight",
      "specializations": [
          "blood",
          "frost",
          "unholy"
      ]
  },
  {
      "class": "hunter",
      "specializations": [
          "beast_mastery",
          "marksmanship",
          "survival"
      ]
  },
  {
      "class": "monk",
      "specializations": [
          "windwalker",
          "mistweaver",
          "brewmaster"
      ]
  },
  {
      "class": "priest",
      "specializations": [
          "holy",
          "shadow",
          "discipline"
      ]
  },
  {
      "class": "warlock",
      "specializations": [
          "demonology",
          "destruction",
          "affliction"
      ]
  },
  {
      "class": "warrior",
      "specializations": [
          "arms",
          "fury",
          "protection"
      ]
  },
  {
      "class": "paladin",
      "specializations": [
          "holy",
          "retribution",
          "protection"
      ]
  },
  {
      "class": "evoker",
      "specializations": [
          "augmentation",
          "preservation"
      ]
  },
  {
      "class": "demon_hunter",
      "specializations": [
          "havoc",
          "vengeance"
      ]
  },
  {
      "class": "druid",
      "specializations": [
          "guardian",
          "feral",
          "balance",
          "restoration"
      ]
  },
  {
      "class": "mage",
      "specializations": [
          "arcane",
          "frost",
          "fire"
      ]
  },
  {
      "class": "rogue",
      "specializations": [
          "assassination",
          "outlaw",
          "subtlety"
      ]
  }
]


json.dump(charClasses, open("charClasses.json", "w"), indent=2)