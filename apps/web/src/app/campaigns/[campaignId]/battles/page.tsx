import { Battle } from "@repo/dnd-lib/battle";
import { CreateBattleForm } from "./components/create-battle-form";

async function getData() {
  const battles: Battle[] = [];
  return battles;
}

export default async function Battles({}) {
  const battles = await getData();

  return (
    <div>
      <h1>Battles</h1>
      <CreateBattleForm />
      <div>
        {battles.map((battle) => (
          <>{battle.name}</>
        ))}
      </div>
    </div>
  );
}
