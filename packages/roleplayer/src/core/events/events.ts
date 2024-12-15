import type { Id } from "../../lib/generate-id";
import type { ActionDefinition } from "../action/action";
import type { Actor, CharacterInventoryItem, Position } from "../actor/character";
import type { Battle } from "../battle/battle";
import type { Round } from "../campaign/round";
import type { ItemDefinition } from "../inventory/item";
import type { CharacterStatType, Clazz, ResourceDefinition } from "../ruleset/ruleset";

type EventIdentifier = { id: Id; serialNumber: number };

type RoundEvent = {
  roundId: Round["id"];
  battleId?: Battle["id"];
};

export type BattleCampaignEvent = CampaignEvent & { battleId: Battle["id"] };

export type CampaignEvent = SystemEvent | CharacterEvent;

export type RoleplayerEvent = EventIdentifier & RoundEvent & CampaignEvent;

export enum CharacterEventTypes {
  CharacterSpawned = "CharacterSpawned",
  CharacterNameSet = "CharacterNameSet",
  CharacterResourceMaxSet = "CharacterResourceMaxSet",
  CharacterResourceGain = "CharacterResourceGain",
  CharacterResourceLoss = "CharacterResourceLoss",
  CharacterStatChange = "CharacterStatChange",
  CharacterExperienceChanged = "CharacterExperienceChanged",
  CharacterExperienceSet = "CharacterExperienceSet",
  CharacterDespawn = "CharacterDespawn",
  CharacterMovement = "CharacterMovement",
  CharacterEndTurn = "CharacterEndTurn",
  CharacterActionGain = "CharacterActionGain",
  CharacterEquipmentSlotGain = "CharacterEquipmentSlotGain",
  CharacterInventoryItemGain = "CharacterInventoryItemGain",
  CharacterInventoryItemLoss = "CharacterInventoryItemLoss",
  CharacterInventoryItemEquip = "CharacterInventoryItemEquip",
  CharacterInventoryItemUnEquip = "CharacterInventoryItemUnEquip",
  CharacterPositionSet = "CharacterPositionSet",
  CharacterStatusGain = "CharacterStatusGain",
  CharacterAttackAttackerHit = "CharacterAttackAttackerHit",
  CharacterAttackAttackerMiss = "CharacterAttackAttackerMiss",
  CharacterAttackDefenderHit = "CharacterAttackDefenderHit",
  CharacterAttackDefenderDodge = "CharacterAttackDefenderDodge",
  CharacterAttackDefenderParry = "CharacterAttackDefenderParry",
  CharacterClassReset = "CharacterClassReset",
  CharacterClassLevelGain = "CharacterClassLevelGain",
}

export enum SystemEventType {
  Unknown = "Unknown",
  CampaignStarted = "CampaignStarted",
  RoundStarted = "RoundStarted",
  RoundEnded = "RoundEnded",
  BattleStarted = "BattleStarted",
  BattleEnded = "BattleEnded",
  CharacterBattleEnter = "CharacterBattleEnter",
  CharacterBattleLeave = "CharacterBattleLeave",
}

export type RoleplayerEventTypes = typeof CharacterEventTypes & typeof SystemEventType;

export type SystemEvent =
  | { type: SystemEventType.Unknown }
  | { type: SystemEventType.CampaignStarted }
  | { type: SystemEventType.RoundStarted; roundId: Round["id"]; battleId?: Battle["id"] }
  | { type: SystemEventType.RoundEnded }
  | { type: SystemEventType.BattleStarted; battleId: Battle["id"] }
  | { type: SystemEventType.BattleEnded; battleId: Battle["id"] }
  | {
    type: SystemEventType.CharacterBattleEnter;
    characterId: Actor["id"];
    battleId: Battle["id"];
  }
  | {
    type: SystemEventType.CharacterBattleLeave;
    characterId: Actor["id"];
    battleId: Battle["id"];
  };

