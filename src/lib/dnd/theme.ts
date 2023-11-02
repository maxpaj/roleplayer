import { Clazz } from "./character/character";

type ClassColors = {
  [key in Clazz]: string;
};

export const colors: ClassColors = {
  Barbarian: "#e7623e",
  Bard: "#ab6dac",
  Cleric: "#91a1b2",
  Druid: "#7a853b",
  Fighter: "#7f513e",
  Monk: "#51a5c5",
  Paladin: "#b59e54",
  Ranger: "#507f62",
  Rogue: "#555752",
  Sorcerer: "#992e2e",
  Warlock: "#7b469b",
  Wizard: "#2a50a1",
};

type ClassIcons = {
  [key in Clazz]: string;
};

export const icons: ClassIcons = {
  Barbarian: "assets/dnd/Class Icon - Barbarian.svg",
  Bard: "assets/dnd/Class Icon - Bard.svg",
  Cleric: "assets/dnd/Class Icon - Cleric.svg",
  Druid: "assets/dnd/Class Icon - Druid.svg",
  Fighter: "assets/dnd/Class Icon - Fighter.svg",
  Monk: "assets/dnd/Class Icon - Monk.svg",
  Paladin: "assets/dnd/Class Icon - Paladin.svg",
  Ranger: "assets/dnd/Class Icon - Ranger.svg",
  Rogue: "assets/dnd/Class Icon - Rogue.svg",
  Sorcerer: "assets/dnd/Class Icon - Sorcerer.svg",
  Warlock: "assets/dnd/Class Icon - Warlock.svg",
  Wizard: "assets/dnd/Class Icon - Wizard.svg",
};
