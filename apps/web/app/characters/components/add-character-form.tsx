"use client";

import { CharacterSelector } from "@/components/character-selector";
import { addCharacterToCampaign } from "app/campaigns/actions";
import { Actor } from "roleplayer";
import { ActorAggregated, mapCharacterRecordToActor } from "services/data-mapper";

type AddCharacterFormProps = { campaignId: string; characters: ActorAggregated[] };

export function AddCharacterForm({ campaignId, characters }: AddCharacterFormProps) {
  return (
    <CharacterSelector
      characters={characters.map(mapCharacterRecordToActor)}
      onSelectedCharacter={(targets: Actor[]) => {
        if (!targets[0]) {
          return;
        }

        const chars = characters.find((c) => c.id === targets[0]!.id);
        addCharacterToCampaign(campaignId, chars!);
      }}
    />
  );
}
