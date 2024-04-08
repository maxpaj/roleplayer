import type { Id } from "../../lib/generate-id";
import type { AugmentedRequired } from "../../types/with-required";
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
  actorTemplates: Actor[] = [];
  races: Race[] = [];
  actions: ActionDefinition[] = [];
  statuses: StatusDefinition[] = [];
  classes: Clazz[] = [];

  constructor(c: AugmentedRequired<Partial<CampaignState>, "id" | "roleplayer" | "ruleset">) {
    Object.assign(this, c);
    c.roleplayer.subscribe(this.applyEvent.bind(this));
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

  allCharactersHaveActed(events: RoleplayerEvent[]) {
    const round = this.rounds[this.rounds.length - 1];
    if (!round) {
      throw new Error("Could not get current round");
    }

    return this.characters.every((c) =>
      events.some((e) => e.type === "CharacterEndTurn" && e.characterId === c.id && e.roundId === round.id)
    );
  }

  applyEvent(event: RoleplayerEvent) {
    if (!("battleId" in event) || event.battleId !== this.id) return;
    switch (event.type) {
      case "BattleStarted": {
        if (!event.battleId) throw new Error("BattleStarted event missing battleId");
        this.battles.push(
          new Battle({
            id: event.battleId,
            name: "Battle",
            roleplayer: this.roleplayer,
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
