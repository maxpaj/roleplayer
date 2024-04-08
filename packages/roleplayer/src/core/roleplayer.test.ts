import { DnDRuleset, generateId } from "..";
import { Roleplayer } from "./roleplayer";

const ruleset = new DnDRuleset((str) => {
  const [, staticValue = "0"] = str.split("+");
  return 2 + +staticValue;
});

describe("roleplayer", () => {
  it("should instantiate without errors", () => {
    new Roleplayer({ ruleset }, { id: generateId() });
    expect(true).toBe(true);
  });
});
