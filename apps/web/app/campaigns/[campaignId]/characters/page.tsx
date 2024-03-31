import { ButtonLink } from "@/components/ui/button-link";
import { H4, Muted } from "@/components/ui/typography";
import { getCampaign } from "app/campaigns/actions";
import { CreateCharacterForm } from "app/characters/components/create-character-form";
import { CampaignCharacterCard } from "./components/campaign-character-card";
import { getWorldData } from "app/worlds/[worldId]/actions";
import { mapCampaignWorldData } from "services/data-mapper";

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
  const campaignState = campaign.getCampaignStateFromEvents();

  return (
    <>
      <div className="my-2 flex flex-wrap gap-2">
        <CreateCharacterForm worldId={campaignData.world.id} campaignId={campaignData.id} />

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

      {campaignData.characters.length === 0 && <Muted>No characters added yet.</Muted>}
    </>
  );
}
