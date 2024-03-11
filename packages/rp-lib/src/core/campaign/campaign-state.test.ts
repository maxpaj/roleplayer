import { dangerousGenerateId } from "../../lib/generate-id";
import { World } from "../world/world";
import { Campaign } from "./campaign";
import { CampaignEventWithRound } from "./campaign-events";

describe("Campaign state", () => {
  it("applies events", () => {
    const characterId = dangerousGenerateId();
    const events: CampaignEventWithRound[] = [
      {
        type: "CharacterSpawned",
        characterId,
        id: dangerousGenerateId(),
        roundId: dangerousGenerateId(),
      },
      {
        type: "CharacterNameSet",
        characterId,
        id: dangerousGenerateId(),
        name: "Some name",
        roundId: dangerousGenerateId(),
      },
      {
        type: "CharacterMaximumHealthSet",
        characterId,
        id: dangerousGenerateId(),
        roundId: dangerousGenerateId(),
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
