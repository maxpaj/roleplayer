import {
  ActionType,
  Clazz,
} from "../../../../packages/dnd/core/character/character";

import defaultIcon from "../assets/logo.svg";
import attackIcon from "../assets/icons/lorc/thrown-knife.svg";
import moveIcon from "../assets/icons/lorc/boot-prints.svg";
import newRoundIcon from "../assets/icons/lorc/time-trap.svg";
import primaryActionIcon from "../assets/icons/skoll/rank-1.svg";
import secondaryActionIcon from "../assets/icons/skoll/rank-2.svg";
import dodgeEvent from "../assets/icons/felbrigg/dodge.svg";
import characterLostHealthEventIcon from "../assets/icons/zeromancer/heart-minus.svg";
import characterGainHealthEventIcon from "../assets/icons/zeromancer/heart-plus.svg";
import { CampaignEventType } from "../../../../packages/dnd/core/campaign/campaign";

type ClassColors = {
  [key: string]: string;
};

export const colors: ClassColors = {
  "Barbarian": "#e7623e",
  "Bard": "#ab6dac",
  "Cleric": "#91a1b2",
  "Druid": "#7a853b",
  "Fighter": "#7f513e",
  "Monk": "#51a5c5",
  "Paladin": "#b59e54",
  "Ranger": "#507f62",
  "Rogue": "#555752",
  "Sorcerer": "#992e2e",
  "Warlock": "#7b469b",
  "Wizard": "#2a50a1",
};

type ClassIcons = {
  [key: string]: string;
};

export const icons: ClassIcons = {
  "Barbarian": "assets/dnd/Class Icon - Barbarian.svg",
  "Bard": "assets/dnd/Class Icon - Bard.svg",
  "Cleric": "assets/dnd/Class Icon - Cleric.svg",
  "Druid": "assets/dnd/Class Icon - Druid.svg",
  "Fighter": "assets/dnd/Class Icon - Fighter.svg",
  "Monk": "assets/dnd/Class Icon - Monk.svg",
  "Paladin": "assets/dnd/Class Icon - Paladin.svg",
  "Ranger": "assets/dnd/Class Icon - Ranger.svg",
  "Rogue": "assets/dnd/Class Icon - Rogue.svg",
  "Sorcerer": "assets/dnd/Class Icon - Sorcerer.svg",
  "Warlock": "assets/dnd/Class Icon - Warlock.svg",
  "Wizard": "assets/dnd/Class Icon - Wizard.svg",
};

export const ActionIconMap: {
  [key in ActionType]: { alt: string; icon: any };
} = {
  [ActionType.Attack]: {
    alt: "Attack",
    icon: attackIcon,
  },
  [ActionType.Sprint]: {
    alt: "Sprint",
    icon: defaultIcon,
  },
  [ActionType.Jump]: {
    alt: "Jump",
    icon: defaultIcon,
  },
  [ActionType.Cantrip]: {
    alt: "Cantrip",
    icon: defaultIcon,
  },
  [ActionType.Spell]: {
    alt: "Spell",
    icon: defaultIcon,
  },
  [ActionType.Item]: {
    alt: "Item",
    icon: defaultIcon,
  },
  [ActionType.Equipment]: {
    alt: "Equipment",
    icon: defaultIcon,
  },
  [ActionType.None]: {
    alt: "None",
    icon: defaultIcon,
  },
  [ActionType.Dodge]: {
    alt: "Dodge",
    icon: defaultIcon
  }
};

export const EventIconMap: {
  [key in CampaignEventType]: { alt: string; icon: any };
} = {
  [CampaignEventType.CharacterStartRound]: {
    alt: "Character start round",
    icon: defaultIcon,
  },
  [CampaignEventType.CharacterEndRound]: {
    alt: "Character end round",
    icon: defaultIcon,
  },
  [CampaignEventType.CharacterMovement]: {
    alt: "Character movement",
    icon: moveIcon,
  },
  [CampaignEventType.CharacterPrimaryAction]: {
    alt: "Primary action",
    icon: primaryActionIcon,
  },
  [CampaignEventType.CharacterSecondaryAction]: {
    alt: "Secondary action",
    icon: secondaryActionIcon,
  },
  [CampaignEventType.NewRound]: {
    alt: "New round",
    icon: newRoundIcon,
  },
  [CampaignEventType.CharacterSpellGain]: {
    alt: "Character gained health",
    icon: characterGainHealthEventIcon,
  },
  [CampaignEventType.CharacterAttackDefenderDodge]: {
    alt: "Dodge",
    icon: dodgeEvent,
  },
  [CampaignEventType.CharacterSpawned]: {
    alt: "CharacterSpawned",
    icon: defaultIcon,
  },
  [CampaignEventType.Unknown]: {
    alt: "",
    icon: defaultIcon
  },
  [CampaignEventType.CharacterDespawn]: {
    alt: "",
    icon: defaultIcon
  },
  [CampaignEventType.CharacterItemGain]: {
    alt: "",
    icon: defaultIcon
  },
  [CampaignEventType.CharacterHealthChange]: {
    alt: "",
    icon: defaultIcon
  },
  [CampaignEventType.CharacterPermanentHealthChange]: {
    alt: "",
    icon: defaultIcon
  },
  [CampaignEventType.CharacterPositionChange]: {
    alt: "",
    icon: defaultIcon
  },
  [CampaignEventType.CharacterMoveSpeedChange]: {
    alt: "",
    icon: defaultIcon
  },
  [CampaignEventType.CharacterStatusGain]: {
    alt: "",
    icon: defaultIcon
  },
  [CampaignEventType.CharacterAttackAttackerHit]: {
    alt: "",
    icon: defaultIcon
  },
  [CampaignEventType.CharacterAttackAttackerMiss]: {
    alt: "",
    icon: defaultIcon
  },
  [CampaignEventType.CharacterAttackDefenderHit]: {
    alt: "",
    icon: defaultIcon
  },
  [CampaignEventType.CharacterAttackDefenderParry]: {
    alt: "",
    icon: defaultIcon
  },
  [CampaignEventType.CharacterHealthGain]: {
    alt: "",
    icon: characterGainHealthEventIcon,
  },
  [CampaignEventType.CharacterHealthLoss]: {
    alt: "Character lost health",
    icon: characterLostHealthEventIcon,
  },
};
