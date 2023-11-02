import { Character } from "../character/character";

type Id = string;

export type BattleCharacter = {
  character: Character;
  initiative: number;
};

export type BattleCharacterAction = {
  characterId: string;
  action: BattleAction;
};

export type BattleRound = {
  id: Id;
};

export type BattleEvent = {
  characterId: Id;
  roundId: Id;
  eventType: BattleEventType;
  actionType: ActionType;
};

type BattleEventType =
  | "start"
  | "primary-action"
  | "secondary-action"
  | "movement"
  | "end";

type ActionType =
  | "attack"
  | "sprint"
  | "jump"
  | "cantrip"
  | "spell"
  | "item"
  | "equipment"
  | "none";

export type BattleAction = {};

export type Battle = {
  characters: BattleCharacter[];
  rounds: BattleRound[];
  events: BattleEvent[];
};

export function hasRolledForInitiative(battle: Battle) {
  return battle.characters.every((c) => c.initiative != 0);
}

export function getRoundEvents(round: BattleRound, battle: Battle) {
  return battle.events.filter((e) => e.roundId === round.id);
}

export function getCharacterRoundEvents(
  battle: Battle,
  round: BattleRound,
  character: Character
) {
  const roundEvents = getRoundEvents(round, battle);
  return roundEvents.filter((re) => re.characterId === character.id);
}

export function characterHasSpentAction(
  battle: Battle,
  character: Character,
  eventType: BattleEventType
) {
  const round = getCurrentRound(battle);
  const roundCharacterEvents = getCharacterRoundEvents(
    battle,
    round,
    character
  );

  return roundCharacterEvents.some(
    (c) => c.characterId === character.id && c.eventType === eventType
  );
}

export function characterHasSpentPrimaryAction(
  battle: Battle,
  character: Character
) {
  return characterHasSpentAction(battle, character, "primary-action");
}

export function characterHasSpentBonusAction(
  battle: Battle,
  character: Character
) {
  return characterHasSpentAction(battle, character, "secondary-action");
}

export function characterHasFinishedRound(
  battle: Battle,
  character: Character
) {
  return characterHasSpentAction(battle, character, "end");
}

export function characterHasMoved(battle: Battle, character: Character) {
  return characterHasSpentAction(battle, character, "movement");
}

export function currentCharacterTurn(battle: Battle) {
  const charactersNotActedCurrentRound = battle.characters.filter(
    (battleChar) => {
      const currentRound = getCurrentRound(battle);
      const currentRoundEvents = getCharacterRoundEvents(
        battle,
        currentRound,
        battleChar.character
      );
      const hasActed = currentRoundEvents.some(
        (e) =>
          e.characterId === battleChar.character.id && e.eventType === "end"
      );

      return !hasActed;
    }
  );

  const sorted = charactersNotActedCurrentRound.sort(
    (a, b) => b.initiative - a.initiative
  );

  return sorted[0];
}

export function getCurrentRound(battle: Battle) {
  return battle.rounds[battle.rounds.length - 1];
}

export function characterFinished(battle: Battle, characterId: string) {
  const currentRound = getCurrentRound(battle);

  battle.events.push({
    eventType: "end",
    actionType: "none",
    characterId: characterId,
    roundId: currentRound.id,
  });

  return battle;
}

export function characterPerformBonus(battle: Battle, characterId: string) {
  const currentRound = getCurrentRound(battle);

  battle.events.push({
    actionType: "sprint",
    eventType: "secondary-action",
    characterId: characterId,
    roundId: currentRound.id,
  });

  return battle;
}

export function characterPerformAttack(battle: Battle, characterId: string) {
  const currentRound = getCurrentRound(battle);

  battle.events.push({
    actionType: "attack",
    eventType: "primary-action",
    characterId: characterId,
    roundId: currentRound.id,
  });

  return battle;
}
