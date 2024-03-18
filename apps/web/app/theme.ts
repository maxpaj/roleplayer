import defaultIcon from "../assets/logo.svg";
import moveIcon from "../assets/icons/lorc/boot-prints.svg";
import newRoundIcon from "../assets/icons/lorc/time-trap.svg";
import dodgeEvent from "../assets/icons/felbrigg/dodge.svg";
import { CampaignEventType } from "roleplayer";

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
  [key in CampaignEventType["type"]]: { alt: string; icon: any };
} = {
  CharacterStartRound: {
    alt: "Character start round",
    icon: defaultIcon,
  },
  CharacterEndRound: {
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
  CharacterItemGain: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterPositionSet: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterResourceCurrentChange: {
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
  CharacterBaseDefenseSet: {
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
  CharacterItemEquip: {
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
  MonsterBattleEnter: {
    alt: "",
    icon: defaultIcon,
  },
  CampaignStarted: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterBattleInitiativeSet: {
    alt: "",
    icon: defaultIcon,
  },
  CharacterNameSet: {
    alt: "",
    icon: defaultIcon,
  },
};
