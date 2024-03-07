import { Character, Item, World } from "@repo/rp-lib";
import { CharacterEquipmentSlot } from "@repo/rp-lib";
import { ItemCard } from "@/components/item-card";
import { RemoveFunctions } from "types/without-functions";

type CharacterInventoryEditorProps = {
  character: RemoveFunctions<Character>;
  world: RemoveFunctions<World>;
  onChange: (inventory: Item[], equipment: CharacterEquipmentSlot[]) => void;
};
export function CharacterInventoryEditor({
  character,
  world,
  onChange,
}: CharacterInventoryEditorProps) {
  return (
    <>
      {character.inventory.map((item) => {
        return <ItemCard key={item.id} worldId={world.id} item={item} />;
      })}
    </>
  );
}
