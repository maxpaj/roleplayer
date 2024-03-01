import { Id } from "../../lib/generate-id";
import { Character } from "../character/character";
import { Position } from "./campaign";

export type CampaignEventType =
  | { type: "Unknown" }
  | { type: "RoundStarted" }
  | { type: "RoundEnded" }
  | { type: "BattleStarted" }
  | { type: "CharacterSpawned"; characterId: Character["id"] }
  | { type: "CharacterChangedName"; characterId: Character["id"]; name: string }
  | {
      type: "CharacterSetBaseDefense";
      characterId: Character["id"];
      defense: number;
    }
  | {
      type: "CharacterSetExperience";
      characterId: Character["id"];
      experience: number;
    }
  | { type: "CharacterDespawn"; characterId: Character["id"] }
  | { type: "CharacterStartRound"; characterId: Character["id"] }
  | {
      type: "CharacterPrimaryAction";
      characterId: Character["id"];
      interactionId: Id;
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
  | { type: "CharacterItemGain"; characterId: Character["id"]; itemId: Id }
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
      interactionId: Id;
      statusId: Id;
    }
  | { type: "CharacterAttackAttackerHit"; characterId: Character["id"] }
  | { type: "CharacterAttackAttackerMiss"; characterId: Character["id"] }
  | {
      type: "CharacterAttackDefenderHit";
      characterId: Character["id"];
      interactionId: Id;
    }
  | {
      type: "CharacterAttackDefenderDodge";
      characterId: Character["id"];
      interactionId: Id;
    }
  | { type: "CharacterAttackDefenderParry"; characterId: Character["id"] }
  | {
      type: "CharacterHealthGain";
      characterId: Character["id"];
      interactionId: Id;
      healthGain: number;
    }
  | {
      type: "CharacterHealthLoss";
      characterId: Character["id"];
      interactionId: Id;
      healthLoss: number;
    }
  | {
      type: "CharacterHealthChange";
      characterId: Character["id"];
      healthChange: number;
    }
  | { type: "CharacterClassGain"; characterId: Character["id"]; classId: Id };
