import { Id, generateId } from "../id";
import {
  Campaign,
  CampaignEvent,
  CampaignEventType,
} from "../campaign/campaign";
import { ActionType, Character } from "../character/character";
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

  applyEvent(event: CampaignEvent, campaign: Campaign) {}
}

export class Battle {
  public id: Id;
  public characters: BattleCharacter[];
  public rounds: Round[];

  public constructor(characters: BattleCharacter[] = [], rounds: Round[] = []) {
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

  addCharacterToCurrentBattle(character: Character) {
    const added = new BattleCharacter({
      characterId: character.id,
      initiative: getCharacterInitiative(character),
    });
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
      eventType: CampaignEventType.NewRound,
      actionType: ActionType.None,
      characterId: "system",
      roundId: nextRoundId,
      battleId: this.id,
    };
  }
}
