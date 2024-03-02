import { Battle } from "@repo/rp-lib/battle";
import { BattleSimulator } from "./components/battle-simulator";

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
      <h1>{battle.name}</h1>
      <BattleSimulator />
    </>
  );
}
