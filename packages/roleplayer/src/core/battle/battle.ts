import { Id } from "../../lib/generate-id";
import { Actor, isCharacterEvent } from "../actor/character";
import { CampaignEvent } from "../campaign/campaign-events";
import { AugmentedRequired } from "../../types/with-required";

export type BattleActor = { actingOrder: number; actor: Actor };

export class Battle {
  id!: Id;
  name!: string;
  finished!: boolean;
  entities: BattleActor[] = [];

  constructor(b: AugmentedRequired<Partial<Battle>, "name">) {
    Object.assign(this, b);
    this.finished = this.finished || false;
  }

  hasActionOrder() {
    return this.entities.every((c) => c.actingOrder !== 0);
  }

  addBattleActor(actor: Actor) {
    const added = { actor, actingOrder: 0 };
    this.entities.push(added);
    return added;
  }

  currentActorTurn(events: CampaignEvent[]) {
    const charactersNotActedCurrentRound = this.entities.filter((battleChar) => {
      const hasActed = events.some(
        (e) => isCharacterEvent(e) && e.id === battleChar.actor.id && e.type === "CharacterEndRound"
      );

      return !hasActed;
    });

    const sorted = charactersNotActedCurrentRound.sort((a, b) => b.actingOrder - a.actingOrder);

    return sorted[0] as BattleActor;
  }
}
