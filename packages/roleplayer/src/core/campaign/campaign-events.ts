import { Id } from "../../lib/generate-id";
import {
  Character,
  CharacterResourceType,
  CharacterStatType,
  Clazz,
  Position,
} from "../actor/character";
import { Monster } from "../actor/monster";
import { Battle } from "../battle/battle";
import { Interaction } from "../world/interaction/interaction";
import { Item } from "../world/item/item";
import { Round } from "./round";

export type CampaignEvent = CampaignEventType & {
  id: Id;
};

export type CampaignEventWithRound = CampaignEvent & {
  roundId: Round["id"];
  battleId?: Battle["id"];
};

export type CampaignEventType =
  | { type: "Unknown" }
  | { type: "CampaignStarted" }
  | { type: "RoundStarted" }
  | { type: "RoundEnded" }
  | { type: "BattleStarted" }
  | { type: "CharacterSpawned"; characterId: Character["id"] }
  | { type: "CharacterNameSet"; characterId: Character["id"]; name: string }
  | {
      type: "CharacterResourceMaxSet";
      characterId: Character["id"];
      resourceTypeId: CharacterResourceType["id"];
      max: number;
    }
  | {
      type: "CharacterResourceCurrentChange";
      characterId: Character["id"];
      amount: number;
      resourceTypeId: CharacterResourceType["id"];
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
      type: "CharacterPrimaryAction";
      characterId: Character["id"];
      interactionId: Interaction["id"];
    }
  | { type: "CharacterSecondaryAction"; characterId: Character["id"] }
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
      type: "CharacterMaximumHealthSet";
      characterId: Character["id"];
      maximumHealth: number;
    }
  | {
      type: "CharacterPositionSet";
      characterId: Character["id"];
      targetPosition: Position;
    }
  | {
      type: "CharacterStatusGain";
      characterId: Character["id"];
      interactionId: Interaction["id"];
      statusId: Id;
    }
  | { type: "CharacterAttackAttackerHit"; characterId: Character["id"] }
  | { type: "CharacterAttackAttackerMiss"; characterId: Character["id"] }
  | {
      type: "CharacterAttackDefenderHit";
      attackerId: Character["id"];
      characterId: Character["id"];
      interactionId: Interaction["id"];
    }
  | {
      type: "CharacterAttackDefenderDodge";
      characterId: Character["id"];
      interactionId: Interaction["id"];
      attackerId: Character["id"];
    }
  | { type: "CharacterAttackDefenderParry"; characterId: Character["id"] }
  | {
      type: "CharacterHealthGain";
      characterId: Character["id"];
      interactionId: Interaction["id"];
      healthGain: number;
    }
  | {
      type: "CharacterHealthLoss";
      characterId: Character["id"];
      interactionId: Interaction["id"];
      healthLoss: number;
    }
  | {
      type: "CharacterHealthSet";
      characterId: Character["id"];
      healthChange: number;
    }
  | {
      type: "CharacterClassReset";
      characterId: Character["id"];
    }
  | {
      type: "CharacterClassLevelGain";
      characterId: Character["id"];
      classId: Clazz["id"];
    }
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
