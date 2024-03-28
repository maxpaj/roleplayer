import { Actor, CharacterEquipmentSlot, CharacterInventoryItem, World } from "roleplayer";
import { ItemSelector } from "./item-selector";
import { ItemCard } from "@/components/item-card";
import { H5, Muted } from "@/components/ui/typography";
import { CharacterSlotEquipmentSelector } from "./character-equipment-slot-editor";
import { EMPTY_GUID } from "@/lib/guid";

type CharacterInventoryEditorProps = {
  character: Actor;
  world: World;

  onInventoryChange?: (inventory: CharacterInventoryItem[]) => void;
  onEquipmentChange?: (slots: CharacterEquipmentSlot[]) => void;

  onInventoryAdd: (inventory: CharacterInventoryItem) => void;
  onInventoryRemove: (inventory: CharacterInventoryItem) => void;
  onEquipmentAdd: (slot: CharacterEquipmentSlot["slotId"], item: CharacterEquipmentSlot["item"]) => void;
  onEquipmentRemove: (slotId: CharacterEquipmentSlot["slotId"], item?: CharacterEquipmentSlot["item"]) => void;
};

export function CharacterInventoryEditor({
  character,
  world,
  onInventoryAdd,
  onInventoryRemove,
  onInventoryChange,
  onEquipmentAdd,
  onEquipmentRemove,
  onEquipmentChange,
}: CharacterInventoryEditorProps) {
  const worldEquipmentSlots = world.ruleset.getCharacterEquipmentSlots();

  return (
    <>
      <H5>Equipment</H5>
      <div className="my-2">
        {worldEquipmentSlots.length === 0 && <Muted>Nothing equipped</Muted>}
        {worldEquipmentSlots.map((slot) => {
          const characterEligibleEquipment = character.inventory.filter((i) =>
            slot.eligibleEquipmentTypes.includes(i.definition.equipmentType)
          );
          const existingSlotEquipment = character.equipment.find((s) => s.slotId === slot.id);

          return (
            <CharacterSlotEquipmentSelector
              key={slot.id}
              slot={slot}
              existingEquipment={existingSlotEquipment}
              eligibleEquipment={characterEligibleEquipment}
              onEquipRemove={(id, item) => {
                const removed = character.equipment.find((eq) => eq.slotId !== slot.id);
                onEquipmentRemove(id, removed?.item);
                onEquipmentChange && onEquipmentChange(character.equipment.filter((eq) => eq.slotId !== slot.id));
              }}
              onEquipAdd={(id, item) => {
                const itemInstance: CharacterEquipmentSlot = { slotId: slot.id, item: { id, definition: item } };

                // Filter the existing equipment and add the new one
                const newEquipment = [...character.equipment.filter((eq) => eq.slotId !== slot.id), itemInstance];
                onEquipmentChange && onEquipmentChange(newEquipment);
                onEquipmentAdd(itemInstance.slotId, itemInstance.item);
              }}
            />
          );
        })}
      </div>

      <H5>Inventory</H5>
      <div className="my-2 flex flex-wrap gap-2">
        {character.inventory.map((item) => (
          <ItemCard key={item.id} item={item.definition} onClick={() => onInventoryRemove(item)} />
        ))}
      </div>

      <ItemSelector
        placeholder="Add item to inventory"
        availableItems={world.itemDefinitions}
        onSelect={(item) => {
          const newItem = { id: EMPTY_GUID, definition: item };
          onInventoryAdd && onInventoryAdd(newItem);
          onInventoryChange && onInventoryChange([newItem, ...character.inventory]);
        }}
      />
    </>
  );
}
