import { DnDRuleset } from "../../data/rulesets/dnd-5th";
import { dangerousGenerateId } from "../../lib/generate-id";
import { CampaignEventWithRound } from "../events/events";
import { Roleplayer } from "../roleplayer";
import { World } from "../world/world";
import { CampaignState } from "./campaign-state";

const roleplayer = new Roleplayer({});

describe("Campaign state", () => {
  it("applies events", () => {
    const characterId = dangerousGenerateId();
    const ruleset = new DnDRuleset(() => 2);
    const world = new World(ruleset, "World", {});
    const healthResource = world.ruleset.getCharacterResourceTypes().find((rt) => rt.name === "Health");
    const campaign = new CampaignState({ id: dangerousGenerateId(), ruleset, roleplayer });
    const events: CampaignEventWithRound[] = [
      {
        type: "CharacterSpawned",
        characterId,
        campaignId: campaign.id,
        id: dangerousGenerateId(),
        roundId: dangerousGenerateId(),
        serialNumber: 0,
      },
      {
        type: "CharacterNameSet",
        characterId,
        campaignId: campaign.id,
        id: dangerousGenerateId(),
        name: "Some name",
        roundId: dangerousGenerateId(),
        serialNumber: 0,
      },
      {
        type: "CharacterResourceMaxSet",
        characterId,
        campaignId: campaign.id,
        id: dangerousGenerateId(),
        roundId: dangerousGenerateId(),
        resourceTypeId: healthResource!.id,
        max: 10,
        serialNumber: 0,
      },
    ];
    roleplayer.events = events;
    const state = roleplayer.getCampaignFromEvents(campaign.id);

    expect(state.characters.length).toBe(1);

    const character = state.characters[0];
    const characterHealth = character!.resources.find((r) => r.resourceTypeId === healthResource!.id);

    expect(character!.name).toBe("Some name");
    expect(characterHealth!.max).toBe(10);
  });
});
