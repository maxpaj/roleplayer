import { Battle } from "@repo/rp-lib/battle";
import { CreateBattleForm } from "./components/create-battle-form";
import { H2 } from "@/components/ui/typography";

async function getData() {
  const battles: Battle[] = [];
  return battles;
}

export default async function BattlesPage({
  params,
}: {
  params: { worldId: string };
}) {
  const battles = await getData();
  const { worldId } = params;

  return (
    <div>
      <H2>Battles</H2>
      <CreateBattleForm worldId={worldId} />
      <div>
        {battles.map((battle) => (
          <>{battle.name}</>
        ))}
      </div>
    </div>
  );
}
