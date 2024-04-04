import { Battle, Campaign, CampaignEvent, CampaignEventWithRound, Roll, World } from "..";
import { AugmentedRequired } from "../types/with-required";

/**
 * The core of this library contains a few systems that are common for most or all roleplaying games.
 * It is designed to be extended and customized to fit the needs of a roleplaying game.
 *
 * - event system
 *   - on level up
 *   - on action
 *   - on new round
 *   - on long rest
 * - action and effects system
 * - level progression system
 * - stats system
 * - inventory system
 * - character system
 * - world building system
 * - resource system
 * - npc system
 *    - action system
 *    - relationship system
 * - dice system
 * - campaign system
 */
export class Roleplayer {
  roll: Roll;
  events: CampaignEventWithRound[] = [];
  worlds: World[] = [];
  campaigns: Campaign[] = [];
  battles: Battle[] = [];

  constructor({ roll, ...rest }: AugmentedRequired<Partial<Roleplayer>, "roll">) {
    Object.assign(this, rest);
    this.roll = roll;
  }

  createWorld(...args: ConstructorParameters<typeof World>) {
    const world = new World(...args);
    this.worlds.push(world);
    return world;
  }

  createCampaign(...args: ConstructorParameters<typeof Campaign>) {
    const campaign = new Campaign(...args);
    this.campaigns.push(campaign);
    return new Campaign(...args);
  }

  createBattle(...args: ConstructorParameters<typeof Battle>) {
    const battle = new Battle(...args);
    this.battles.push(battle);
    return battle;
  }

  nextSerialNumber() {
    const sortedEvents = this.events.toSorted((a, b) => a.serialNumber - b.serialNumber);
    const lastSerialNumber = sortedEvents[sortedEvents.length - 1]?.serialNumber ?? 0;
    return lastSerialNumber + 1;
  }

  publishCampaignEvent(campaign: Campaign, ...newEvents: CampaignEvent[]) {
    const currentCampaignState = campaign.getCampaignStateFromEvents();
    const currentBattle = currentCampaignState.getCurrentBattle();
    const currentRound = currentCampaignState.getCurrentRound();

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
}
