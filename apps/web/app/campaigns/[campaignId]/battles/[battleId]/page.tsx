import { Campaign, CampaignEventWithRound } from "roleplayer";
import { BattleSimulator } from "./components/battle-simulator";
import { classToPlain } from "@/lib/class-to-plain";
import { getCampaign } from "app/campaigns/actions";
import { getWorldFromCampaignData } from "services/campaign-service";

export default async function BattlePage({ params }: { params: { campaignId: string; battleId: string } }) {
  const { battleId: bid, campaignId: cid } = params;
  const battleId = bid;
  const campaignId = cid;

  const campaignData = await getCampaign(campaignId);
  if (!campaignData) {
    return <>No campaign found</>;
  }

  const { events, world } = campaignData;

  const campaignRpLib = new Campaign({
    ...campaignData,
    events: events.map((e) => e.eventData) as CampaignEventWithRound[],
    world: getWorldFromCampaignData(campaignData),
  });

  return (
    <>
      <BattleSimulator world={world} campaign={classToPlain(campaignRpLib)} battleId={battleId} />
    </>
  );
}
