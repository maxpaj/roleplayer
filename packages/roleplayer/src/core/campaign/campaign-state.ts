import { generateId, type Id } from "../../lib/generate-id";
import type { WithRequired } from "../../types/with-required";
import type { ActionDefinition } from "../action/action";
import type { StatusDefinition } from "../action/status";
import { ActorTemplate, isCharacterEvent, type Actor } from "../actor/character";
import { Battle } from "../battle/battle";
import type { RoleplayerEvent } from "../events/events";
import type { ItemDefinition } from "../inventory/item";
import type { Roleplayer } from "../roleplayer";
import type { Clazz, Race, Ruleset } from "../ruleset/ruleset";
import { ResourceDefinition } from "../world/resource";
import type { Round } from "./round";

/**
 * Represent a campaign current state, after applying all events related to the campaign
 */
export class CampaignState {
  id!: Id;
  ruleset!: Ruleset;
  roleplayer!: Roleplayer;
  started: boolean = false;

  battles: Battle[] = [];
  rounds: Round[] = [];
  characters: Actor[] = [];
  itemTemplates: ItemDefinition[] = [];
  actorTemplates: ActorTemplate[] = [];
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

  getCharacterEligibleTargets(actor: Actor, action: ActionDefinition): Actor[] {
    // TODO: Make sure the target is eligible
    return this.characters;
  }

  getCurrentBattle(): Battle | undefined {
    return this.battles[this.battles.length - 1];
  }

  characterHasResource(actor: Actor, resourceType: ResourceDefinition["id"]) {
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
      case "BattleStarted": {
        this.battles.push(
          new Battle({
            id: event.battleId,
            name: "Battle",
            roleplayer: this.roleplayer,
          })
        );
        break;
      }
      case "BattleEnded": {
        const battleIndex = this.battles.findIndex((b) => b.id === event.battleId);
        if (battleIndex === -1) throw new Error(`Could not find battle with id: ${event.battleId}`);
        const [removedBattle] = this.battles.splice(battleIndex, 1);
        removedBattle?.dispose();
        break;
      }
    }
  }
}
