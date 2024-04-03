import { Battle, Campaign, CampaignEventWithRound, Roll, Ruleset, World } from "..";
import { AugmentedRequired } from "../types/with-required";

type RoleplayerConfig = {
  roll: Roll;
  events?: CampaignEventWithRound[];
};

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

  constructor({ roll, ...rest }: AugmentedRequired<Partial<Roleplayer>, "roll">) {
    Object.assign(this, rest);
    this.roll = roll;
  }

  createWorld(name: string, world: Partial<World>, ruleset: Ruleset) {
    return new World(ruleset, name, world);
  }
  createCampaign(...args: ConstructorParameters<typeof Campaign>) {
    return new Campaign(...args);
  }

  createBattle(...args: ConstructorParameters<typeof Battle>) {
    return new Battle(...args);
  }
}
