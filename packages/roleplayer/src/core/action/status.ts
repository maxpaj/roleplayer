import { CampaignEvent } from "../..";
import { Id } from "../../lib/generate-id";
import { EffectEventGenerator } from "./effect";

/**
 * @module core/actions
 */
export type StatusDefinition = {
  id: Id;
  name: string;
  type: StatusType;
  appliesEffects: {
    effect: EffectEventGenerator;
    appliesAt: CampaignEvent["type"];
  }[];
  durationType: StatusDurationType;
  duration?: number;
};

/**
 * @module core/actions
 */
export enum StatusType {
  Curse = "Curse",
  Poison = "Poison",
  Magic = "Magic",
  Physical = "Physical",
}

/**
 * @module core/actions
 */
export enum StatusDurationType {
  Forever = "Forever",
  UntilLongRest = "UntilLongRest",
  UntilShortRest = "UntilShortRest",
  NumberOfRounds = "NumberOfRounds",
}
