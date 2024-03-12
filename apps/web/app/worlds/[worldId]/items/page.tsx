import { ButtonLink } from "@/components/ui/button-link";
import { Separator } from "@/components/ui/separator";
import { H3, H5, Muted } from "@/components/ui/typography";
import { getWorldData } from "../actions";
import { ItemCard } from "@/components/item-card";
import { ItemType } from "roleplayer";

export default async function ItemsPage({
  params,
}: {
  params: { worldId: string };
}) {
  const { worldId: id } = params;
  const worldData = await getWorldData(parseInt(id));
  if (!worldData) {
    return <>World not found</>;
  }

  const { items, world } = worldData;

  const equipment = items.filter((item) => item.type === ItemType.Equipment);
  const consumables = items.filter((item) => item.type === ItemType.Consumable);
  const other = items.filter(
    (item) =>
      ![ItemType.Consumable, ItemType.Equipment].includes(ItemType[item.type])
  );

  return (
    <>
      <H3>Items</H3>
      <Separator className="my-3" />

      {items.length === 0 && (
        <Muted className="my-4">It's empty! No items added yet.</Muted>
      )}

      <H5>Equipment</H5>
      {equipment.length === 0 && (
        <Muted className="my-4">It's empty! No items added yet.</Muted>
      )}

      <div className="flex gap-2 flex-wrap">
        {equipment.map((item) => (
          <ItemCard key={item.id} worldId={id} item={item} />
        ))}
      </div>

      <H5>Consumable</H5>
      {consumables.length === 0 && (
        <Muted className="my-4">It's empty! No items added yet.</Muted>
      )}

      <div className="flex gap-2 flex-wrap">
        {consumables.map((item) => (
          <ItemCard key={item.id} worldId={id} item={item} />
        ))}
      </div>

      <H5>Other</H5>
      {other.length === 0 && (
        <Muted className="my-4">It's empty! No items added yet.</Muted>
      )}

      <div className="flex gap-2 flex-wrap">
        {other.map((item) => (
          <ItemCard key={item.id} worldId={id} item={item} />
        ))}
      </div>

      <ButtonLink
        className="my-2"
        variant="outline"
        href={`/worlds/${world.id}/monsters`}
      >
        Create item
      </ButtonLink>
    </>
  );
}
