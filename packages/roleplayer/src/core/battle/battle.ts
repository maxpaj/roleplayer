import { Id } from "../../lib/generate-id";
import { isCharacterEvent } from "../actor/character";
import { CampaignEvent } from "../campaign/campaign-events";
import { D20 } from "../dice/dice";
import { roll } from "../dice/dice";
import { AugmentedRequired } from "../../types/with-required";
import { Actor } from "../actor/actor";

export class BattleActor {
  initiative: number;
  actor: Actor;

  constructor(actor: Actor, initiative: number) {
    this.initiative = initiative;
    this.actor = actor;
  }
}

export function getActorInitiative(c: Actor) {
  return roll(D20) + c.getAbilityModifier();
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

  addActor(entity: Actor) {
    const added = new BattleActor(entity, entity.getInitiative());
    this.entities.push(added);
    return added;
  }

  currentActorTurn(events: CampaignEvent[]) {
    const charactersNotActedCurrentRound = this.entities.filter(
      (battleChar) => {
        const hasActed = events.some(
          (e) =>
            isCharacterEvent(e) &&
            e.id === battleChar.actor.id &&
            e.type === "CharacterEndRound"
        );

        return !hasActed;
      }
    );

    const sorted = charactersNotActedCurrentRound.sort(
      (a, b) => b.initiative - a.initiative
    );

    return sorted[0] as BattleActor;
  }
}
