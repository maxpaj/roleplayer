import { CharacterResourceDefinition, CharacterStatType, Clazz } from "../ruleset/ruleset";
import { Id } from "../../lib/generate-id";
import { Actor, Position } from "../actor/character";
import { Battle } from "../battle/battle";
import { ActionDefinition } from "../action/action";
import { Item } from "../inventory/item";
import { Round } from "./round";

export type CampaignEvent = CampaignEventType & {
  id: Id;
};

export type CampaignEventWithRound = CampaignEvent & {
  roundId: Round["id"];
  battleId?: Battle["id"];
  serialNumber: number;
};

export type CampaignEventType = SystemEventType | CharacterEventType;

export const CampaignEventTypes: CampaignEventType["type"][] = [
  "Unknown",
  "CampaignStarted",
  "RoundStarted",
  "RoundEnded",
  "BattleStarted",
  "CharacterBattleEnter",
  "CharacterBattleCharacterOrderSet",
  "CharacterSpawned",
  "CharacterNameSet",
  "CharacterResourceMaxSet",
  "CharacterResourceGain",
  "CharacterResourceLoss",
  "CharacterStatChange",
  "CharacterExperienceChanged",
  "CharacterExperienceSet",
  "CharacterDespawn",
  "CharacterMovement",
  "CharacterEndRound",
  "CharacterActionGain",
  "CharacterEquipmentSlotGain",
  "CharacterItemGain",
  "CharacterItemEquip",
  "CharacterPositionSet",
  "CharacterStatusGain",
  "CharacterAttackAttackerHit",
  "CharacterAttackAttackerMiss",
  "CharacterAttackDefenderHit",
  "CharacterAttackDefenderDodge",
  "CharacterAttackDefenderParry",
  "CharacterClassReset",
  "CharacterClassLevelGain",
] as const;

export type SystemEventType =
  | { type: "Unknown" }
  | { type: "CampaignStarted" }
  | { type: "RoundStarted" }
  | { type: "RoundEnded" }
  | { type: "BattleStarted" }
  | {
      type: "CharacterBattleEnter";
      characterId: Actor["id"];
    }
  | {
      type: "CharacterBattleCharacterOrderSet";
      characterId: Actor["id"];
      order: number;
    };

export type CharacterEventType =
  | { type: "CharacterSpawned"; characterId: Actor["id"] }
  | { type: "CharacterNameSet"; characterId: Actor["id"]; name: string }
  | {
      type: "CharacterResourceMaxSet";
      characterId: Actor["id"];
      resourceTypeId: CharacterResourceDefinition["id"];
      max: number;
    }
  | {
      type: "CharacterResourceGain";
      characterId: Actor["id"];
      amount: number;
      resourceTypeId: CharacterResourceDefinition["id"];
      actionId?: ActionDefinition["id"];
    }
  | {
      type: "CharacterResourceLoss";
      characterId: Actor["id"];
      amount: number;
      resourceTypeId: CharacterResourceDefinition["id"];
      actionId?: ActionDefinition["id"];
    }
  | {
      type: "CharacterStatChange";
      characterId: Actor["id"];
      amount: number;
      statId: CharacterStatType["id"];
    }
  | {
      type: "CharacterExperienceChanged";
      characterId: Actor["id"];
      experience: number;
    }
  | {
      type: "CharacterExperienceSet";
      characterId: Actor["id"];
      experience: number;
    }
  | { type: "CharacterDespawn"; characterId: Actor["id"] }
  | {
      type: "CharacterMovement";
      characterId: Actor["id"];
      targetPosition: Position;
    }
  | { type: "CharacterEndRound"; characterId: Actor["id"] }
  | { type: "CharacterActionGain"; characterId: Actor["id"]; actionId: Id }
  | {
      type: "CharacterEquipmentSlotGain";
      characterId: Actor["id"];
      equipmentSlotId: Id;
    }
  | {
      type: "CharacterItemGain";
      characterId: Actor["id"];
      itemId: Item["id"];
    }
  | {
      type: "CharacterItemEquip";
      characterId: Actor["id"];
      itemId: Item["id"];
      equipmentSlotId: Id;
    }
  | {
      type: "CharacterPositionSet";
      characterId: Actor["id"];
      targetPosition: Position;
    }
  | {
      type: "CharacterStatusGain";
      characterId: Actor["id"];
      actionId: ActionDefinition["id"];
      statusId: Id;
    }
  | { type: "CharacterAttackAttackerHit"; characterId: Actor["id"] }
  | { type: "CharacterAttackAttackerMiss"; characterId: Actor["id"] }
  | {
      type: "CharacterAttackDefenderHit";
      attackerId: Actor["id"];
      characterId: Actor["id"];
      actionDefinitionId: ActionDefinition["id"];
    }
  | {
      type: "CharacterAttackDefenderDodge";
      characterId: Actor["id"];
      actionId: ActionDefinition["id"];
      attackerId: Actor["id"];
    }
  | { type: "CharacterAttackDefenderParry"; characterId: Actor["id"] }
  | {
      type: "CharacterClassReset";
      characterId: Actor["id"];
    }
  | {
      type: "CharacterClassLevelGain";
      characterId: Actor["id"];
      classId: Clazz["id"];
    };
