import { Interaction } from "./character/character";
import { Id } from "./id";

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
  itemSlot: ItemSlot;
  interactions: Interaction[];
};
