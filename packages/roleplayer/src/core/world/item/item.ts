import type { Id } from "../../../lib/generate-id";
import type { Character } from "../../actor/character";
import type { Interaction } from "../interaction/interaction";
import type { Rarity } from "../rarity";

export enum ItemType {
  Equipment = "Equipment",
  Consumable = "Consumable",
}

export enum ItemEquipmentType {
  Shield = "Shield",
  OneHandSword = "OneHandSword",
  TwoHandSword = "TwoHandSword",
  Dagger = "Dagger",
  OneHandMace = "OneHandMace",
  TwoHandMace = "TwoHandMace",
}

export enum ItemSlot {
  Inventory = "Inventory",
  MainHand = "MainHand",
  OffHand = "OffHand",
  Head = "Head",
  Feet = "Feet",
  Chest = "Chest",
}

export type EquipmentSlotDefinition = {
  id: Id;
  name: string;
  eligibleEquipmentTypes: ItemEquipmentType[];
};

export type Item = {
  id: Id;
  name: string;
  type: ItemType;
  rarity: Rarity;
  description?: string;
  canUse?: (item: Item, character: Character) => boolean;

  /**
   * Actions available for the item.
   */
  actions: Interaction[];

  /**
   * An item may occupy additional slots while equipped.
   */
  occupiesSlots: ItemSlot[];
};
