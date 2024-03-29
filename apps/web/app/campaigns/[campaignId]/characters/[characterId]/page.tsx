import { getCampaign } from "app/campaigns/actions";
import { WorldService } from "services/world-service";
import { ClientCharacterEditor } from "../components/client-character-editor";

export default async function CampaignCharacterPage({
  params: { campaignId, characterId },
}: {
  params: { campaignId: string; characterId: string };
}) {
  const campaignData = await getCampaign(campaignId);
  if (!campaignData) {
    throw new Error("Could not find campaign");
  }

  const worldData = await new WorldService().getWorld(campaignData.userId, campaignData.world.id);
  if (!worldData) {
    throw new Error("Cannot find world");
  }

  return (
    <>
      <ClientCharacterEditor campaignData={campaignData} worldData={worldData} characterId={characterId} />
    </>
  );
}
