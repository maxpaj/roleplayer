import { Separator } from "@/components/ui/separator";
import { H3, Muted } from "@/components/ui/typography";
import { MonsterCard } from "@/components/monster-card";
import { ButtonLink } from "@/components/ui/button-link";
import { getWorld } from "../actions";

export default async function MonstersPage({
  params,
}: {
  params: { worldId: string };
}) {
  const { worldId: id } = params;
  const { entity: world } = await getWorld(id);

  return (
    <>
      <H3>Monsters</H3>
      <Muted>
        A monster is a simpler kind of characters that only appear in battle
      </Muted>
      <Separator className="my-3" />

      {world.monsters.length === 0 && (
        <Muted className="my-4">It's empty! No monsters added yet.</Muted>
      )}

      <div className="flex gap-2 flex-wrap">
        {world.monsters.map((m) => (
          <MonsterCard key={m.id} worldId={id} monster={m} />
        ))}
      </div>

      <ButtonLink
        className="my-2"
        variant="outline"
        href={`/worlds/${world.id}/monsters`}
      >
        Create monster
      </ButtonLink>
    </>
  );
}
