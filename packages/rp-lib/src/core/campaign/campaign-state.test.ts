import { Campaign, CampaignEventWithRound, World, generateId } from "../..";

describe("Campaign state", () => {
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
        type: "CharacterNameSet",
        characterId,
        id: generateId(),
        name: "Some name",
        roundId: generateId(),
      },
      {
        type: "CharacterMaximumHealthSet",
        characterId,
        id: generateId(),
        roundId: generateId(),
        maximumHealth: 10,
      },
    ];

    const world = new World({ name: "World" });
    const campaign = new Campaign({ name: "Campaign", world, events });
    campaign.applyEvents();

    const characters = campaign.getCharacters();
    expect(characters.length).toBe(1);

    const character = characters[0];
    expect(character!.name).toBe("Some name");
    expect(character!.maximumHealth).toBe(10);
  });
});
