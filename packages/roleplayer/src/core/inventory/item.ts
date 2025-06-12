import { CharacterAttribute } from "../..";
import { Id } from "../../lib/generate-id";
import { ActionDefinition } from "../action/action";
import { Rarity } from "../world/rarity";

export enum ItemType {
  Equipment = "Equipment",
  Consumable = "Consumable",
}

export enum ItemEquipmentType {
  None = "None",
  Shield = "Shield",
  OneHandWeapon = "OneHandWeapon",
  TwoHandWeapon = "TwoHandWeapon",
  BodyArmor = "BodyArmor",
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

export type ItemDefinition = {
  id: Id;
  name: string;
  type: ItemType;
  rarity: Rarity;
  description: string;
  stats: CharacterAttribute[];
  equipmentType: ItemEquipmentType;
  weightUnits: number;

  /**
   * Actions available for the item.
   */
  actions: ActionDefinition[];

  /**
   * An item may occupy additional slots while equipped.
   */
  occupiesSlots: ItemSlot[];
};
