import { Effect } from "./effects";
import { Id } from "./id";

export enum ItemType {
  Weapon = "Weapon",
  Potion = "Potion",
}

export abstract class Item {
  id!: Id;
  name!: string;
  type!: ItemType;

  abstract consume(): Effect[];
  abstract attack(): Effect[];
  abstract throw(): Effect[];
}
