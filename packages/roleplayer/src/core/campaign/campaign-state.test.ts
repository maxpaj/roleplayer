import { DnDRuleset } from "../../data/rulesets/dnd-5th";
import { generateId } from "../../lib/generate-id";
import { startCampaign } from "../actions";
import type { CampaignEvent, RoleplayerEvent } from "../events/events";
import { Roleplayer } from "../roleplayer";

const ruleset = new DnDRuleset((str) => {
  const [, staticValue = "0"] = str.split("+");
  return 2 + +staticValue;
});
const roleplayer = new Roleplayer({ ruleset }, { id: generateId() });

describe("Campaign state", () => {
  it("calculates correct character level", () => {
    const characterId = generateId();

    const events: RoleplayerEvent[] = [
      {
        id: generateId(),
        type: "CharacterSpawned" as const,
        characterId,
        serialNumber: 0,
        roundId: "0",
      },
      {
        id: generateId(),
        type: "CharacterExperienceSet" as const,
        characterId,
        experience: 100,
        serialNumber: 0,
        roundId: "0",
      },
    ];

    const action = startCampaign();
    action(roleplayer.dispatchEvents.bind(roleplayer), () => roleplayer);

    const state = roleplayer.campaign;
    expect(state.characters.length).toBe(1);
    const character = state.characters[0];
    expect(character?.xp).toBe(100);
  });

  it("applies events", () => {
    const roleplayer = new Roleplayer({ ruleset }, { id: generateId() });

    const characterId = generateId();

    const healthResource = ruleset.getCharacterResourceTypes().find((rt) => rt.name === "Health");

    const events = [
      {
        type: "CharacterSpawned",
        characterId,
      },
      {
        type: "CharacterNameSet",
        characterId,
        name: "Some name",
      },
      {
        type: "CharacterResourceMaxSet",
        characterId,
        resourceTypeId: healthResource!.id,
        max: 10,
      },
    ] satisfies CampaignEvent[];

    roleplayer.dispatchEvents(...events);

    const state = roleplayer.campaign;
    expect(state.characters.length).toBe(1);

    const character = state.characters[0];
    const characterHealth = character!.resources.find((r) => r.resourceTypeId === healthResource!.id);

    expect(character!.name).toBe("Some name");
    expect(characterHealth!.max).toBe(10);
  });
});
