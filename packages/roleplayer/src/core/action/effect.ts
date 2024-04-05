import { ActionDefinition, CharacterResourceDefinition, Dice, ElementDefinition, dangerousGenerateId } from "../..";
import { Actor } from "../actor/character";
import { CampaignEvent } from "../events/events";
import { World } from "../world/world";
import { StatusDefinition } from "./status";

export type CharacterResourceLossEffect = {
  eventType: "CharacterResourceLoss";
  variableValue: Dice;
  staticValue: number;
  resourceTypeId: CharacterResourceDefinition["id"];
  elementTypeId: ElementDefinition["id"];
};

export type CharacterStatusGainEffect = {
  eventType: "CharacterStatusGain";
  statusId: StatusDefinition["id"];
};

export type EffectEventDefinition = CharacterResourceLossEffect | CharacterStatusGainEffect;

// TODO: Can this be typed better?
export type EffectEvent = {
  eventType: EffectEventDefinition["eventType"];
  parameters: Omit<EffectEventDefinition, "eventType">;
};

export function mapEffect(
  effect: EffectEvent,
  actionDef: ActionDefinition,
  attacker: Actor,
  target: Actor,
  world: World
) {
  switch (effect.eventType) {
    case "CharacterResourceLoss": {
      return instantiateResourceLossEffect(actionDef, effect, attacker, target, world);
    }

    case "CharacterStatusGain": {
      return instantiateStatusGainEffect(actionDef, effect, attacker, target, world);
    }
    default:
      throw new Error("Cannot map applied effect");
  }
}

function instantiateResourceLossEffect(
  action: ActionDefinition,
  effect: EffectEvent,
  source: Actor,
  target: Actor,
  world: World
): CampaignEvent {
  if (effect.eventType !== "CharacterResourceLoss") {
    throw new Error("Not CharacterResourceLoss effect type");
  }

  return {
    type: "CharacterResourceLoss",
    amount: world.ruleset.characterHitDamage(source, action, target, effect),
    characterId: target.id,
    id: dangerousGenerateId(),
    resourceTypeId: effect.parameters.resourceTypeId as CharacterResourceDefinition["id"],
    actionId: action.id,
    sourceId: source.id,
  };
}

function instantiateStatusGainEffect(
  action: ActionDefinition,
  effect: EffectEvent,
  source: Actor,
  target: Actor,
  world: World
): CampaignEvent {
  if (effect.eventType !== "CharacterStatusGain") {
    throw new Error("Not CharacterStatusGain effect type");
  }

  return {
    type: "CharacterStatusGain",
    characterId: target.id,
    id: dangerousGenerateId(),
    actionId: action.id,
    sourceId: source.id,
    statusId: effect.parameters.statusId as StatusDefinition["id"],
  };
}
