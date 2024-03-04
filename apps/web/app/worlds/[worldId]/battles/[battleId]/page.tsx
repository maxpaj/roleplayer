import { Battle } from "@repo/rp-lib/battle";
import { BattleSimulator } from "./components/battle-simulator";
import { H2 } from "@/components/ui/typography";

async function getData(battleId: string) {
  const battle: Battle = new Battle();
  return battle;
}

export default async function BattlePage({
  params,
}: {
  params: { battleId: string };
}) {
  const { battleId } = params;
  const battle = await getData(battleId);

  return (
    <>
      <H2>{battle.name}</H2>
      <BattleSimulator />
    </>
  );
}
