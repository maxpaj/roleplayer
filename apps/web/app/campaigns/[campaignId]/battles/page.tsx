import { Battle } from "@repo/rp-lib/battle";
import { CreateBattleForm } from "./components/create-battle-form";

async function getData() {
  const battles: Battle[] = [];
  return battles;
}

export default async function BattlesPage({
  params,
}: {
  params: { campaignId: string };
}) {
  const battles = await getData();
  const { campaignId } = params;

  return (
    <div>
      <h1>Battles</h1>
      <CreateBattleForm campaignId={campaignId} />
      <div>
        {battles.map((battle) => (
          <>{battle.name}</>
        ))}
      </div>
    </div>
  );
}
