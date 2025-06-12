import { CampaignEvent, characterBattleEnter, CharacterEventTypes, startBattle } from "../..";
import { Roleplayer } from "../../core/roleplayer";
import { DnDRuleset } from "./dnd-5th";

describe("dnd-5th", () => {
  it("should calculate battle acting order based on character initiative stats", () => {
    function generateTestEvents(characterId: string, initiative: number) {
      return [
        {
          type: CharacterEventTypes.CharacterSpawned,
          characterId: characterId,
        },
        {
          type: CharacterEventTypes.CharacterNameSet,
          characterId: characterId,
          name: characterId,
        },
        {
          type: CharacterEventTypes.CharacterResourceMaxSet,
          characterId: characterId,
          resourceTypeId: initiativeResource!.id,
          max: 20,
        },
        {
          type: CharacterEventTypes.CharacterResourceGain,
          characterId: characterId,
          resourceTypeId: initiativeResource!.id,
          amount: initiative,
        },
      ] satisfies CampaignEvent[];
    }

    const ruleset = new DnDRuleset();
    const roleplayer = new Roleplayer(
      { ruleset },
      {
        id: "campaign-1",
      }
    );

    const initiativeResource = ruleset.getCharacterResourceTypes().find((r) => r.name === "Initiative");
    const fasterCharacterId = "faster-character-id";
    const slowerCharacterId = "slower-character-id";
    const fastestCharacterId = "fastest-character-id";
    const slowestCharacterId = "slowest-character-id";

    roleplayer.dispatchAction(startBattle());
    roleplayer.dispatchEvents(...generateTestEvents(slowerCharacterId, 5));
    roleplayer.dispatchEvents(...generateTestEvents(slowestCharacterId, 2));
    roleplayer.dispatchEvents(...generateTestEvents(fastestCharacterId, 20));
    roleplayer.dispatchEvents(...generateTestEvents(fasterCharacterId, 10));

    const battle = roleplayer.campaign.getCurrentBattle();
    roleplayer.dispatchAction(characterBattleEnter(slowestCharacterId, battle!.id));
    roleplayer.dispatchAction(characterBattleEnter(slowerCharacterId, battle!.id));
    roleplayer.dispatchAction(characterBattleEnter(fasterCharacterId, battle!.id));
    roleplayer.dispatchAction(characterBattleEnter(fastestCharacterId, battle!.id));

    const actorsByActingOrder = ruleset.getActingOrder(battle!.actors);

    expect(actorsByActingOrder[0]!.id).toBe(fastestCharacterId);
    expect(actorsByActingOrder[1]!.id).toBe(fasterCharacterId);
    expect(actorsByActingOrder[2]!.id).toBe(slowerCharacterId);
    expect(actorsByActingOrder[3]!.id).toBe(slowestCharacterId);
  });
});
