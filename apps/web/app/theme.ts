import { CharacterResourceDefinition, RoleplayerEvent } from "roleplayer";
import dodgeEvent from "../assets/icons/felbrigg/dodge.svg";
import moveIcon from "../assets/icons/lorc/boot-prints.svg";
import newRoundIcon from "../assets/icons/lorc/time-trap.svg";
import defaultIcon from "../assets/logo.svg";

export { defaultIcon };

type ClassColors = {
  [key: string]: string;
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
  [key: string]: string;
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

export const EventIconMap: {
  [key in RoleplayerEvent["type"]]: { alt: string; icon: any };
} = {
  CharacterEndTurn: {
    alt: "Character end round",
    icon: defaultIcon,
  },
  CharacterMovement: {
    alt: "Character movement",
    icon: moveIcon,
  },
  RoundStarted: {
    alt: "New round",
    icon: newRoundIcon,
  },
  CharacterAttackDefenderDodge: {
    alt: "Dodge",
    icon: dodgeEvent,
  },
  CharacterSpawned: {
    alt: "CharacterSpawned",
    icon: defaultIcon,
  },
  Unknown: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterDespawn: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterInventoryItemGain: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterPositionSet: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterResourceGain: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterStatusGain: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterAttackAttackerHit: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterAttackAttackerMiss: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterAttackDefenderHit: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterAttackDefenderParry: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterClassLevelGain: {
    alt: "",
    icon: defaultIcon,
  },
  BattleStarted: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterExperienceSet: {
    alt: "",
    icon: defaultIcon,
  },
  RoundEnded: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterActionGain: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterEquipmentSlotGain: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterInventoryItemEquip: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterBattleEnter: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterClassReset: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterResourceMaxSet: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterStatChange: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterExperienceChanged: {
    alt: "",
    icon: defaultIcon,
  },
  CampaignStarted: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterNameSet: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterResourceLoss: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterInventoryItemLoss: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterInventoryItemUnEquip: {
    alt: "",
    icon: defaultIcon,
  },
};

export const CharacterResourceTypesIconMap: {
  [key in CharacterResourceDefinition["name"]]: { alt: string; icon: any };
} = {
  "Movement speed": {
    alt: "Movement speed",
    icon: moveIcon,
  },
  Health: {
    alt: "Health",
    icon: defaultIcon,
  },
  "Primary actions": {
    alt: "Primary actions",
    icon: defaultIcon,
  },
  Unknown: {
    alt: "",
    icon: defaultIcon,
  },
};
