import { Id } from "../../lib/generate-id";
import { isCharacterEvent } from "../actor/character";
import { CampaignEvent } from "../campaign/campaign-events";
import { AugmentedRequired } from "../../types/with-required";
import { Actor } from "../actor/actor";

export class BattleActor {
  initiative: number;
  actor: Actor;

  constructor(actor: Actor) {
    this.initiative = 0;
    this.actor = actor;
  }
}
export class Battle {
  id!: Id;
  name!: string;
  finished!: boolean;
  entities: BattleActor[] = [];

  constructor(b: AugmentedRequired<Partial<Battle>, "name">) {
    Object.assign(this, b);
    this.finished = this.finished || false;
  }

  hasRolledForInitiative() {
    return this.entities.every((c) => c.initiative != 0);
  }

  addBattleActor(entity: Actor) {
    const added = new BattleActor(entity);
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

    const sorted = charactersNotActedCurrentRound.sort((a, b) => b.initiative - a.initiative);

    return sorted[0] as BattleActor;
  }
}
