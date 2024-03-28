import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CharacterEquipmentSlot, CharacterInventoryItem, EquipmentSlotDefinition, ItemDefinition } from "roleplayer";
import { ItemSelector } from "./item-selector";

type CharacterSlotEquipmentSelectorProps = {
  slot: EquipmentSlotDefinition;
  existingEquipment?: CharacterEquipmentSlot;
  eligibleEquipment: CharacterInventoryItem[];
  onEquipAdd: (id: CharacterInventoryItem["id"], item: ItemDefinition) => void;
  onEquipRemove: (id: CharacterInventoryItem["id"], item: ItemDefinition) => void;
};

export function CharacterSlotEquipmentSelector({
  slot,
  onEquipAdd,
  onEquipRemove,
  existingEquipment,
  eligibleEquipment,
}: CharacterSlotEquipmentSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{slot.name || "Slot?"}</CardTitle>
        <CardDescription>{existingEquipment?.item?.definition.name}</CardDescription>
      </CardHeader>

      <CardContent>
        <ItemSelector
          // TODO: Kind of hacking together item instance and definition here to make it work, fix?
          availableItems={eligibleEquipment.map((e) => ({ ...e.definition, id: e.id }))}
          onSelect={(equipment) => onEquipAdd(equipment.id, equipment)}
        />
      </CardContent>
    </Card>
  );
}
