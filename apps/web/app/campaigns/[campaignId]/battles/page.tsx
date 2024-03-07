import { H2, H3, Muted } from "@/components/ui/typography";
import { jsonCampaignRepository } from "storage/json/json-campaign-repository";
import { BattleCard } from "./components/battle-card";
import { StartBattleButton } from "./components/start-battle-button";
import { Separator } from "@/components/ui/separator";

async function getData(campaignId: string) {
  const campaign = await jsonCampaignRepository.getCampaign(campaignId);
  const campaignData = campaign.entity.applyEvents();
  return campaignData.battles;
}

export default async function BattlesPage({
  params,
}: {
  params: { campaignId: string };
}) {
  const { campaignId } = params;
  const battles = await getData(campaignId);

  return (
    <div>
      <H3>Battles</H3>
      <Separator className="my-3" />

      <StartBattleButton campaignId={campaignId} />

      <H3 className="mt-4">Previous battles</H3>

      {battles.length === 0 && <Muted>No previous battles fought.</Muted>}
      <div className="flex gap-2">
        {battles.map((battle) => (
          <BattleCard battle={battle} />
        ))}
      </div>
    </div>
  );
}
