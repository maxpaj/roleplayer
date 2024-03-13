import { ButtonLink } from "@/components/ui/button-link";
import { Separator } from "@/components/ui/separator";
import { H3, H5, Muted } from "@/components/ui/typography";
import { getCampaign } from "app/campaigns/actions";
import { CreateCharacterForm } from "app/characters/components/create-character-form";
import Link from "next/link";

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

      <H5 className="mt-4">Added characters</H5>
      {campaignData.characters.map((c) => (
        <Link href={`/campaigns/${campaignId}/characters/${c.id}`}>
          {c.name}
        </Link>
      ))}

      {campaignData.characters.length === 0 && (
        <Muted>No characters added yet.</Muted>
      )}
    </>
  );
}
