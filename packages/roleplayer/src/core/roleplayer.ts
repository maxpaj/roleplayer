import { Roll, Ruleset, World } from "..";

type RoleplayerConfig = {
  roll: Roll;
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
 * - npc action system
 * - dice system
 * - campaign system
 */
export class Roleplayer {
  roll: Roll;

  constructor(config: RoleplayerConfig) {
    this.roll = config.roll;
  }

  createWorld(name: string, world: Partial<World>, ruleset: Ruleset) {
    return new World(ruleset, name, world);
  }
}
