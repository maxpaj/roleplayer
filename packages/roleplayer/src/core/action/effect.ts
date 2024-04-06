import type { ActionDefinition, CharacterResourceDefinition, Dice, ElementDefinition, Ruleset } from "../..";
import type { Actor } from "../actor/character";
import type { StatusDefinition } from "./status";

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
export type EffectEvent =
  | {
      eventType: CharacterResourceLossEffect["eventType"];
      parameters: Omit<CharacterResourceLossEffect, "eventType">;
    }
  | {
      eventType: CharacterStatusGainEffect["eventType"];
      parameters: Omit<CharacterStatusGainEffect, "eventType">;
    };

export function mapEffect(
  effect: EffectEvent,
  actionDef: ActionDefinition,
  attacker: Actor,
  target: Actor,
  ruleset: Ruleset
): CampaignEvent {
  switch (effect.eventType) {
    case "CharacterResourceLoss": {
      return instantiateResourceLossEffect(actionDef, effect, attacker, target, ruleset);
    }

    case "CharacterStatusGain": {
      return instantiateStatusGainEffect(actionDef, effect, attacker, target, ruleset);
    }
  }
}

function instantiateResourceLossEffect(
  action: ActionDefinition,
  effect: EffectEvent,
  source: Actor,
  target: Actor,
  ruleset: Ruleset
): CampaignEvent {
  if (effect.eventType !== "CharacterResourceLoss") {
    throw new Error("Not CharacterResourceLoss effect type");
  }

  return {
    type: "CharacterResourceLoss" as const,
    amount: ruleset.characterHitDamage(source, action, target, effect),
    characterId: target.id,
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
  ruleset: Ruleset
) {
  if (effect.eventType !== "CharacterStatusGain") {
    throw new Error("Not CharacterStatusGain effect type");
  }

  return {
    type: "CharacterStatusGain" as const,
    characterId: target.id,
    actionId: action.id,
    sourceId: source.id,
    statusId: effect.parameters.statusId as StatusDefinition["id"],
  };
}
