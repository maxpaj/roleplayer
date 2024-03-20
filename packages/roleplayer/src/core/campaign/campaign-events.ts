import { Id } from "../../lib/generate-id";
import { Character, CharacterResourceType, CharacterStatType, Clazz, Position } from "../actor/character";
import { Monster } from "../actor/monster";
import { Battle } from "../battle/battle";
import { Action } from "../world/action/action";
import { Item } from "../world/item/item";
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

export type SystemEventType =
  | { type: "Unknown" }
  | { type: "CampaignStarted" }
  | { type: "RoundStarted" }
  | { type: "RoundEnded" }
  | { type: "BattleStarted" }
  | {
      type: "CharacterBattleEnter";
      characterId: Character["id"];
    }
  | {
      type: "CharacterBattleInitiativeSet";
      characterId: Character["id"];
      initiative: number;
    }
  | {
      type: "MonsterBattleEnter";
      monsterId: Monster["id"];
    };

export type CharacterEventType =
  | { type: "CharacterSpawned"; characterId: Character["id"] }
  | { type: "CharacterNameSet"; characterId: Character["id"]; name: string }
  | {
      type: "CharacterResourceMaxSet";
      characterId: Character["id"];
      resourceTypeId: CharacterResourceType["id"];
      max: number;
    }
  | {
      type: "CharacterResourceCurrentGain";
      characterId: Character["id"];
      amount: number;
      resourceTypeId: CharacterResourceType["id"];
      actionId?: Action["id"];
    }
  | {
      type: "CharacterResourceCurrentLoss";
      characterId: Character["id"];
      amount: number;
      resourceTypeId: CharacterResourceType["id"];
      actionId?: Action["id"];
    }
  | {
      type: "CharacterStatChange";
      characterId: Character["id"];
      amount: number;
      statId: CharacterStatType["id"];
    }
  | {
      type: "CharacterBaseDefenseSet";
      characterId: Character["id"];
      defense: number;
    }
  | {
      type: "CharacterExperienceChanged";
      characterId: Character["id"];
      experience: number;
    }
  | {
      type: "CharacterExperienceSet";
      characterId: Character["id"];
      experience: number;
    }
  | { type: "CharacterDespawn"; characterId: Character["id"] }
  | { type: "CharacterStartRound"; characterId: Character["id"] }
  | {
      type: "CharacterMovement";
      characterId: Character["id"];
      targetPosition: Position;
    }
  | { type: "CharacterEndRound"; characterId: Character["id"] }
  | { type: "CharacterActionGain"; characterId: Character["id"]; actionId: Id }
  | {
      type: "CharacterEquipmentSlotGain";
      characterId: Character["id"];
      equipmentSlotId: Id;
    }
  | {
      type: "CharacterItemGain";
      characterId: Character["id"];
      itemId: Item["id"];
    }
  | {
      type: "CharacterItemEquip";
      characterId: Character["id"];
      itemId: Item["id"];
      equipmentSlotId: Id;
    }
  | {
      type: "CharacterPositionSet";
      characterId: Character["id"];
      targetPosition: Position;
    }
  | {
      type: "CharacterStatusGain";
      characterId: Character["id"];
      actionId: Action["id"];
      statusId: Id;
    }
  | { type: "CharacterAttackAttackerHit"; characterId: Character["id"] }
  | { type: "CharacterAttackAttackerMiss"; characterId: Character["id"] }
  | {
      type: "CharacterAttackDefenderHit";
      attackerId: Character["id"];
      characterId: Character["id"];
      actionId: Action["id"];
    }
  | {
      type: "CharacterAttackDefenderDodge";
      characterId: Character["id"];
      actionId: Action["id"];
      attackerId: Character["id"];
    }
  | { type: "CharacterAttackDefenderParry"; characterId: Character["id"] }
  | {
      type: "CharacterClassReset";
      characterId: Character["id"];
    }
  | {
      type: "CharacterClassLevelGain";
      characterId: Character["id"];
      classId: Clazz["id"];
    };
