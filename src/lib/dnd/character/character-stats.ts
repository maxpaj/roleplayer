import { D20, roll } from "../dice";
import { getAbilityModifier } from "./ability-modifier/ability-modifier";
import { Character } from "./character";

export function getCharacterInitiative(c: Character) {
  return roll(D20) + getAbilityModifier(c.baseDexterity);
}
