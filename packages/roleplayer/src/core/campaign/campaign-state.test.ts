import { DefaultRuleSet } from "../../data/data";
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

    const world = new World({ name: "World", ruleset: DefaultRuleSet });
    const campaign = new Campaign({ id: '0000000-0000-0000-0000-000000000000' as const, name: "Campaign", world, events });
    campaign.applyEvents();

    const characters = campaign.getWorldCharacters();
    expect(characters.length).toBe(1);

    const character = characters[0];
    expect(character!.name).toBe("Some name");
    expect(character!.maximumHealth).toBe(10);
  });
});
