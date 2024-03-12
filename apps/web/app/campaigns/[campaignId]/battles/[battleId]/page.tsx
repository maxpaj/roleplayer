import { Battle, Campaign, DefaultRuleSet, World } from "roleplayer";
import { BattleSimulator } from "./components/battle-simulator";
import { H3 } from "@/components/ui/typography";
import { CampaignRepository } from "@/db/repository/drizzle-campaign-repository";
import { classToPlain } from "@/lib/class-to-plain";

async function getCampaignData(
  campaignId: Campaign["id"],
  battleId: Battle["id"]
) {
  return await new CampaignRepository().getCampaign(campaignId);
}

export default async function BattlePage({
  params,
}: {
  params: { campaignId: Campaign["id"]; battleId: Battle["id"] };
}) {
  const { battleId, campaignId } = params;
  const campaignData = await getCampaignData(campaignId, battleId);
  if (!campaignData) {
    throw new Error("");
  }
  const { campaign } = campaignData;

  const world = new World({ ...campaignData.world, ruleset: DefaultRuleSet });
  const campaignRpLib = new Campaign({ ...campaign, world });

  const campaignReduced = campaignRpLib.applyEvents();
  const battle = campaignReduced.battles.find((b) => b.id === battleId);

  if (!battle) {
    return <H3>Battle not found!</H3>;
  }

  return (
    <>
      <BattleSimulator
        campaignActorRecords={[]}
        campaign={classToPlain(campaignRpLib)}
        battleId={battleId}
      />
    </>
  );
}
