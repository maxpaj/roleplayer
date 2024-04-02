import { ErrorBoundary } from "@sentry/nextjs";
import { BattleSimulator } from "../../../../../components/battle-editor/battle-simulator";
import { getCampaign } from "app/campaigns/actions";
import { getWorldData } from "app/worlds/[worldId]/actions";

export default async function BattlePage({ params }: { params: { campaignId: string; battleId: string } }) {
  const { battleId: bid, campaignId: cid } = params;
  const battleId = bid;
  const campaignId = cid;

  const campaignData = await getCampaign(campaignId);
  if (!campaignData) {
    return <>Campaign not found</>;
  }

  const worldData = await getWorldData(campaignData.worldId);
  if (!worldData) {
    return <>World not found</>;
  }

  return (
    <>
      <BattleSimulator worldData={worldData} campaignData={campaignData} battleId={battleId} />
    </>
  );
}
