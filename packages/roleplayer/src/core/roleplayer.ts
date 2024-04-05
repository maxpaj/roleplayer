import { CampaignEvent, CampaignEventWithRound, CampaignState, Id, RoleplayerEvent, World } from "..";
import { Logger } from "../lib/logging/logger";

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
  events: CampaignEventWithRound[] = [];
  worlds: World[] = [];
  campaigns: CampaignState[] = [];
  logger?: Logger;

  constructor(r: Partial<Roleplayer> = {}) {
    Object.assign(this, r);
  }

  createWorld(...args: ConstructorParameters<typeof World>) {
    const world = new World(...args);
    this.worlds.push(world);
    return world;
  }

  createCampaign(...args: ConstructorParameters<typeof CampaignState>) {
    const campaign = new CampaignState(...args);
    this.campaigns.push(campaign);
    return campaign;
  }

  nextSerialNumber() {
    const sortedEvents = this.events.toSorted((a, b) => a.serialNumber - b.serialNumber);
    const lastSerialNumber = sortedEvents[sortedEvents.length - 1]?.serialNumber ?? 0;
    return lastSerialNumber + 1;
  }

  publishEvent(campaignId: CampaignState["id"], ...newEvents: CampaignEvent[]) {
    const campaign = this.campaigns.find((c) => c.id === campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    const currentBattle = campaign.getCurrentBattle();
    const currentRound = campaign.getCurrentRound();

    const eventsWithRoundAndBattle = newEvents.map((e, i) => {
      const eventSerialNumber = this.nextSerialNumber() + i;

      return {
        ...e,
        battleId: currentBattle?.id,
        roundId: currentRound.id,
        serialNumber: eventSerialNumber,
        campaignId: campaign.id,
      };
    });

    this.events.push(...eventsWithRoundAndBattle);
    return newEvents;
  }

  getCampaignFromEvents(campaignId: Id) {
    const campaign = this.campaigns.find((c) => c.id === campaignId);
    if (!campaign) {
      throw new Error("Campaign does not exist");
    }

    const campaignState = new CampaignState({ id: campaign.id, roleplayer, ruleset });
    const sorted = this.events.toSorted((a, b) => a.serialNumber - b.serialNumber);

    try {
      sorted.forEach((e) => {
        campaignState.applyEvent(e);
        this.logger?.debug({ event: e, campaignState: campaignState });
      });

      return campaignState;
    } catch (e) {
      this.debugEventProcessing(campaignState, sorted);
      throw e;
    }
  }

  debugEvent(event: RoleplayerEvent) {
    // this.logger.table(event);
  }

  debugEventProcessing(campaignState: CampaignState, events: CampaignEventWithRound[]) {
    // this.logger.log(campaignState.characters);
  }
}
