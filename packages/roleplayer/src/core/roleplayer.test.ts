import { DefaultRuleSet } from "../data/defaults";
import { Roleplayer } from "./roleplayer";

describe("roleplayer", () => {
  it("should instantiate without errors", () => {
    const roleplayer = new Roleplayer({ roll: () => 2 });
    const world = roleplayer.createWorld("My world", {}, new DefaultRuleSet());
    const character = world.addCharacter("character-1", "My character");

    expect(true).toBe(true);
  });
});
