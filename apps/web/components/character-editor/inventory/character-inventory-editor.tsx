import { Actor, CharacterEquipmentSlot, CharacterInventoryItem, ItemDefinition, World } from "roleplayer";
import { ItemSelector } from "./item-selector";
import { ItemCard } from "@/components/item-card";
import { H5, Muted } from "@/components/ui/typography";
import { CharacterSlotEquipmentSelector } from "./character-equipment-slot-editor";
import { InventoryItemCard } from "./character-inventory-item-card";

type CharacterInventoryEditorProps = {
  character: Actor;
  world: World;

  onInventoryChange?: (inventory: CharacterInventoryItem[]) => void;
  onEquipmentChange?: (slots: CharacterEquipmentSlot[]) => void;

  onInventoryAdd: (itemDefinition: ItemDefinition) => void;
  onInventoryRemove: (characterInventoryItem: CharacterInventoryItem) => void;
  onEquipmentAdd: (characterEquipmentSlotId: CharacterEquipmentSlot["slotId"], item: CharacterInventoryItem) => void;
  onEquipmentRemove: (
    characterEquipmentSlotId: CharacterEquipmentSlot["slotId"],
    item?: CharacterEquipmentSlot["item"]
  ) => void;
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
        {character.equipment.length === 0 && <Muted>No equipment slots available</Muted>}
        {character.equipment.map((cslot) => {
          const slot = worldEquipmentSlots.find((weq) => weq.id === cslot.slotId);
          if (!slot) {
            throw new Error("Cannot find character equipment slot in world");
          }

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
              onEquipRemove={(characterItemId, item) => {
                const removed = character.equipment.find((eq) => eq.slotId !== slot.id);
                onEquipmentRemove(characterItemId, removed?.item);
                onEquipmentChange && onEquipmentChange(character.equipment.filter((eq) => eq.slotId !== slot.id));
              }}
              onEquipAdd={(characterItemId, item) => {
                const itemInstance: CharacterEquipmentSlot = {
                  slotId: slot.id,
                  item: { id: characterItemId, definition: item },
                };

                const characterInventory = character.inventory.find((i) => i.id === characterItemId);
                if (!characterInventory) {
                  throw new Error("Character inventory not found");
                }

                // Filter the existing equipment and add the new one
                const newEquipment = [...character.equipment.filter((eq) => eq.slotId !== slot.id), itemInstance];
                onEquipmentChange && onEquipmentChange(newEquipment);
                onEquipmentAdd(itemInstance.slotId, characterInventory);
              }}
            />
          );
        })}
      </div>

      <H5>Inventory</H5>
      <div className="my-2 flex flex-wrap gap-2">
        {character.inventory.map((item) => (
          <InventoryItemCard key={item.id} item={item.definition} onRemove={() => onInventoryRemove(item)} />
        ))}
      </div>

      <ItemSelector
        placeholder="Add item to inventory"
        availableItems={world.itemDefinitions.map((i) => ({ id: i.id, item: i }))}
        onSelect={(option) => {
          onInventoryAdd && onInventoryAdd(option.item);
        }}
      />
    </>
  );
}
