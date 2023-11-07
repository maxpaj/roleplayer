import { Id, generateId } from "@/lib/dnd/id";
import {
  ActionType,
  CampaignEvent,
  CampaignEventType,
} from "../campaign/campaign";
import { Character } from "../character/character";
import { getCharacterInitiative } from "../character/character-stats";

export type Round = {
  id: Id;
};

export type BattleCharacter = {
  characterId: Id;
  initiative: number;
};

export class Battle {
  id: Id;
  characters: BattleCharacter[];
  rounds: Round[];

  constructor(characters: BattleCharacter[] = [], rounds: Round[] = []) {
    this.id = generateId("battle");
    this.characters = characters;
    this.rounds = rounds;
  }

  hasRolledForInitiative() {
    return this.characters.every((c) => c.initiative != 0);
  }

  currentRoundCanEnd(events: CampaignEvent[]) {
    return this.characters.every((c) =>
      events.some(
        (e) =>
          e.eventType === CampaignEventType.CharacterEndRound &&
          e.characterId === c.characterId
      )
    );
  }

  nextRound() {
    const next = { id: `round-${this.rounds.length + 1}` };
    this.rounds.push(next);
    return next;
  }

  addCharacterToCurrentBattle(character: Character) {
    const added = {
      characterId: character.id,
      initiative: getCharacterInitiative(character),
    };
    this.characters.push(added);
    return added;
  }

  currentCharacterTurn(currentRoundEvents: CampaignEvent[]) {
    const charactersNotActedCurrentRound = this.characters.filter(
      (battleChar) => {
        const hasActed = currentRoundEvents.some(
          (e) =>
            e.characterId === battleChar.characterId &&
            e.eventType === CampaignEventType.CharacterEndRound
        );

        return !hasActed;
      }
    );

    const sorted = charactersNotActedCurrentRound.sort(
      (a, b) => b.initiative - a.initiative
    );

    return sorted[0];
  }

  publishNewRoundEvent(nextRoundId: string) {
    return {
      id: generateId("event"),
      eventType: CampaignEventType.BattleNewRound,
      actionType: ActionType.None,
      characterId: "system",
      roundId: nextRoundId,
      battleId: this.id,
    };
  }
}
