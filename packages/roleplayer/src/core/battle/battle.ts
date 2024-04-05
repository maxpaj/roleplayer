import type { ActionDefinition, CampaignEvent, Ruleset } from "../..";
import type { Id } from "../../lib/generate-id";
import type { AugmentedRequired } from "../../types/with-required";
import type { Actor, Position } from "../actor/character";

export class Battle {
  id!: Id;
  name!: string;
  finished!: boolean;
  ruleset: Ruleset;

  actors: Actor[] = [];
  actorToAct: Actor | undefined;
  actorsThatHaveActed: Actor[] = [];

  constructor(ruleset: Ruleset, b: AugmentedRequired<Partial<Battle>, "name" | "id">) {
    Object.assign(this, b);
    this.finished = this.finished || false;
    this.ruleset = ruleset;
  }

  isBattleOver() {
    const aliveCharacters = this.actors.filter((actor) => this.ruleset.characterIsDead(actor));
    const oneCharacterRemaining = aliveCharacters.length === 1;
    if (oneCharacterRemaining) {
      return true;
    }

    if (aliveCharacters.length === 0) {
      return false;
    }

    const party = aliveCharacters[0]!.party;
    const alliedPartiesRemaining = aliveCharacters.every((actor) => actor.party === party && party !== undefined);
    return alliedPartiesRemaining;
  }

  addBattleActor(actor: Actor) {
    this.actors.push(actor);
  }

  calculateTargetsCone(position: Position, range: number, radius: number, angle: number) {
    return [] as Actor[];
  }

  calculateTargetsLine(position: Position, range: number, radius: number, angle: number) {
    return [] as Actor[];
  }

  calculateTargetsCircle(position: Position, range: number, radius: number, angle: number) {
    return [] as Actor[];
  }

  performAction(actor: Actor, actionDef: ActionDefinition, targets: Actor[]) {
    for (const target of targets) {
      const didHit = this.ruleset.characterHit(actor, actionDef, target);
      if (!didHit) continue;
      actionDef.appliesEffects;
      //
    }
    // 1. Check hit
    // 2. Apply effects -
    return true;
  }

  applyEvent(event: CampaignEvent) {
    switch (event.type) {
      case "CharacterEndTurn": {
        const characterBattle = this.actors.find((actor) => actor.id === event.characterId);
        if (!characterBattle) {
          throw new Error("Cannot find battle character");
        }

        this.actorsThatHaveActed.push(characterBattle);
        this.actorToAct = this.ruleset.getCurrentActorTurn(this);
        break;
      }
    }
  }
}
