import { Id, generateId } from "../../lib/generate-id";
import { World, WorldEvent, isCharacterEvent } from "../world/world";
import { Character } from "../character/character";
import { getCharacterInitiative } from "../character/character-stats";

export type Round = {
  id: Id;
};

export class BattleCharacter {
  public characterId!: Id;
  public initiative!: number;

  public constructor(init?: Partial<BattleCharacter>) {
    Object.assign(this, init);
  }

  applyEvent(event: WorldEvent, campaign: World) {}
}

export class Battle {
  public id: Id;
  public name: string;
  public characters: BattleCharacter[];

  public constructor(
    name: string = "New battle",
    characters: BattleCharacter[] = []
  ) {
    this.id = generateId();
    this.name = name;
    this.characters = characters;
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

  currentCharacterTurn(events: WorldEvent[]) {
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
