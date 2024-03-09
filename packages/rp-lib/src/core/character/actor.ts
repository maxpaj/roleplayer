import { Id } from "../../lib/generate-id";
import { CampaignEventWithRound } from "../campaign/campaign-events";
import { Interaction } from "../interaction/interaction";

export interface Actor {
  id: Id;
  getActions(): Interaction[];
  getAvailableActions(): Interaction[];
  performAction(
    targets: Actor["id"][],
    actionId: Interaction
  ): CampaignEventWithRound[];
  getInitiative(): number;
}
