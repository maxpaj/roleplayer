import { generateId } from "../../lib/generate-id";
import { World, WorldEventWithRound } from "./world";

describe("World", () => {
  it("applies events", () => {
    const characterId = generateId();
    const events: WorldEventWithRound[] = [
      {
        type: "CharacterSpawned",
        characterId,
        id: generateId(),
        roundId: generateId(),
      },
      {
        type: "CharacterNameChanged",
        characterId,
        id: generateId(),
        name: "Some name",
        roundId: generateId(),
      },
      {
        type: "CharacterMaximumHealthChange",
        characterId,
        id: generateId(),
        roundId: generateId(),
        maximumHealth: 10,
      },
    ];

    const world = new World({ name: "World", events });
    world.applyEvents();

    const characters = world.getCharacters();
    expect(characters.length).toBe(1);

    const character = characters[0];
    expect(character!.name).toBe("Some name");
    expect(character!.maximumHealth).toBe(10);
  });
});
