import { Id } from "../../../lib/generate-id";
import { Action } from "../action/action";
import { Rarity } from "../rarity";

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

  /**
   * Actions available for the item.
   */
  actions: Action[];

  /**
   * An item may occupy additional slots while equipped.
   */
  occupiesSlots: ItemSlot[];
};
