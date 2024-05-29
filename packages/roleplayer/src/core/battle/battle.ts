import { mapEffect, type ActionDefinition, type CampaignEvent, type RoleplayerEvent, type Ruleset } from "../..";
import type { Id } from "../../lib/generate-id";
import type { WithRequired } from "../../types/with-required";
import type { Actor, Position } from "../actor/character";
import type { Roleplayer } from "../roleplayer";

export class Battle {
  id!: Id;
  name!: string;
  roleplayer!: Roleplayer;

  ruleset: Ruleset;
  actors: Actor[] = [];
  actorToAct: Actor | undefined;
  actorsThatHaveActed: Actor[] = [];

  unsubscribe: (() => void) | undefined;

  constructor(b: WithRequired<Partial<Omit<Battle, "ruleset">>, "name" | "id" | "roleplayer">) {
    Object.assign(this, b);
    this.ruleset = b.roleplayer.ruleset;
    this.unsubscribe = b.roleplayer.subscribe(this.reduce.bind(this));
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

  removeBattleActor(actor: Actor) {
    this.actors = this.actors.filter((a) => a.id !== actor.id);
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
    const events: Array<CampaignEvent> = [];
    for (const target of targets) {
      const didHit = this.ruleset.characterHit(actor, actionDef, target);
      if (!didHit) continue;
      for (const effect of actionDef.appliesEffects) {
        events.push(mapEffect(effect, actionDef, actor, target, this.ruleset));
      }
    }

    for (const requiredResource of actionDef.requiresResources) {
      const availableResource = actor.resources.find((r) => r.resourceTypeId === requiredResource.resourceTypeId);
      if (requiredResource.amount > availableResource!.amount) throw new Error("Not enough resources");
      events.push({
        type: "CharacterResourceLoss" as const,
        amount: requiredResource.amount,
        characterId: actor.id, // Target
        resourceTypeId: requiredResource.resourceTypeId,
        actionId: actionDef.id,
        sourceId: actor.id, // Actor
      });
    }

    this.roleplayer.dispatchEvents(...events);

    // 1. Check hit
    // 2. Apply effects -
    return true;
  }

  reduce(event: RoleplayerEvent) {
    if (!("battleId" in event) || event.battleId !== this.id) return;
    switch (event.type) {
      case "CharacterBattleEnter": {
        const character = this.roleplayer.campaign.characters.find((c) => c.id === event.characterId);
        if (!character) throw new Error(`Cannot find character with id: ${event.characterId}`);
        this.addBattleActor(character);
        break;
      }
      case "CharacterBattleLeave": {
        const character = this.roleplayer.campaign.characters.find((c) => c.id === event.characterId);
        if (!character) throw new Error(`Cannot find character with id: ${event.characterId}`);
        this.removeBattleActor(character);
        break;
      }
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

  dispose() {
    this.unsubscribe?.();
  }
}
