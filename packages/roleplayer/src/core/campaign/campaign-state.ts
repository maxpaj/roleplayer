import { Battle } from "../battle/battle";
import { Round } from "./round";
import { Actor } from "../actor/character";
import { CampaignEventWithRound } from "../events/events";
import { CharacterResourceDefinition } from "../ruleset/ruleset";

/**
 * Represent a campaign current state, after applying all events related to the campaign
 */
export class CampaignState {
  battles: Battle[];
  rounds: Round[];
  characters: Actor[];

  constructor(battles: Battle[] = [], rounds: Round[] = [], characters: Actor[] = []) {
    this.battles = battles;
    this.rounds = rounds;
    this.characters = characters;
  }

  getCharacter(characterId: Actor["id"]) {
    const character = this.characters.find((c) => c.id === characterId);
    if (!character) {
      throw new Error(`Could not find character with id ${characterId}`);
    }

    return character;
  }

  getCurrentBattle(): Battle | undefined {
    return this.battles[this.battles.length - 1];
  }

  characterHasResource(actor: Actor, resourceType: CharacterResourceDefinition["id"]) {
    return actor.resources.some((r) => r.resourceTypeId === resourceType && r.amount > 0);
  }

  getCurrentRound(): Round {
    const round = this.rounds.toSorted((a, b) => a.serialNumber - b.serialNumber)[this.rounds.length - 1];
    if (!round) {
      throw new Error("No current round");
    }

    return round;
  }

  allCharactersHaveActed(events: CampaignEventWithRound[]) {
    const round = this.rounds[this.rounds.length - 1];
    if (!round) {
      throw new Error("Could not get current round");
    }

    return this.characters.every((c) =>
      events.some((e) => e.type === "CharacterEndRound" && e.characterId === c.id && e.roundId === round.id)
    );
  }
}
