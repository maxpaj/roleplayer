import { Id } from "../../lib/generate-id";
import { Actor, isCharacterEvent } from "../actor/character";
import { CampaignEvent } from "../events/events";
import { AugmentedRequired } from "../../types/with-required";
import { Campaign } from "../..";

export type BattleActor = { actingOrder: number; actor: Actor };

export class Battle {
  id!: Id;
  name!: string;
  finished!: boolean;

  campaign: Campaign;
  actors: BattleActor[] = [];

  constructor(campaign: Campaign, b: AugmentedRequired<Partial<Battle>, "name">) {
    Object.assign(this, b);
    this.finished = this.finished || false;
    this.campaign = campaign;
  }

  isBattleOver() {
    const aliveCharacters = this.actors.filter((a) => this.campaign.characterIsDead(a.actor));
    const oneCharacterRemaining = aliveCharacters.length === 1;
    if (oneCharacterRemaining) {
      return true;
    }

    if (aliveCharacters.length === 0) {
      return false;
    }

    const party = aliveCharacters[0]!.actor.party;
    const alliedPartiesRemaining = aliveCharacters.every((a) => a.actor.party === party && party !== undefined);
    return alliedPartiesRemaining;
  }

  hasActionOrder() {
    return this.actors.every((c) => c.actingOrder !== 0);
  }

  addBattleActor(actor: Actor) {
    const added = { actor, actingOrder: 0 };
    this.actors.push(added);
    return added;
  }

  currentActorTurn(events: CampaignEvent[]) {
    const charactersNotActedCurrentRound = this.actors.filter((battleChar) => {
      const hasEndedTurn = events.some(
        (e) => isCharacterEvent(e) && e.characterId === battleChar.actor.id && e.type === "CharacterEndRound"
      );

      const isDead = this.campaign.world.ruleset.characterIsDead(battleChar.actor);

      return !hasEndedTurn && !isDead;
    });

    const sorted = charactersNotActedCurrentRound.toSorted((a, b) => b.actingOrder - a.actingOrder);
    return sorted[0] as BattleActor;
  }
}
