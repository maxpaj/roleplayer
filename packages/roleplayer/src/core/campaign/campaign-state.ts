import { Id } from "../../lib/generate-id";
import { Battle } from "../battle/battle";
import { Round } from "./round";
import { Actor } from "../actor/actor";
import { Character, isCharacterEvent } from "../actor/character";
import { MonsterInstance } from "../actor/monster";
import { Campaign } from "./campaign";
import { CampaignEventType, CampaignEventWithRound } from "./campaign-events";

/**
 * Represent a campaign current state, after applying all events related to the campaign
 */
export class CampaignState {
  battles: Battle[];
  rounds: Round[];
  characters: Character[];
  campaign: Campaign;
  monsters: MonsterInstance[];

  constructor(campaign: Campaign, battles: Battle[] = [], rounds: Round[] = [], characters: Character[] = [], monsters: MonsterInstance[] = []) {
    this.campaign = campaign;
    this.battles = battles;
    this.rounds = rounds;
    this.characters = characters;
    this.monsters = monsters;
  }

  getCharacter(characterId: Character["id"]) {
    const character = this.characters.find((c) => c.id === characterId);
    if (!character) {
      throw new Error(`Could not find character with id ${characterId}`);
    }

    return character;
  }

  getCurrentBattle(): Battle | undefined {
    return this.battles[this.battles.length - 1];
  }

  getCurrentRound(): Round {
    const round = this.rounds[this.rounds.length - 1];
    if (!round) {
      throw new Error("No current round");
    }

    return round;
  }

  getActors(): Actor[] {
    return [...this.monsters, ...this.characters];
  }

  characterHasRoundEvent(round: Round, characterId: Id, type: CampaignEventType["type"]) {
    const roundCharacterEvents = this.campaign.getCharacterRoundEvents(round, characterId);

    return roundCharacterEvents.some((event) => isCharacterEvent(event) && event.characterId === characterId && event.type === type);
  }

  allCharactersHaveActed(events: CampaignEventWithRound[]) {
    const round = this.rounds[this.rounds.length - 1];
    if (!round) {
      throw new Error("Could not get current round");
    }

    return this.characters.every((c) => events.some((e) => e.type === "CharacterEndRound" && e.characterId === c.id && e.roundId === round.id));
  }
}
