import { Id } from "../../lib/generate-id";
import { Battle, Round } from "../battle/battle";
import { Character, isCharacterEvent } from "../character/character";
import { Campaign } from "./campaign";
import { CampaignEventType, CampaignEventWithRound } from "./campaign-events";

/**
 * Represent a campaign state, where all campaign events have been processed and applied to the campaign, characters, etc.
 */
export class CampaignState {
  battles: Battle[];
  rounds: Round[];
  characters: Character[];
  campaign: Campaign;

  constructor(
    campaign: Campaign,
    battles: Battle[] = [],
    rounds: Round[] = [],
    characters: Character[] = []
  ) {
    this.campaign = campaign;
    this.battles = battles;
    this.rounds = rounds;
    this.characters = characters;
  }

  characterHasRoundEvent(
    round: Round,
    characterId: Id,
    type: CampaignEventType["type"]
  ) {
    const roundCharacterEvents = this.campaign.getCharacterRoundEvents(
      round,
      characterId
    );

    return roundCharacterEvents.some(
      (event) =>
        isCharacterEvent(event) &&
        event.characterId === characterId &&
        event.type === type
    );
  }

  allCharactersHaveActed(events: CampaignEventWithRound[]) {
    const round = this.rounds[this.rounds.length - 1];
    if (!round) {
      throw new Error("Could not get current round");
    }

    return this.characters.every((c) =>
      events.some(
        (e) =>
          e.type === "CharacterEndRound" &&
          e.characterId === c.id &&
          e.roundId === round.id
      )
    );
  }
}
