import { Id } from "../../lib/generate-id";
import { Character } from "../character/character";
import { Interaction } from "../interaction/interaction";
import { Item } from "../item/item";
import { Position } from "./world";

export type WorldEventType =
  | { type: "Unknown" }
  | { type: "RoundStarted" }
  | { type: "RoundEnded" }
  | { type: "BattleStarted" }
  | { type: "CharacterSpawned"; characterId: Character["id"] }
  | { type: "CharacterNameChanged"; characterId: Character["id"]; name: string }
  | {
      type: "CharacterBaseDefenseChanged";
      characterId: Character["id"];
      defense: number;
    }
  | {
      type: "CharacterExperienceGain";
      characterId: Character["id"];
      experience: number;
    }
  | {
      type: "CharacterExperienceChanged";
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
  | { type: "CharacterSpellGain"; characterId: Character["id"]; spellId: Id }
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
      type: "CharacterMaximumHealthChange";
      characterId: Character["id"];
      maximumHealth: number;
    }
  | {
      type: "CharacterPositionChange";
      characterId: Character["id"];
      targetPosition: Position;
    }
  | {
      type: "CharacterMoveSpeedChange";
      characterId: Character["id"];
      movementSpeed: number;
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
      characterId: Character["id"];
      interactionId: Interaction["id"];
    }
  | {
      type: "CharacterAttackDefenderDodge";
      characterId: Character["id"];
      interactionId: Interaction["id"];
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
      type: "CharacterHealthChange";
      characterId: Character["id"];
      healthChange: number;
    }
  | { type: "CharacterClassGain"; characterId: Character["id"]; classId: Id };
