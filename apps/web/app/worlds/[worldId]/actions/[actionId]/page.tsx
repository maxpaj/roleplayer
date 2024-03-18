import { Divider } from "@/components/ui/divider";
import { H3, H4, Paragraph } from "@/components/ui/typography";
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

      <div className="flex gap-4 py-3">
        <span>{action.rangeDistanceMeters} meter range</span>
        {action.eligibleTargets.length > 0 && <span>{action.eligibleTargets.join(", ")} targets</span>}
        <span>{action.rangeDistanceMeters} HP</span>
      </div>

      <Paragraph>{action.description}</Paragraph>

      <H4>Effects</H4>
      {action.appliesEffects.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {action.appliesEffects.map((e) => (
            <EffectCard key={e.id} effect={e} worldId={worldId} />
          ))}
        </div>
      )}
      {action.appliesEffects.length === 0 && <Paragraph>No effects added yet</Paragraph>}
    </>
  );
}
