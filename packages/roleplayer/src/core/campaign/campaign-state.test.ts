import { DnDRuleset } from "../../data/rulesets/dnd-5th";
import { generateId } from "../../lib/generate-id";
import type { RoleplayerEvent } from "../events/events";
import { Roleplayer } from "../roleplayer";
import { CampaignState } from "./campaign-state";

const ruleset = new DnDRuleset(() => 2);
const roleplayer = new Roleplayer({ ruleset }, { id: generateId() });

describe("Campaign state", () => {
  it("calculates correct character level", () => {
    const characterId = generateId();
    const campaign = new CampaignState({ id: generateId(), roleplayer, ruleset });

    const events: RoleplayerEvent[] = [
      {
        id: generateId(),
        type: "CharacterSpawned",
        characterId,
        serialNumber: 0,
      },
      {
        id: generateId(),
        type: "CharacterExperienceSet",
        characterId,
        experience: 100,
        serialNumber: 0,
      },
    ];

    roleplayer.events = events;

    const state = roleplayer.getCampaignFromEvents(campaign.id);

    expect(state.characters.length).toBe(1);
    const character = state.characters[0];
    expect(character!.xp).toBe(100);
  });

  it("applies events", () => {
    const characterId = generateId();
    const ruleset = new DnDRuleset(() => 2);
    const healthResource = ruleset.getCharacterResourceTypes().find((rt) => rt.name === "Health");
    const campaign = new CampaignState({ id: generateId(), ruleset, roleplayer });

    roleplayer.events = [
      {
        id: generateId(),
        type: "CharacterSpawned",
        characterId,
        serialNumber: 0,
      },
      {
        id: generateId(),
        type: "CharacterNameSet",
        characterId,
        name: "Some name",
        serialNumber: 0,
      },
      {
        id: generateId(),
        type: "CharacterResourceMaxSet",
        characterId,
        resourceTypeId: healthResource!.id,
        max: 10,
        serialNumber: 0,
      },
    ];

    const state = roleplayer.getCampaignFromEvents(campaign.id);

    expect(state.characters.length).toBe(1);

    const character = state.characters[0];
    const characterHealth = character!.resources.find((r) => r.resourceTypeId === healthResource!.id);

    expect(character!.name).toBe("Some name");
    expect(characterHealth!.max).toBe(10);
  });
});
