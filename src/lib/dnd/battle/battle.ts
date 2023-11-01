import { Character } from "../character/character";

export type BattleCharacter = {
  character: Character;
  initiative: number;
};

export type BattleCharacterAction = {
  characterId: string;
  action: BattleAction;
};

export type BattleRound = {
  characterActions: BattleCharacterAction[];
};

export type BattleAction = {
  action: "primary" | "secondary";
  type: "attack" | "move";
};

export type Battle = {
  characters: BattleCharacter[];
  rounds: BattleRound[];
};

export function hasRolledForInitiative(battle: Battle) {
  return battle.characters.every((c) => c.initiative > 0);
}

export function characterHasSpentAction(battle: Battle, character: Character) {
  const round = getCurrentRound(battle);
  return round.characterActions.some((c) => c.characterId === character.id);
}

export function currentCharacterTurn(battle: Battle) {
  const charactersNotActedCurrentRound = battle.characters.filter(
    (battleChar) => {
      const currentRound = battle.rounds.slice(-1)[0];
      const hasActed = currentRound.characterActions.some(
        (c) => c.characterId === battleChar.character.id
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

export function characterAttack(battle: Battle, characterId: string) {
  const currentRound = getCurrentRound(battle);

  currentRound.characterActions.push({
    action: {
      action: "primary",
      type: "attack",
    },
    characterId: characterId,
  });

  return battle;
}
