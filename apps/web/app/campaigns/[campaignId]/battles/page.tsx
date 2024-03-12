import { H3, Muted } from "@/components/ui/typography";
import { CampaignRepository } from "@/db/drizzle-campaign-repository";
import { BattleCard } from "./components/battle-card";
import { StartBattleButton } from "./components/start-battle-button";

async function getData(campaignId: string) {
  const campaign = await new CampaignRepository().getCampaign(campaignId);
  const campaignData = campaign.applyEvents();
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
      {battles.filter((b) => !b.finished).length === 0 && (
        <Muted>No ongoing battles.</Muted>
      )}

      <div className="flex gap-2 my-3">
        {battles
          .filter((b) => !b.finished)
          .map((battle) => (
            <BattleCard
              key={battle.id}
              battle={battle}
              campaignId={campaignId}
            />
          ))}
      </div>

      <StartBattleButton campaignId={campaignId} />

      <H3 className="mt-4">Previous battles</H3>

      {battles.filter((b) => b.finished).length === 0 && (
        <Muted>No previous battles fought.</Muted>
      )}

      <div className="flex gap-2">
        {battles
          .filter((b) => b.finished)
          .map((battle) => (
            <BattleCard
              key={battle.id}
              battle={battle}
              campaignId={campaignId}
            />
          ))}
      </div>
    </div>
  );
}
