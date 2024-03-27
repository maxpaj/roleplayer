"use client";

import { CharacterEditor } from "@/components/character-editor/character-editor";
import { ActorRecord } from "models/actor";
import { Campaign, World, DnDRuleset, CampaignEventWithRound, Actor } from "roleplayer";
import { CampaignAggregated } from "services/campaign-service";
import { WorldAggregated } from "services/world-service";

export function ClientCharacterEditor({
  campaignData,
  worldData,
  characterId,
}: {
  campaignData: CampaignAggregated;
  worldData: WorldAggregated;
  characterId: ActorRecord["id"];
}) {
  const campaign = new Campaign({
    ...campaignData,
    world: new World(new DnDRuleset(), worldData.name, worldData as unknown as Partial<World>),
    events: campaignData.events.map((e) => e.eventData as CampaignEventWithRound),
  });

  const world = new World(
    new DnDRuleset(() => {
      throw new Error("Rolling not allowed");
    }),
    worldData.name,
    worldData as unknown as Partial<World>
  );

  const campaignState = campaign.getCampaignStateFromEvents();
  const character = campaignState.characters.find((c) => c.id === characterId);

  if (!character) {
    throw new Error("Character not found in campaign state");
  }

  return (
    <>
      <CharacterEditor
        onSave={function (character: Actor): void {
          throw new Error("Function not implemented.");
        }}
        world={world}
        character={character}
        campaign={campaign}
      />
    </>
  );
}
