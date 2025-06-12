import { DnDRuleset } from "../../data/rulesets/dnd-5th";
import { generateId } from "../../lib/generate-id";
import { startCampaign } from "../actions";
import { CharacterEventTypes, type CampaignEvent, type RoleplayerEvent } from "../events/events";
import { Roleplayer } from "../roleplayer";
import { HealthResourceTypeName } from "../world/resource";

const ruleset = new DnDRuleset((str) => {
  const [, staticValue = "0"] = str.split("+");
  return 2 + +staticValue;
});

describe("Campaign state", () => {
  it("calculates correct character level", () => {
    const roleplayer = new Roleplayer({ ruleset }, { id: generateId() });
    const characterId = generateId();

    roleplayer.dispatchAction(startCampaign());

    const events: RoleplayerEvent[] = [
      {
        id: generateId(),
        type: CharacterEventTypes.CharacterSpawned,
        characterId,
        serialNumber: 0,
        roundId: "0",
      },
      {
        id: generateId(),
        type: CharacterEventTypes.CharacterExperienceSet,
        characterId,
        experience: 100,
        serialNumber: 0,
        roundId: "0",
      },
    ];
    roleplayer.dispatchEvents(...events);

    const state = roleplayer.campaign;
    expect(state.characters.length).toBe(1);
    const character = state.characters[0];
    expect(character?.xp).toBe(100);
  });

  it("applies events", () => {
    const roleplayer = new Roleplayer({ ruleset }, { id: generateId() });

    const characterId = generateId();

    const healthResource = ruleset.getCharacterResourceTypes().find((rt) => rt.name === HealthResourceTypeName);

    const events = [
      {
        type: CharacterEventTypes.CharacterSpawned,
        characterId,
      },
      {
        type: CharacterEventTypes.CharacterNameSet,
        characterId,
        name: "Some name",
      },
      {
        type: CharacterEventTypes.CharacterResourceMaxSet,
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
