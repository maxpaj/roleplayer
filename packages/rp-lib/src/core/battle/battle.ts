import { Id } from "../../lib/generate-id";
import { Character, isCharacterEvent } from "../character/character";
import { CampaignEvent } from "../campaign/campaign-events";
import { D20 } from "../dice/dice";
import { roll } from "../dice/dice";
import { AugmentedRequired } from "../../types/with-required";
import { Monster } from "../character/monster";
import { Actor } from "../character/actor";

export type Round = {
  id: Id;
};

export class BattleEntity {
  initiative: number;
  actor: Actor;

  constructor(actor: Actor, initiative: number) {
    this.initiative = initiative;
    this.actor = actor;
  }
}

export function getCharacterInitiative(c: Character) {
  return roll(D20) + c.getAbilityModifier();
}

export function getMonsterInitiative(c: Monster) {
  return roll(D20);
}

export class Battle {
  id!: Id;
  name!: string;
  finished!: boolean;
  entities: BattleEntity[] = [];

  constructor(b: AugmentedRequired<Partial<Battle>, "name">) {
    Object.assign(this, b);
    this.finished = this.finished || false;
  }

  hasRolledForInitiative() {
    return this.entities.every((c) => c.initiative != 0);
  }

  addEntity(entity: Actor) {
    const added = new BattleEntity(entity, entity.getInitiative());
    this.entities.push(added);
    return added;
  }

  currentCharacterTurn(events: CampaignEvent[]) {
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

    return sorted[0];
  }
}
