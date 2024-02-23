import { generateId } from "../../lib/generate-id";
import { Campaign, CampaignEventWithRound } from "./campaign";

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
        type: "CharacterChangedName",
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

    const campaign = new Campaign({ name: "Campaign", events });
    campaign.applyEvents();
    console.log(campaign);

    const characters = campaign.getCharacters();
    expect(characters.length).toBe(1);

    const character = characters[0];
    expect(character!.name).toBe("Some name");
    expect(character!.maximumHealth).toBe(10);
  });
});
