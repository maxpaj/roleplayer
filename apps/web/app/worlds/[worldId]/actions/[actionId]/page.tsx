import { Divider } from "@/components/ui/divider";
import { H3, Paragraph } from "@/components/ui/typography";
import { getWorldData } from "../../actions";
import { EffectCard } from "@/components/effect-card";

export default async function ActionDetailsPage({ params }: { params: { worldId: string; actionId: string } }) {
  const { worldId, actionId } = params;

  const worldData = await getWorldData(worldId);
  if (!worldData) {
    return <>World not found!</>;
  }

  const action = worldData.actions.find((a) => a.id === actionId);
  if (!action) {
    return <>Action not found!</>;
  }

  return (
    <>
      <H3>{action.name}</H3>
      <Divider className="my-3" />

      <Paragraph>{action.description}</Paragraph>

      <div className="flex flex-wrap gap-2">
        {action.appliesEffects.map((e) => (
          <EffectCard key={e.id} effect={e} worldId={worldId} />
        ))}
      </div>
    </>
  );
}
