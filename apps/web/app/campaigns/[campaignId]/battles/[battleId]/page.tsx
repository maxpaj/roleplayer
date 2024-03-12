import { Battle, Campaign } from "roleplayer";
import { BattleSimulator } from "./components/battle-simulator";
import { H3 } from "@/components/ui/typography";
import { CampaignRepository } from "@/db/drizzle-campaign-repository";
import { classToPlain } from "@/lib/class-to-plain";

async function getData(campaignId: Campaign["id"], battleId: Battle["id"]) {
  const campaignRecord = await new CampaignRepository().getCampaign(campaignId);
  const campaignData = campaignRecord.applyEvents();
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
      <BattleSimulator
        campaignActorRecords={[]}
        campaign={classToPlain(campaign)}
        battleId={battleId}
      />
    </>
  );
}
