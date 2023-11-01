import { getAbilityModifier } from "./ability-modifier";

describe("ability-modifier", () => {
  test("it should return the score for the interval", () => {
    expect(getAbilityModifier(1)).toBe(-5);
  });
});
