import { Divider } from "@/components/ui/divider";
import { H3, H5, Muted } from "@/components/ui/typography";
import { getWorldData } from "../actions";
import { ItemCard } from "@/components/item-card";
import { ItemType, Rarity } from "roleplayer";
import { CreateItemForm } from "./components/create-item-form";
import Link from "next/link";

export default async function ItemsPage({ params }: { params: { worldId: string } }) {
  const { worldId: id } = params;
  const worldId = id;
  const worldData = await getWorldData(worldId);
  if (!worldData) {
    return <>World not found</>;
  }

  const { itemDefinitions: items } = worldData;

  const itemsMapped = items.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description || "",
    type: ItemType[item.type],
    rarity: Rarity[item.rarity],
  }));

  const equipment = itemsMapped.filter((item) => item.type === ItemType.Equipment);
  const consumables = itemsMapped.filter((item) => item.type === ItemType.Consumable);
  const other = itemsMapped.filter((item) => ![ItemType.Consumable, ItemType.Equipment].includes(ItemType[item.type]));

  return (
    <>
      <H3>Items</H3>
      <Divider className="my-3" />

      <CreateItemForm worldId={worldId} />

      {items.length === 0 && <Muted className="my-4">It's empty! No items added yet.</Muted>}

      <H5 className="my-2">Equipment</H5>
      {equipment.length === 0 && <Muted className="my-4">It's empty! No items added yet.</Muted>}

      <div className="flex flex-wrap gap-2">
        {equipment.map((item) => (
          <Link href={`/worlds/${worldId}/items/${item.id}`} key={item.id}>
            <ItemCard key={item.id} item={item} />
          </Link>
        ))}
      </div>

      <H5 className="my-2">Consumable</H5>
      {consumables.length === 0 && <Muted className="my-4">It's empty! No items added yet.</Muted>}

      <div className="flex flex-wrap gap-2">
        {consumables.map((item) => (
          <Link href={`/worlds/${worldId}/items/${item.id}`} key={item.id}>
            <ItemCard key={item.id} item={item} />
          </Link>
        ))}
      </div>

      <H5 className="my-2">Other</H5>
      {other.length === 0 && <Muted className="my-4">It's empty! No items added yet.</Muted>}

      <div className="flex flex-wrap gap-2">
        {other.map((item) => (
          <Link href={`/worlds/${worldId}/items/${item.id}`} key={item.id}>
            <ItemCard key={item.id} item={item} />
          </Link>
        ))}
      </div>
    </>
  );
}
