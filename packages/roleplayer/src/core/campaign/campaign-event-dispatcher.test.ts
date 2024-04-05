import { DnDRuleset } from "../../data/rulesets/dnd-5th";
import { dangerousGenerateId } from "../../lib/generate-id";
import type { RoleplayerEvent } from "../events/events";
import { Roleplayer } from "../roleplayer";
import { CampaignState } from "./campaign-state";

describe("Campaign", () => {
  it("calculates correct character level", () => {
    const characterId = dangerousGenerateId();
    const roleplayer = new Roleplayer();
    const ruleset = new DnDRuleset(() => 2);
    const campaign = new CampaignState({ id: dangerousGenerateId(), roleplayer, ruleset });

    const events: RoleplayerEvent[] = [
      {
        type: "CharacterSpawned",
        campaignId: campaign.id,
        characterId,
        id: dangerousGenerateId(),
        roundId: dangerousGenerateId(),
        serialNumber: 0,
      },
      {
        type: "CharacterExperienceSet",
        campaignId: campaign.id,
        characterId,
        experience: 100,
        id: dangerousGenerateId(),
        roundId: dangerousGenerateId(),
        serialNumber: 0,
      },
    ];

    roleplayer.events = events;

    const state = roleplayer.getCampaignFromEvents(campaign.id);

    expect(state.characters.length).toBe(1);
    const character = state.characters[0];
    expect(character!.xp).toBe(100);
  });
});
