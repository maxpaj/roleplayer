import { Id } from "../../lib/generate-id";
import { ActionDefinition } from "../action/action";
import { Actor, CharacterInventoryItem, Position } from "../actor/character";
import { Battle } from "../battle/battle";
import { Campaign } from "../campaign/campaign";
import { Round } from "../campaign/round";
import { ItemDefinition } from "../inventory/item";
import { CharacterResourceDefinition, CharacterStatType, Clazz } from "../ruleset/ruleset";

export type CampaignEventWithRound = CampaignEvent & {
  roundId: Round["id"];
  battleId?: Battle["id"];
  serialNumber: number;
  campaignId: Campaign["id"];
};

export type CampaignEvent = RoleplayerEvent & {
  id: Id;
};

export type RoleplayerEvent = SystemEventType | CharacterEventType;

export const RoleplayerEventTypes: RoleplayerEvent["type"][] = [
  "Unknown",
  "CampaignStarted",
  "RoundStarted",
  "RoundEnded",
  "BattleStarted",
  "CharacterBattleEnter",
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
  "CharacterInventoryItemGain",
  "CharacterInventoryItemEquip",
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
    };

export type CharacterEventType =
  | { type: "CharacterSpawned"; characterId: Actor["id"]; templateCharacterId?: Actor["id"] }
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
      sourceId?: Actor["id"];
    }
  | {
      type: "CharacterResourceLoss";
      characterId: Actor["id"];
      amount: number;
      resourceTypeId: CharacterResourceDefinition["id"];
      actionId?: ActionDefinition["id"];
      sourceId?: Actor["id"];
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
      sourceId?: Actor["id"];
    }
  | { type: "CharacterEndRound"; characterId: Actor["id"] }
  | { type: "CharacterActionGain"; characterId: Actor["id"]; actionId: Id }
  | {
      type: "CharacterEquipmentSlotGain";
      characterId: Actor["id"];
      equipmentSlotId: Id;
    }
  | {
      type: "CharacterInventoryItemGain";
      characterId: Actor["id"];
      itemDefinitionId: ItemDefinition["id"];
      itemInstanceId: CharacterInventoryItem["id"];
    }
  | {
      type: "CharacterInventoryItemLoss";
      characterId: Actor["id"];
      characterInventoryItemId: ItemDefinition["id"];
    }
  | {
      type: "CharacterInventoryItemEquip";
      characterId: Actor["id"];
      itemId: ItemDefinition["id"];
      equipmentSlotId: Id;
    }
  | {
      type: "CharacterInventoryItemUnEquip";
      characterId: Actor["id"];
      itemId?: ItemDefinition["id"];
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
      sourceId?: Actor["id"];
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
