import {
  CampaignState,
  dangerousGenerateId,
  type CharacterEvent,
  type Id,
  type RoleplayerEvent,
  type Ruleset,
  type SystemEvent,
} from "..";
import type { Logger } from "../lib/logging/logger";
import type { AugmentedRequired } from "../types/with-required";

/**
 * The core of this library contains a few systems that are common for most or all roleplaying games.
 * It is designed to be extended and customized to fit the needs of a roleplaying game.
 *
 * - Action and effects system
 * - Battle system
 *    - NPC actions
 *    - Resource generation system
 *    - Round action tracking
 * - Character system
 *    - Resource system
 *    - Inventory system
 *    - Stats system
 *    - Level progression system
 * - World building system
 * - NPC system
 *    - Relationship system
 * - Dice rolling system
 * - Campaign system
 *    - Factions/relationships system
 *    - Quest system
 *    - Exploration system
 *
 * It is all backed up by a rich event system where subsystems can subscribe and publish events.
 *
 */

export class Roleplayer {
  ruleset!: Ruleset;
  events: RoleplayerEvent[] = [];
  campaign: CampaignState;
  logger?: Logger;

  constructor(
    r: AugmentedRequired<Partial<Roleplayer>, "ruleset">,
    c: Omit<ConstructorParameters<typeof CampaignState>[0], "roleplayer" | "ruleset">
  ) {
    Object.assign(this, r);
    this.campaign = new CampaignState({ ...c, roleplayer: this, ruleset: r.ruleset });
  }

  nextSerialNumber() {
    const sortedEvents = this.events.toSorted((a, b) => a.serialNumber - b.serialNumber);
    const lastSerialNumber = sortedEvents[sortedEvents.length - 1]?.serialNumber ?? 0;
    return lastSerialNumber + 1;
  }

  publishEvent(...newEvents: (SystemEvent | CharacterEvent)[]) {
    const currentBattle = this.campaign.getCurrentBattle();
    const currentRound = this.campaign.getCurrentRound();

    const eventsWithRoundAndBattle = newEvents.map((e, i) => {
      const eventSerialNumber = this.nextSerialNumber() + i;

      return {
        ...e,
        id: dangerousGenerateId(),
        battleId: currentBattle?.id,
        roundId: currentRound.id,
        serialNumber: eventSerialNumber,
      };
    });

    this.events.push(...eventsWithRoundAndBattle);
    return newEvents;
  }

  getCampaignFromEvents(campaignId: Id) {
    return this.campaign;
  }

  debugEvent(event: RoleplayerEvent) {
    // this.logger.table(event);
  }

  debugEventProcessing(campaignState: CampaignState, events: RoleplayerEvent[]) {
    // this.logger.log(campaignState.characters);
  }
}
