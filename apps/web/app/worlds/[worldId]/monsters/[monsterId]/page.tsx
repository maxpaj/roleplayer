import { Divider } from "@/components/ui/divider";
import { getWorldData } from "../../actions";
import { H4, H5, Paragraph } from "@/components/ui/typography";
import { ActionCard } from "@/components/action-card";

export default async function MonsterDetailsPage({ params }: { params: { monsterId: string; worldId: string } }) {
  const { worldId, monsterId } = params;
  const worldData = await getWorldData(worldId);

  if (!worldData) {
    return <>World not found!</>;
  }

  const { monsters } = worldData;
  const monster = monsters.find((m) => m.monster.id === monsterId);

  if (!monster) {
    return <>Monster not found!</>;
  }

  return (
    <>
      <H4>{monster.monster.name}</H4>
      <Divider />
      <Paragraph>{monster.monster.description}</Paragraph>

      <H5>Actions</H5>
      <div className="flex flex-wrap gap-2">
        {monster.actions.map((a) => (
          <ActionCard key={a.action.id} worldId={worldId} action={a} />
        ))}
      </div>
    </>
  );
}
