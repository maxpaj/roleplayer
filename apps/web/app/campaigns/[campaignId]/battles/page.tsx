import { H4, Muted } from "@/components/ui/typography";
import { BattleCard } from "./components/battle-card";
import { StartBattleButton } from "./components/start-battle-button";
import { getCampaign } from "app/campaigns/actions";
import { getWorldData } from "app/worlds/[worldId]/actions";
import { mapCampaignWorldData } from "services/data-mapper";

export default async function BattlesPage({ params }: { params: { campaignId: string } }) {
  const { campaignId: id } = params;
  const campaignId = id;
  const campaignData = await getCampaign(campaignId);
  if (!campaignData) {
    return <>Campaign not found</>;
  }

  const worldData = await getWorldData(campaignData.worldId);
  if (!worldData) {
    return <>World not found</>;
  }

  const { campaign } = mapCampaignWorldData(worldData, campaignData);
  const { battles } = campaign.getCampaignStateFromEvents();

  return (
    <div>
      <StartBattleButton campaignId={campaignId} />

      <H4 className="mt-4">Ongoing battle</H4>
      {battles.filter((b) => !b.finished).length === 0 && <Muted>No ongoing battles</Muted>}

      <div className="flex gap-2">
        {battles
          .filter((b) => !b.finished)
          .map((battle) => (
            <BattleCard key={battle.id} battle={battle} campaignId={campaignId} />
          ))}
      </div>

      <H4 className="mt-4">Previous battles</H4>

      {battles.filter((b) => b.finished).length === 0 && <Muted>No previous battles fought</Muted>}

      <div className="flex gap-2">
        {battles
          .filter((b) => b.finished)
          .map((battle) => (
            <BattleCard key={battle.id} battle={battle} campaignId={campaignId} />
          ))}
      </div>
    </div>
  );
}
