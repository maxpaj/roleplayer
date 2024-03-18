import { DefaultRuleSet } from "../../data/data";
import { dangerousGenerateId } from "../../lib/generate-id";
import { World } from "../world/world";
import { Campaign } from "./campaign";
import { CampaignEventWithRound } from "./campaign-events";

describe("Campaign state", () => {
  it("applies events", () => {
    const characterId = dangerousGenerateId();
    const world = new World({ name: "World", ruleset: DefaultRuleSet });
    const healthResource = world.ruleset.characterResourceTypes.find((rt) => rt.name === "Health");
    const events: CampaignEventWithRound[] = [
      {
        type: "CharacterSpawned",
        characterId,
        id: dangerousGenerateId(),
        roundId: dangerousGenerateId(),
        serialNumber: 0,
      },
      {
        type: "CharacterNameSet",
        characterId,
        id: dangerousGenerateId(),
        name: "Some name",
        roundId: dangerousGenerateId(),
        serialNumber: 0,
      },
      {
        type: "CharacterResourceMaxSet",
        characterId,
        id: dangerousGenerateId(),
        roundId: dangerousGenerateId(),
        resourceTypeId: healthResource!.id,
        max: 10,
        serialNumber: 0,
      },
    ];

    const campaign = new Campaign({ id: "0000000-0000-0000-0000-000000000000" as const, name: "Campaign", world, events });
    const state = campaign.getCampaignStateFromEvents();

    expect(state.characters.length).toBe(1);

    const character = state.characters[0];
    const characterHealth = character!.resources.find((r) => r.resourceTypeId === healthResource!.id);

    expect(character!.name).toBe("Some name");
    expect(characterHealth!.amount).toBe(10);
  });
});
