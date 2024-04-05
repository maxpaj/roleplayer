import { Roleplayer } from "./roleplayer";

describe("roleplayer", () => {
  it("should instantiate without errors", () => {
    new Roleplayer({ roll: () => 2 });
    expect(true).toBe(true);
  });
});
