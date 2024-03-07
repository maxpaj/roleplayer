import { Id } from "../../lib/generate-id";
import { Character, isCharacterEvent } from "../character/character";
import { CampaignEvent } from "../campaign/campaign-events";
import { D20 } from "../dice/dice";
import { roll } from "../dice/dice";
import { AugmentedRequired } from "../../types/with-required";

export type Round = {
  id: Id;
};

export class BattleCharacter {
  characterId!: Id;
  initiative!: number;

  constructor(init?: Partial<BattleCharacter>) {
    Object.assign(this, init);
  }
}

export function getCharacterInitiative(c: Character) {
  return roll(D20) + c.getAbilityModifier();
}

export class Battle {
  id!: Id;
  name!: string;
  characters: BattleCharacter[] = [];

  constructor(b: AugmentedRequired<Partial<Battle>, "name">) {
    Object.assign(this, b);
  }

  hasRolledForInitiative() {
    return this.characters.every((c) => c.initiative != 0);
  }

  addCharacterToCurrentBattle(character: Character) {
    const added = new BattleCharacter({
      characterId: character.id,
      initiative: getCharacterInitiative(character),
    });
    this.characters.push(added);
    return added;
  }

  currentCharacterTurn(events: CampaignEvent[]) {
    const charactersNotActedCurrentRound = this.characters.filter(
      (battleChar) => {
        const hasActed = events.some(
          (e) =>
            isCharacterEvent(e) &&
            e.characterId === battleChar.characterId &&
            e.type === "CharacterEndRound"
        );

        return !hasActed;
      }
    );

    const sorted = charactersNotActedCurrentRound.sort(
      (a, b) => b.initiative - a.initiative
    );

    return sorted[0];
  }
}
