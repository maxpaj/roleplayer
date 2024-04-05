"use client";

import { CampaignCharacterEditor } from "@/components/character-editor/campaign-character-editor";
import { H4, Muted } from "@/components/ui/typography";
import { saveCampaignEvents } from "app/campaigns/actions";
import { ActorRecord } from "models/actor";
import { useCallback, useState } from "react";
import { CampaignEventDispatcher } from "roleplayer";
import { CampaignAggregated, WorldAggregated, mapCampaignWorldData } from "services/data-mapper";
import { CharacterActionCard } from "./character-action-card";
import { CharacterEventsTable } from "./character-events-table";
import { CharacterResources } from "./character-resources";

export function ClientCharacterEditor({
  campaignData,
  worldData,
  characterId,
}: {
  campaignData: CampaignAggregated;
  worldData: WorldAggregated;
  characterId: ActorRecord["id"];
}) {
  const { world, campaign } = mapCampaignWorldData(worldData, campaignData);
  const [update, setUpdate] = useState(campaign);
  const [, triggerUpdate] = useState({});
  const forceUpdate = useCallback(() => triggerUpdate({}), []);

  const campaignState = update.getCampaignFromEvents();
  const character = campaignState.characters.find((c) => c.id === characterId);
  if (!character) {
    throw new Error("Character not found in campaign state");
  }

  const characterEvents = update.getCharacterEvents(characterId);

  return (
    <>
      <CampaignCharacterEditor
        onSaveCampaign={async (campaign: CampaignEventDispatcher) => {
          setUpdate(campaign);
          await saveCampaignEvents(campaign.id, campaign.roleplayer.events);
          forceUpdate();
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

      <H4 className="my-2">Resources</H4>
      <CharacterResources
        characterResources={character.resources}
        characterResourceGeneration={world.ruleset.characterResourceGeneration(character)}
        resourceTypes={world.ruleset.getCharacterResourceTypes()}
      />

      <H4 className="my-2">History</H4>
      <CharacterEventsTable events={characterEvents} />

      {characterEvents.length === 0 && <Muted>No events yet for this character</Muted>}
    </>
  );
}
