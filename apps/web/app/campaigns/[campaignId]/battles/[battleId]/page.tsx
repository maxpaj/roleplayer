import {
  Campaign,
  CampaignEventWithRound,
  DefaultRuleSet,
  World,
} from "roleplayer";
import { BattleSimulator } from "./components/battle-simulator";
import { classToPlain } from "@/lib/class-to-plain";
import { getCampaign } from "app/campaigns/actions";

export default async function BattlePage({
  params,
}: {
  params: { campaignId: string; battleId: string };
}) {
  const { battleId: bid, campaignId: cid } = params;
  const battleId = bid;
  const campaignId = cid;

  const campaignData = await getCampaign(campaignId);
  if (!campaignData) {
    return <>No campaign found</>;
  }

  const { campaign, events } = campaignData;

  const world = new World({
    ...campaignData.world.world,
    ruleset: DefaultRuleSet,
  });

  const campaignRpLib = new Campaign({
    ...campaign,
    events: events.map((e) => e.eventData) as CampaignEventWithRound[],
    world,
  });

  return (
    <>
      <BattleSimulator
        campaign={classToPlain(campaignRpLib)}
        battleId={battleId}
      />
    </>
  );
}
