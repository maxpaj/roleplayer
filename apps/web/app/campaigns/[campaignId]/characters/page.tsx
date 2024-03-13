import { ButtonLink } from "@/components/ui/button-link";
import { Separator } from "@/components/ui/separator";
import { H3, H4, H5, Muted } from "@/components/ui/typography";
import { getCampaign } from "app/campaigns/actions";
import { CreateCharacterForm } from "app/characters/components/create-character-form";
import Link from "next/link";
import { CampaignCharacterCard } from "./components/campaign-character-card";

export default async function CampaignCharactersPage({
  params,
}: {
  params: { campaignId: string };
}) {
  const { campaignId: id } = params;
  const campaignId = parseInt(id);
  const campaignData = await getCampaign(campaignId);
  if (!campaignData) {
    return <>Campaign not found</>;
  }

  return (
    <>
      <H3>Characters</H3>
      <Separator className="my-3" />

      <div className="flex gap-2 my-2">
        <CreateCharacterForm
          worldId={campaignData.world.id}
          campaignId={campaignData.campaign.id}
        />

        <ButtonLink
          href={`/campaigns/${campaignData.campaign.id}/invite-a-friend`}
          variant="outline"
        >
          Invite a friend
        </ButtonLink>
      </div>

      <H4 className="mt-4">Added characters</H4>
      <div className="flex gap-2">
        {campaignData.characters.map((c) => (
          <CampaignCharacterCard character={c} campaignId={campaignId} />
        ))}
      </div>

      {campaignData.characters.length === 0 && (
        <Muted>No characters added yet.</Muted>
      )}
    </>
  );
}
