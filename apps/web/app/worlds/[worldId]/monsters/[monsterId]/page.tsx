import { Divider } from "@/components/ui/divider";
import { getWorldData } from "../../actions";
import { H3, H4, Paragraph } from "@/components/ui/typography";
import { ActionCard } from "@/components/action-card";

export default async function MonsterDetailsPage({ params }: { params: { monsterId: string; worldId: string } }) {
  const { worldId, monsterId } = params;
  const worldData = await getWorldData(worldId);

  if (!worldData) {
    return <>World not found!</>;
  }

  const { monsters } = worldData;
  const monster = monsters.find((m) => m.id === monsterId);

  if (!monster) {
    return <>Monster not found!</>;
  }

  return (
    <>
      <H3>{monster.name}</H3>
      <Divider />

      <div className="flex gap-4 py-3">
        <span>{monster.challengeRating} CR</span>
        <span>{monster.baseArmorClass} AC</span>
        <span>{monster.maximumHealth} HP</span>
      </div>

      <Paragraph>{monster.description}</Paragraph>

      <H4>Actions</H4>
      {monster.actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {monster.actions.map((a) => (
            <ActionCard key={a.id} worldId={worldId} action={a} />
          ))}
        </div>
      )}
      {monster.actions.length === 0 && <Paragraph>No actions added to {monster.name} yet</Paragraph>}
    </>
  );
}
