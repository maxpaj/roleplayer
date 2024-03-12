export { World } from "./core/world/world";
export type {
  CampaignEventType,
  CampaignEventWithRound,
  CampaignEvent,
} from "./core/campaign/campaign-events";
export { Campaign } from "./core/campaign/campaign";
export type { Round } from "./core/campaign/round";
export { CampaignState } from "./core/campaign/campaign-state";
export type {
  CharacterEquipmentSlot,
  CharacterStat,
  ClassLevelProgression,
  Clazz,
} from "./core/actor/character";
export { Character } from "./core/actor/character";
export type { Actor } from "./core/actor/actor";
export { ActorType } from "./core/actor/actor";
export { Battle, BattleActor as BattleEntity } from "./core/battle/battle";
export { Monster, MonsterInstance } from "./core/actor/monster";
export type { Interaction } from "./core/world/interaction/interaction";
export type { Item } from "./core/world/item/item";
export { ItemSlot, ItemType, Rarity } from "./core/world/item/item";
export type { Dice } from "./core/dice/dice";
export { D2, D4, D6, D8, D10, D20, roll } from "./core/dice/dice";
export { dangerousGenerateId } from "./lib/generate-id";
export type { Id } from "./lib/generate-id";

// TODO: Should be injected at build time
export const Version = "0.0.0";
