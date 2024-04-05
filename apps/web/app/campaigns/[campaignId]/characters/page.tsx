import { ButtonLink } from "@/components/ui/button-link";
import { H4, Muted } from "@/components/ui/typography";
import { getCampaign } from "app/campaigns/actions";
import { AddCharacterForm } from "app/characters/components/add-character-form";
import { CreateCharacterForm } from "app/characters/components/create-character-form";
import { getWorldData } from "app/worlds/[worldId]/actions";
import { mapCampaignWorldData } from "services/data-mapper";
import { CampaignCharacterCard } from "./components/campaign-character-card";

export default async function CampaignCharactersPage({ params }: { params: { campaignId: string } }) {
  const { campaignId: id } = params;
  const campaignId = id;
  const campaignData = await getCampaign(campaignId);
  if (!campaignData) {
    return <>Campaign not found</>;
  }

  const worldData = await getWorldData(campaignData.worldId);
  if (!worldData) {
    return <>World not found</>;
  }

  const { campaign } = mapCampaignWorldData(worldData, campaignData);
  const campaignState = roleplayer.getCampaignFromEvents();

  return (
    <>
      <div className="my-2 flex flex-wrap gap-2">
        <CreateCharacterForm worldId={campaignData.world.id} campaignId={campaignData.id} />
        <AddCharacterForm campaignId={campaignData.id} characters={worldData.characters} />

        <ButtonLink href={`/campaigns/${campaignData.id}/invite-a-friend`} variant="outline">
          Invite a friend
        </ButtonLink>
      </div>

      <H4 className="mt-4">Added characters</H4>
      <div className="flex gap-2">
        {campaignState.characters.map((c) => (
          <CampaignCharacterCard key={c.id} world={worldData} character={c} campaignId={campaignId} />
        ))}
      </div>

      {campaignState.characters.length === 0 && <Muted>No characters added yet.</Muted>}
    </>
  );
}
