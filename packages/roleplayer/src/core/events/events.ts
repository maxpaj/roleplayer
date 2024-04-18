import type { Id } from "../../lib/generate-id";
import type { ActionDefinition } from "../action/action";
import type { Actor, CharacterInventoryItem, Position } from "../actor/character";
import type { Battle } from "../battle/battle";
import type { Round } from "../campaign/round";
import type { ItemDefinition } from "../inventory/item";
import type { CharacterResourceDefinition, CharacterStatType, Clazz } from "../ruleset/ruleset";

type EventIdentifier = { id: Id; serialNumber: number };

type RoundEvent = {
  roundId: Round["id"];
  battleId?: Battle["id"];
};

export type BattleCampaignEvent = CampaignEvent & { battleId: Battle["id"] };

export type CampaignEvent = SystemEvent | CharacterEvent;

export type RoleplayerEvent = EventIdentifier & RoundEvent & CampaignEvent;

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
  "CharacterEndTurn",
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

export type SystemEvent =
  | { type: "Unknown" }
  | { type: "CampaignStarted" }
  | { type: "RoundStarted"; roundId: Round["id"]; battleId?: Battle["id"] }
  | { type: "RoundEnded" }
  | { type: "BattleStarted"; battleId: Battle["id"] }
  | {
      type: "CharacterBattleEnter";
      characterId: Actor["id"];
      battleId: Battle["id"];
    }
  | {
      type: "CharacterBattleLeave";
      characterId: Actor["id"];
      battleId: Battle["id"];
    };

export type CharacterEvent =
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
  | { type: "CharacterEndTurn"; characterId: Actor["id"]; battleId: Battle["id"] }
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

export function isBattleEvent(event: CampaignEvent): event is BattleCampaignEvent {
  return "battleId" in event && event.battleId != null;
}
