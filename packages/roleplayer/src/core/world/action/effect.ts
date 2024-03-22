import { ActionDefinition, CharacterResourceDefinition, Dice, ElementDefinition, dangerousGenerateId } from "../../..";
import { Actor } from "../../actor/character";
import { CampaignEvent, CampaignEventType } from "../../campaign/campaign-events";
import { World } from "../world";
import { StatusDefinition } from "./status";

export interface EventGenerator {
  eventType: CampaignEventType["type"];
  instantiate(action: ActionDefinition, source: Actor, target: Actor, world: World): CampaignEvent;
}

export class CharacterResourceLossEffect implements EventGenerator {
  element: ElementDefinition;
  eventType: "CharacterResourceLoss";
  resourceTypeId: CharacterResourceDefinition["id"];
  variableValue: Dice;
  staticValue: number;

  constructor(
    element: ElementDefinition,
    variableValue: Dice,
    staticValue: number,
    resourceTypeId: CharacterResourceDefinition["id"]
  ) {
    this.element = element;
    this.eventType = "CharacterResourceLoss";
    this.resourceTypeId = resourceTypeId;
    this.variableValue = variableValue;
    this.staticValue = staticValue;
  }

  instantiate(action: ActionDefinition, source: Actor, target: Actor, world: World): CampaignEvent {
    return {
      type: this.eventType,
      amount: world.ruleset.characterHitDamage(
        source,
        action,
        target,
        this.element,
        this.variableValue,
        this.staticValue
      ),
      characterId: target.id,
      id: dangerousGenerateId(),
      resourceTypeId: this.resourceTypeId,
      actionId: action.id,
    };
  }
}

export class CharacterStatusGainEffect implements EventGenerator {
  status: StatusDefinition;
  eventType: "CharacterStatusGain";

  constructor(status: StatusDefinition) {
    this.eventType = "CharacterStatusGain";
    this.status = status;
  }

  instantiate(action: ActionDefinition, source: Actor, target: Actor, world: World): CampaignEvent {
    return {
      type: this.eventType,
      characterId: target.id,
      id: dangerousGenerateId(),
      actionId: action.id,
      statusId: this.status.id,
    };
  }
}
