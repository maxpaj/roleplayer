import { Id } from "../../lib/generate-id";
import { Battle, Round } from "../battle/battle";
import { Character, isCharacterEvent } from "../character/character";
import { World } from "./world";
import { WorldEventType, WorldEventWithRound } from "./world-events";

/**
 * Represent a world state, where all world events have been processed and applied to the world, characters, etc.
 */
export class WorldState {
  battles: Battle[];
  rounds: Round[];
  characters: Character[];
  world: World;

  constructor(
    world: World,
    battles: Battle[] = [],
    rounds: Round[] = [],
    characters: Character[] = []
  ) {
    this.world = world;
    this.battles = battles;
    this.rounds = rounds;
    this.characters = characters;
  }

  characterHasRoundEvent(
    round: Round,
    characterId: Id,
    type: WorldEventType["type"]
  ) {
    const roundCharacterEvents = this.world.getCharacterRoundEvents(
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

  allCharactersHaveActed(events: WorldEventWithRound[]) {
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
