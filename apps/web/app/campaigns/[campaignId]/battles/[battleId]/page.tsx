import { Battle, Campaign } from "@repo/rp-lib";
import { BattleSimulator } from "./components/battle-simulator";
import { H3 } from "@/components/ui/typography";
import { jsonCampaignRepository } from "db/json/json-campaign-repository";
import { classToPlain } from "@/lib/class-to-plain";

async function getData(campaignId: Campaign["id"], battleId: Battle["id"]) {
  const campaignRecord = await jsonCampaignRepository.getCampaign(campaignId);
  const campaignData = campaignRecord.entity.applyEvents();
  const battle = campaignData.battles.find((b) => b.id === battleId);
  return { battle, campaign: campaignRecord };
}

export default async function BattlePage({
  params,
}: {
  params: { campaignId: Campaign["id"]; battleId: Battle["id"] };
}) {
  const { battleId, campaignId } = params;
  const { campaign, battle } = await getData(campaignId, battleId);

  if (!battle) {
    return <H3>Battle not found!</H3>;
  }

  return (
    <>
      <BattleSimulator campaign={classToPlain(campaign)} battleId={battleId} />
    </>
  );
}
