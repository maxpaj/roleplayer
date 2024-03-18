import { Divider } from "@/components/ui/divider";
import { H3, Muted } from "@/components/ui/typography";
import { MonsterCard } from "@/components/monster-card";
import { getWorldData } from "../actions";
import { CreateMonsterForm } from "./components/create-monster-form";

export default async function MonstersPage({ params }: { params: { worldId: string } }) {
  const { worldId: id } = params;
  const worldId = id;
  const worldData = await getWorldData(worldId);
  if (!worldData) {
    return <>World not found!</>;
  }

  const { monsters } = worldData;

  return (
    <>
      <H3>Monsters</H3>
      <Muted>A monster is a simpler kind of characters that only appear in battle</Muted>
      <Divider className="my-3" />

      <CreateMonsterForm worldId={worldId} />

      {monsters.length === 0 && <Muted className="my-4">It's empty! No monsters added yet.</Muted>}

      <div className="my-2 flex flex-wrap gap-2">
        {monsters.map((m) => (
          <MonsterCard key={m.monster.id} worldId={id} monster={m} />
        ))}
      </div>
    </>
  );
}
