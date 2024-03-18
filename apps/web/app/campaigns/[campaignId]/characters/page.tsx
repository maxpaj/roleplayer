import { ButtonLink } from "@/components/ui/button-link";
import { Divider } from "@/components/ui/divider";
import { H3, H4, Muted } from "@/components/ui/typography";
import { getCampaign } from "app/campaigns/actions";
import { CreateCharacterForm } from "app/characters/components/create-character-form";
import { CampaignCharacterCard } from "./components/campaign-character-card";

export default async function CampaignCharactersPage({ params }: { params: { campaignId: string } }) {
  const { campaignId: id } = params;
  const campaignId = id;
  const campaignData = await getCampaign(campaignId);
  if (!campaignData) {
    return <>Campaign not found</>;
  }

  return (
    <>
      <H3>Characters</H3>
      <Divider className="my-3" />

      <div className="my-2 flex gap-2">
        <CreateCharacterForm worldId={campaignData.world.id} campaignId={campaignData.id} />

        <ButtonLink href={`/campaigns/${campaignData.id}/invite-a-friend`} variant="outline">
          Invite a friend
        </ButtonLink>
      </div>

      <H4 className="mt-4">Added characters</H4>
      <div className="flex gap-2">
        {campaignData.characters.map((c) => (
          <CampaignCharacterCard key={c.id} character={c} campaignId={campaignId} />
        ))}
      </div>

      {campaignData.characters.length === 0 && <Muted>No characters added yet.</Muted>}
    </>
  );
}
