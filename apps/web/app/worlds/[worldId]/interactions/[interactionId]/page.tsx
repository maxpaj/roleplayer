import { Divider } from "@/components/ui/divider";
import { H3, Muted, Paragraph } from "@/components/ui/typography";
import { getWorldData } from "../../actions";
import { EffectCard } from "@/components/effect-card";

export default async function InteractionDetailsPage({
  params,
}: {
  params: { worldId: string; interactionId: string };
}) {
  const { worldId, interactionId } = params;

  const worldData = await getWorldData(worldId);
  if (!worldData) {
    return <>World not found!</>;
  }

  const interaction = worldData.actions.find((a) => a.action.id === interactionId);
  if (!interaction) {
    return <>Action not found!</>;
  }

  return (
    <>
      <H3>{interaction.action.name}</H3>
      <Divider className="my-3" />

      <Paragraph>{interaction.action.description}</Paragraph>

      <div className="flex flex-wrap gap-2">
        {interaction.appliesEffects.map((e) => (
          <EffectCard key={e.id} effect={e} worldId={worldId} />
        ))}
      </div>
    </>
  );
}
