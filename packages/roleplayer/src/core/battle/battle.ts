import { Id } from "../../lib/generate-id";
import { Actor, isCharacterEvent } from "../actor/character";
import { CampaignEvent } from "../campaign/campaign-events";
import { AugmentedRequired } from "../../types/with-required";

type BattleActor = { initiative: number; actor: Actor };

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

  addBattleActor(actor: Actor) {
    const added = { actor, initiative: 0 };
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
