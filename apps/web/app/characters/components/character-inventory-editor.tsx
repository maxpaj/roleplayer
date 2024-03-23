import { Actor, Item, World } from "roleplayer";
import { CharacterEquipmentSlot } from "roleplayer";
import { RemoveFunctions } from "types/without-functions";
import { ItemSelector } from "./item-selector";
import { ItemCard } from "@/components/item-card";

type CharacterInventoryEditorProps = {
  character: RemoveFunctions<Actor>;
  world: RemoveFunctions<World>;
  onChange: (inventory: Item[], equipment: CharacterEquipmentSlot[]) => void;
};

export function CharacterInventoryEditor({ character, world, onChange }: CharacterInventoryEditorProps) {
  return (
    <>
      <div className="my-2 flex flex-wrap gap-2">
        {character.inventory.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
      <ItemSelector
        placeholder="Add item to inventory"
        availableItems={world.items}
        onChange={(itemId) => {
          const item = world.items.find((i) => i.id === itemId);
          if (!item) {
            throw new Error("Item not found");
          }

          onChange([...character.inventory, item], []);
        }}
      />
    </>
  );
}
