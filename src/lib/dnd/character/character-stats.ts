import { DICE_TWENTY } from "../dice";
import { getAbilityModifier } from "./ability-modifier/ability-modifier";
import { Character } from "./character";

export function getCharacterInitiative(c: Character) {
  return (
    Math.ceil(Math.random() * DICE_TWENTY) + getAbilityModifier(c.baseDexterity)
  );
}
