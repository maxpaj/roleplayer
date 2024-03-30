import { Id } from "../../lib/generate-id";
import { Actor, isCharacterEvent } from "../actor/character";
import { CampaignEvent } from "../events/events";
import { AugmentedRequired } from "../../types/with-required";

export type BattleActor = { actingOrder: number; actor: Actor };

export class Battle {
  id!: Id;
  name!: string;
  finished!: boolean;

  actors: BattleActor[] = [];

  constructor(b: AugmentedRequired<Partial<Battle>, "name">) {
    Object.assign(this, b);
    this.finished = this.finished || false;
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
      const hasActed = events.some(
        (e) => isCharacterEvent(e) && e.characterId === battleChar.actor.id && e.type === "CharacterEndRound"
      );

      return !hasActed;
    });

    const sorted = charactersNotActedCurrentRound.toSorted((a, b) => b.actingOrder - a.actingOrder);
    return sorted[0] as BattleActor;
  }
}
