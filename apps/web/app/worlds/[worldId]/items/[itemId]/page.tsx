import { EffectDetails } from "@/components/effect-details";
import { Divider } from "@/components/ui/divider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { H3, H4, Paragraph } from "@/components/ui/typography";
import { DEFAULT_USER_ID } from "@/db/data";
import { WorldService } from "services/world-service";

export default async function ItemDetailsPage({
  params: { worldId, itemId },
}: {
  params: { worldId: string; itemId: string };
}) {
  const worldData = await new WorldService().getWorld(DEFAULT_USER_ID, worldId);

  if (!worldData) {
    return <>World not found</>;
  }

  const { items } = worldData;
  const item = items.find((c) => c.id === itemId);

  if (!item) {
    return <>Item not found</>;
  }

  return (
    <>
      <H3>{item.name}</H3>
      <Divider className="my-3" />
      <Paragraph>{item.description}</Paragraph>

      {item.actions.map((e) => {
        return (
          <div className="border px-3 py-1" key={e.id}>
            <H4>{e.name}</H4>
            <Paragraph>{e.description}</Paragraph>
            <div>
              {e.appliesEffects.map((e) => (
                <EffectDetails key={e.id} effect={e} />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
