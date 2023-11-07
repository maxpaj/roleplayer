import { Id } from "../id";
import { Interaction } from "../interaction/interaction";

export enum ItemType {
  Equipment = "Equipment",
  Potion = "Potion",
}

export enum ItemSlot {
  MainHand = "MainHand",
  OffHand = "OffHand",
  Head = "Head",
  Feet = "Feet",
  Chest = "Chest",
}

export type Item = {
  id: Id;
  name: string;
  type: ItemType;
  slot: ItemSlot;
  interactions: Interaction[];
};
