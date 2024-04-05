import { Id } from "../../lib/generate-id";
import { AugmentedRequired } from "../../types/with-required";
import { ActionDefinition } from "../action/action";
import { Actor, isCharacterEvent } from "../actor/character";
import { Battle } from "../battle/battle";
import { CampaignEventWithRound } from "../events/events";
import { Roleplayer } from "../roleplayer";
import { CharacterResourceDefinition, Ruleset } from "../ruleset/ruleset";
import { Round } from "./round";

/**
 * Represent a campaign current state, after applying all events related to the campaign
 */
export class CampaignState {
  id!: Id;
  battles!: Battle[];
  rounds!: Round[];
  characters!: Actor[];
  ruleset!: Ruleset;
  roleplayer!: Roleplayer;

  constructor(c: AugmentedRequired<Partial<CampaignState>, "id" | "roleplayer" | "ruleset">) {
    Object.assign(this, c);
  }

  getRoundEvents(round: Round) {
    return this.roleplayer.events.filter((e) => e.roundId === round.id);
  }

  getCharacterRoundEvents(round: Round, characterId: Actor["id"]) {
    const roundEvents = this.getRoundEvents(round);
    return roundEvents.filter((re) => isCharacterEvent(re) && re.characterId === characterId);
  }

  getCharacterEvents(characterId: Actor["id"]) {
    return this.roleplayer.events.filter((re) => isCharacterEvent(re) && re.characterId === characterId);
  }

  getCharacterEligibleTargets(campaignState: CampaignState, actor: Actor, action: ActionDefinition): Actor[] {
    // TODO: Make sure the target is eligible
    return campaignState.characters;
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
      events.some((e) => e.type === "CharacterEndTurn" && e.characterId === c.id && e.roundId === round.id)
    );
  }

  applyEvent(event: CampaignEventWithRound) {
    switch (event.type) {
      case "BattleStarted": {
        if (!event.battleId) throw new Error("BattleStarted event missing battleId");
        this.battles.push(
          new Battle(this.ruleset, {
            id: event.battleId,
            name: "Battle",
          })
        );

        break;
      }

      case "CharacterBattleEnter": {
        const battle = this.battles.find((b) => b.id === event.battleId);

        if (!battle) {
          throw new Error("Cannot find battle");
        }

        const character = this.characters.find((m) => m.id === event.characterId);

        if (!character) {
          throw new Error("Cannot find character");
        }

        battle.addBattleActor(character);

        break;
      }
    }
  }
}
