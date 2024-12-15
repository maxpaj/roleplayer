import type {
  ActionDefinition,
  CampaignEvent,
  DiceRoll,
  ElementDefinition,
  ResourceDefinition,
  Ruleset,
} from "../..";
import type { Actor } from "../actor/character";
import type { StatusDefinition } from "./status";

type EffectParameters = unknown;

export type CharacterResourceLossEffect = {
  eventType: "CharacterResourceLoss";
  roll: DiceRoll;
  resourceTypeId: ResourceDefinition["id"];
  elementTypeId: ElementDefinition["id"];
};

export type CharacterStatusGainEffect = {
  eventType: "CharacterStatusGain";
  statusId: StatusDefinition["id"];
};

export type UnkownEffect = {
  eventType: string;
  parameters: EffectParameters;
};

export type EffectEventDefinition = CharacterResourceLossEffect | CharacterStatusGainEffect | UnkownEffect;

export function mapEffect(
  effect: EffectEventDefinition,
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

    default:
      throw new Error("Could not map effect event type");
  }
}

function isCharacterResourceLossEffect(effect: EffectEventDefinition): effect is CharacterResourceLossEffect {
  return effect.eventType === "CharacterResourceLoss";
}

function instantiateResourceLossEffect(
  action: ActionDefinition,
  effect: EffectEventDefinition,
  source: Actor,
  target: Actor,
  ruleset: Ruleset
): CampaignEvent {
  if (!isCharacterResourceLossEffect(effect)) {
    throw new Error("Not CharacterResourceLoss effect type");
  }

  return {
    type: "CharacterResourceLoss" as const,
    amount: ruleset.characterHitDamage(source, action, target, effect),
    characterId: target.id,
    resourceTypeId: effect.resourceTypeId,
    actionId: action.id,
    sourceId: source.id,
  };
}

function isCharacterStatusGain(effect: EffectEventDefinition): effect is CharacterStatusGainEffect {
  return effect.eventType === "CharacterStatusGain";
}

function instantiateStatusGainEffect(
  action: ActionDefinition,
  effect: EffectEventDefinition,
  source: Actor,
  target: Actor,
  ruleset: Ruleset
) {
  if (!isCharacterStatusGain(effect)) {
    throw new Error("Not CharacterStatusGain effect type");
  }

  return {
    type: "CharacterStatusGain" as const,
    characterId: target.id,
    actionId: action.id,
    sourceId: source.id,
    statusId: effect.statusId,
  };
}
