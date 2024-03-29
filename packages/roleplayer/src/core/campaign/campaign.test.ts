import { DnDRuleset } from "../../data/rulesets/dnd-5th";
import { dangerousGenerateId } from "../../lib/generate-id";
import { World } from "../world/world";
import { Campaign } from "./campaign";
import { CampaignEventWithRound } from "../events/events";

describe("Campaign", () => {
  it("calculates correct character level", () => {
    const characterId = dangerousGenerateId();
    const events: CampaignEventWithRound[] = [
      {
        type: "CharacterSpawned",
        characterId,
        id: dangerousGenerateId(),
        roundId: dangerousGenerateId(),
        serialNumber: 0,
      },
      {
        type: "CharacterExperienceSet",
        characterId,
        experience: 100,
        id: dangerousGenerateId(),
        roundId: dangerousGenerateId(),
        serialNumber: 0,
      },
    ];

    const world = new World(new DnDRuleset(), "World", {});
    const campaign = new Campaign({
      id: "00000000-0000-0000-0000-000000000000" as const,
      name: "Campaign",
      world,
      events,
    });

    const state = campaign.getCampaignStateFromEvents();

    expect(state.characters.length).toBe(1);
    const character = state.characters[0];
    expect(campaign.getCharacterLevel(character!)).toBe(3);
  });
});
