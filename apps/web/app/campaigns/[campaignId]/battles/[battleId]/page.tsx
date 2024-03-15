import { Battle, Campaign, DefaultRuleSet, World } from "roleplayer";
import { BattleSimulator } from "./components/battle-simulator";
import { CampaignService } from "services/campaign-service";
import { classToPlain } from "@/lib/class-to-plain";

async function getCampaignData(campaignId: Campaign["id"]) {
  return await new CampaignService().getCampaign(campaignId);
}

export default async function BattlePage({
  params,
}: {
  params: { campaignId: Campaign["id"]; battleId: Battle["id"] };
}) {
  const { battleId, campaignId } = params;
  const campaignData = await getCampaignData(campaignId);
  if (!campaignData) {
    return <>No campaign found</>;
  }

  const { campaign } = campaignData;

  const world = new World({
    ...campaignData.world.world,
    ruleset: DefaultRuleSet,
  });
  const campaignRpLib = new Campaign({ ...campaign, world });
  const campaignReduced = campaignRpLib.applyEvents();
  const battle = campaignReduced.battles.find((b) => b.id === battleId);

  if (!battle) {
    return <>Battle not found!</>;
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
