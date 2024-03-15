import { Id } from "../../lib/generate-id";
import { CampaignEventWithRound } from "../campaign/campaign-events";
import { Interaction } from "../world/interaction/interaction";

export enum ActorType {
  Monster = "Monster",
  Character = "Character",
  World = "World",
}

/**
 * Interface for implementing an actor that can act in the world. Can be a character, monster, or other kind of world entity that are able to act.
 */
export interface Actor {
  id: Id;
  name: string;

  getType(): ActorType;
  getActions(): Interaction[];
  getAvailableActions(): Interaction[];
  performAction(targetIds: Actor["id"][], actionId: Interaction["id"]): CampaignEventWithRound[];
  rollInitiative(): number;
  getEligibleTargets(action: Interaction): Actor[];
  getAbilityModifier(): number;
}
