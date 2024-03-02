import { Clazz, Race } from "./character";
import { generateId, Id } from "../../lib/generate-id";
import { CampaignEvent } from "../world/world";

export function randomEnum<T extends object>(anEnum: T): T[keyof T] {
  const enumValues = Object.keys(anEnum) as T[keyof T][];
  const randomIndex = Math.floor((Math.random() * enumValues.length) / 2);
  const randomEnum = enumValues[randomIndex];
  if (!randomEnum) {
    throw new Error("Could not get random enum");
  }
  return randomEnum;
}

export function randomClass(): Clazz {
  return {
    id: generateId(),
    levelProgression: [],
    name: "Random class",
  };
}

export function randomRace(): Race {
  return { name: "Random race" };
}

export function randomDigit(min: number, max: number) {
  const variable = max - min;
  return min + Math.floor(Math.random() * variable);
}

export function randomCharacterEvents(id: Id): CampaignEvent[] {
  return [];
}