export type CharacterEvent =
  | { type: CharacterEventTypes.CharacterSpawned; characterId: Actor["id"]; templateCharacterId?: Actor["id"] }
  | { type: CharacterEventTypes.CharacterNameSet; characterId: Actor["id"]; name: string }
  | {
    type: CharacterEventTypes.CharacterResourceMaxSet;
    characterId: Actor["id"];
    resourceTypeId: ResourceDefinition["id"];
    max: number;
  }
  | {
    type: CharacterEventTypes.CharacterResourceGain;
    characterId: Actor["id"];
    amount: number;
    resourceTypeId: ResourceDefinition["id"];
    actionId?: ActionDefinition["id"];
    sourceId?: Actor["id"];
  }
  | {
    type: CharacterEventTypes.CharacterResourceLoss;
    characterId: Actor["id"];
    amount: number;
    resourceTypeId: ResourceDefinition["id"];
    actionId?: ActionDefinition["id"];
    sourceId?: Actor["id"];
  }
  | {
    type: CharacterEventTypes.CharacterStatChange;
    characterId: Actor["id"];
    amount: number;
    statId: CharacterStatType["id"];
  }
  | {
    type: CharacterEventTypes.CharacterExperienceChanged;
    characterId: Actor["id"];
    experience: number;
  }
  | {
    type: CharacterEventTypes.CharacterExperienceSet;
    characterId: Actor["id"];
    experience: number;
  }
  | { type: CharacterEventTypes.CharacterDespawn; characterId: Actor["id"] }
  | {
    type: CharacterEventTypes.CharacterMovement;
    characterId: Actor["id"];
    targetPosition: Position;
    sourceId?: Actor["id"];
  }
  | { type: CharacterEventTypes.CharacterEndTurn; characterId: Actor["id"]; battleId: Battle["id"] }
  | { type: CharacterEventTypes.CharacterActionGain; characterId: Actor["id"]; actionId: Id }
  | {
    type: CharacterEventTypes.CharacterEquipmentSlotGain;
    characterId: Actor["id"];
    equipmentSlotId: Id;
  }
  | {
    type: CharacterEventTypes.CharacterInventoryItemGain;
    characterId: Actor["id"];
    itemDefinitionId: ItemDefinition["id"];
    itemInstanceId: CharacterInventoryItem["id"];
  }
  | {
    type: CharacterEventTypes.CharacterInventoryItemLoss;
    characterId: Actor["id"];
    characterInventoryItemId: ItemDefinition["id"];
  }
  | {
    type: CharacterEventTypes.CharacterInventoryItemEquip;
    characterId: Actor["id"];
    itemId: ItemDefinition["id"];
    equipmentSlotId: Id;
  }
  | {
    type: CharacterEventTypes.CharacterInventoryItemUnEquip;
    characterId: Actor["id"];
    itemId?: ItemDefinition["id"];
    equipmentSlotId: Id;
  }
  | {
    type: CharacterEventTypes.CharacterPositionSet;
    characterId: Actor["id"];
    targetPosition: Position;
  }
  | {
    type: CharacterEventTypes.CharacterStatusGain;
    characterId: Actor["id"];
    actionId: ActionDefinition["id"];
    sourceId?: Actor["id"];
    statusId: Id;
  }
  | { type: CharacterEventTypes.CharacterAttackAttackerHit; characterId: Actor["id"] }
  | { type: CharacterEventTypes.CharacterAttackAttackerMiss; characterId: Actor["id"] }
  | {
    type: CharacterEventTypes.CharacterAttackDefenderHit;
    attackerId: Actor["id"];
    characterId: Actor["id"];
    actionDefinitionId: ActionDefinition["id"];
  }
  | {
    type: CharacterEventTypes.CharacterAttackDefenderDodge;
    characterId: Actor["id"];
    actionId: ActionDefinition["id"];
    attackerId: Actor["id"];
  }
  | { type: CharacterEventTypes.CharacterAttackDefenderParry; characterId: Actor["id"] }
  | {
    type: CharacterEventTypes.CharacterClassReset;
    characterId: Actor["id"];
  }
  | {
    type: CharacterEventTypes.CharacterClassLevelGain;
    characterId: Actor["id"];
    classId: Clazz["id"];
  };

export function isBattleEvent(event: CampaignEvent): event is BattleCampaignEvent {
  return "battleId" in event && event.battleId != null;
}
