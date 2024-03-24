import { ItemEditor } from "@/components/item-editor";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { H3 } from "@/components/ui/typography";
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
      <div className="flex gap-2">
        <Badge variant="outline" className="mb-2">
          {item.rarity}
        </Badge>
        <Badge variant="outline" className="mb-2">
          {item.type}
        </Badge>
      </div>

      <ItemEditor item={item} worldData={worldData} />
    </>
  );
}
