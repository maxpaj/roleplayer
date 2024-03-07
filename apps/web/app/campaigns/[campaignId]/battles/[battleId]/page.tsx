import { Battle, Campaign } from "@repo/rp-lib";
import { BattleSimulator } from "./components/battle-simulator";
import { H2 } from "@/components/ui/typography";
import { jsonCampaignRepository } from "storage/json/json-campaign-repository";
import { classToPlain } from "@/lib/class-to-plain";

async function getData(campaignId: Campaign["id"], battleId: Battle["id"]) {
  const { entity: campaign } =
    await jsonCampaignRepository.getCampaign(campaignId);
  const campaignData = campaign.applyEvents();
  const battle = campaignData.battles.find((b) => b.id === battleId);
  return { battle, campaign };
}

export default async function BattlePage({
  params,
}: {
  params: { campaignId: Campaign["id"]; battleId: Battle["id"] };
}) {
  const { battleId, campaignId } = params;
  const { campaign, battle } = await getData(campaignId, battleId);

  if (!battle) {
    return <H2>Battle not found!</H2>;
  }

  return (
    <>
      <BattleSimulator campaign={classToPlain(campaign)} />
    </>
  );
}
