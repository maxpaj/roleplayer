import { DnDRuleset } from "../../data/rulesets/dnd-5th";
import { dangerousGenerateId } from "../../lib/generate-id";
import { CampaignEventWithRound } from "../events/events";
import { Roleplayer } from "../roleplayer";
import { World } from "../world/world";
import { Campaign } from "./campaign";

const roleplayer = new Roleplayer({ roll: (dice) => 2 });

describe("Campaign state", () => {
  it("applies events", () => {
    const characterId = dangerousGenerateId();
    const world = new World(new DnDRuleset(() => 2), "World", {});
    const healthResource = world.ruleset.getCharacterResourceTypes().find((rt) => rt.name === "Health");
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
    roleplayer.events = events;
    const campaign = new Campaign({
      id: "00000000-0000-0000-0000-000000000000" as const,
      name: "Campaign",
      world,
      roleplayer,
    });
    const state = campaign.getCampaignStateFromEvents();

    expect(state.characters.length).toBe(1);

    const character = state.characters[0];
    const characterHealth = character!.resources.find((r) => r.resourceTypeId === healthResource!.id);

    expect(character!.name).toBe("Some name");
    expect(characterHealth!.max).toBe(10);
  });
});
