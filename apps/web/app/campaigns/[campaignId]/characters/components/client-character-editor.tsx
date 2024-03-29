"use client";

import { CampaignCharacterEditor } from "@/components/character-editor/campaign-character-editor";
import { EventsTable } from "@/components/events-table";
import { Button } from "@/components/ui/button";
import { H4, Muted } from "@/components/ui/typography";
import { saveCampaignEvents } from "app/campaigns/actions";
import { ActorRecord } from "models/actor";
import { useState } from "react";
import { Campaign, World, DnDRuleset, CampaignEventWithRound } from "roleplayer";
import { CampaignAggregated } from "services/campaign-service";
import { WorldAggregated } from "services/world-service";
import { CharacterEventsTable } from "./character-events-table";
import { ActionCard } from "@/components/action-card";
import { CharacterActionCard } from "./character-action-card";

export function getWorldCampaignState(worldData: WorldAggregated, campaignData: CampaignAggregated) {
  const world = new World(
    new DnDRuleset(() => {
      throw new Error("Rolling not allowed");
    }),
    worldData.name,
    worldData as unknown as Partial<World>
  );

  const campaign = new Campaign({
    ...campaignData,
    world,
    events: campaignData.events.map((e) => e.eventData as CampaignEventWithRound),
  });

  return { world, campaign };
}

export function ClientCharacterEditor({
  campaignData,
  worldData,
  characterId,
}: {
  campaignData: CampaignAggregated;
  worldData: WorldAggregated;
  characterId: ActorRecord["id"];
}) {
  const { world, campaign } = getWorldCampaignState(worldData, campaignData);
  const [update, setUpdate] = useState(campaign);

  const campaignState = update.getCampaignStateFromEvents();
  const character = campaignState.characters.find((c) => c.id === characterId);
  if (!character) {
    throw new Error("Character not found in campaign state");
  }

  const characterEvents = update.getCharacterEvents(characterId);

  return (
    <>
      <Button
        variant="outline"
        className="h-4 px-3 py-4 text-xs"
        onClick={async () => {
          await saveCampaignEvents(campaignData.id, update.events);
        }}
      >
        Save
      </Button>

      <CampaignCharacterEditor
        onSaveCampaign={(campaign: Campaign) => {
          setUpdate((prev) => campaign);
        }}
        world={world}
        character={character}
        campaign={campaign}
      />

      <H4 className="my-2">Actions</H4>
      {character.actions.length === 0 && <Muted>No actions added yet</Muted>}

      <div className="flex flex-wrap gap-2">
        {character.getAvailableActions().map((action) => (
          <CharacterActionCard action={action} />
        ))}
      </div>

      <H4 className="my-2">History</H4>
      <CharacterEventsTable events={characterEvents} />

      {characterEvents.length === 0 && <Muted>No events yet for this character</Muted>}
    </>
  );
}
