import { generateId, type Id } from "../../lib/generate-id";
import { RemoveFunctions } from "../../types/remove-functions";
import type { WithRequired } from "../../types/with-required";
import type { ActionDefinition } from "../action/action";
import type { StatusDefinition } from "../action/status";
import { isCharacterEvent, type Actor } from "../actor/character";
import { Battle } from "../battle/battle";
import type { RoleplayerEvent } from "../events/events";
import type { ItemDefinition } from "../inventory/item";
import type { Roleplayer } from "../roleplayer";
import type { CharacterResourceDefinition, Clazz, Race, Ruleset } from "../ruleset/ruleset";
import type { Round } from "./round";

/**
 * Represent a campaign current state, after applying all events related to the campaign
 */
export class CampaignState {
  id!: Id;
  ruleset!: Ruleset;
  roleplayer!: Roleplayer;

  battles: Battle[] = [];
  rounds: Round[] = [];
  characters: Actor[] = [];
  itemTemplates: ItemDefinition[] = [];
  actorTemplates: RemoveFunctions<Required<Omit<ConstructorParameters<typeof Actor>[0], "campaign">>>[] = [];
  races: Race[] = [];
  actions: ActionDefinition[] = [];
  statuses: StatusDefinition[] = [];
  classes: Clazz[] = [];

  constructor(c: WithRequired<Partial<CampaignState>, "id" | "roleplayer" | "ruleset">) {
    Object.assign(this, c);
    c.roleplayer.subscribe(this.reduce.bind(this));
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
    const round = this.rounds.toSorted((a, b) => a.roundNumber - b.roundNumber)[this.rounds.length - 1];
    if (!round) {
      const newRound = {
        id: generateId(),
        roundNumber: 0,
      };
      this.rounds.push(newRound);
      return newRound;
    }
    return round;
  }

  allCharactersHaveActed(events: RoleplayerEvent[]) {
    const round = this.rounds[this.rounds.length - 1];
    if (!round) {
      throw new Error("Could not get current round");
    }

    return this.characters.every((c) =>
      events.some((e) => e.type === "CharacterEndTurn" && e.characterId === c.id && e.roundId === round.id)
    );
  }

  reduce(event: RoleplayerEvent) {
    switch (event.type) {
      case "BattleStarted":
        this.battles.push(
          new Battle({
            id: event.battleId,
            name: "Battle",
            roleplayer: this.roleplayer,
          })
        );

        break;
    }
  }
}
