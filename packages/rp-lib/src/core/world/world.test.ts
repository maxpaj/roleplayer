import { generateId } from "../../lib/generate-id";
import { World, CampaignEventWithRound } from "./world";

describe("Campaign", () => {
  it("applies events", () => {
    const characterId = generateId();
    const events: CampaignEventWithRound[] = [
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

    const campaign = new World({ name: "Campaign", events });
    campaign.applyEvents();

    const characters = campaign.getCharacters();
    expect(characters.length).toBe(1);

    const character = characters[0];
    expect(character!.name).toBe("Some name");
    expect(character!.maximumHealth).toBe(10);
  });
});
