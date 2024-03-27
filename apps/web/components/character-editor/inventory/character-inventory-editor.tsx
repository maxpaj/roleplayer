import { Actor, CharacterEquipmentSlot, CharacterInventoryItem, World } from "roleplayer";
import { ItemSelector } from "./item-selector";
import { ItemCard } from "@/components/item-card";
import { H5, Muted } from "@/components/ui/typography";
import { CharacterSlotEquipmentSelector } from "./character-equipment-slot-editor";
import { EMPTY_GUID } from "@/lib/guid";

type CharacterInventoryEditorProps = {
  character: Actor;
  world: World;
  onInventoryChange: (inventory: CharacterInventoryItem[]) => void;
  onEquipmentChange: (equipment: CharacterEquipmentSlot[]) => void;
};

export function CharacterInventoryEditor({
  character,
  world,
  onInventoryChange,
  onEquipmentChange,
}: CharacterInventoryEditorProps) {
  const slots = world.ruleset.getCharacterEquipmentSlots();

  return (
    <>
      <H5>Equipment</H5>
      <div className="my-2">
        {slots.length === 0 && <Muted>Nothing equipped</Muted>}
        {slots.map((slot) => {
          const eligibleEquipment = character.inventory.filter((i) =>
            slot.eligibleEquipmentTypes.includes(i.definition.equipmentType)
          );
          const equip = character.equipment.find((s) => s.slotId === slot.id);

          if (!equip) {
            return (
              <CharacterSlotEquipmentSelector
                key={slot.id}
                eligibleEquipment={eligibleEquipment.map((i) => i.definition)}
                onEquip={(item) => {
                  console.log("item equipped", item);
                }}
              />
            );
          }

          return (
            <div>
              {equip.item?.definition.name} {slot.name}
            </div>
          );
        })}
      </div>

      <H5>Inventory</H5>
      <div className="my-2 flex flex-wrap gap-2">
        {character.inventory.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>

      <ItemSelector
        placeholder="Add item to inventory"
        availableItems={world.itemDefinitions}
        onChange={(itemId) => {
          const item = world.itemDefinitions.find((i) => i.id === itemId);
          if (!item) {
            throw new Error("Item not found");
          }

          onInventoryChange([...character.inventory, { definition: item, id: EMPTY_GUID }]);
        }}
      />
    </>
  );
}
