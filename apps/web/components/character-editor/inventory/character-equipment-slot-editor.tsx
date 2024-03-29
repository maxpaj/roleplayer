import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CharacterEquipmentSlot, CharacterInventoryItem, EquipmentSlotDefinition, ItemDefinition } from "roleplayer";
import { ItemSelector } from "./item-selector";
import { Button } from "@/components/ui/button";

type CharacterSlotEquipmentSelectorProps = {
  slot: EquipmentSlotDefinition;
  existingEquipment?: CharacterEquipmentSlot;
  eligibleEquipment: CharacterInventoryItem[];
  onEquipAdd: (characterItemId: CharacterInventoryItem["id"], item: ItemDefinition) => void;
  onEquipRemove: (characterItemId: CharacterInventoryItem["id"], item: ItemDefinition) => void;
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
        {existingEquipment?.item?.definition && (
          <Button onClick={() => onEquipRemove(slot.id, existingEquipment.item!.definition)}>Remove equipment</Button>
        )}
      </CardHeader>

      <CardContent>
        {!existingEquipment?.item?.definition && (
          <ItemSelector
            availableItems={eligibleEquipment.map((e) => ({ id: e.id, item: e.definition }))}
            onSelect={(option) => onEquipAdd(option.id, option.item)}
          />
        )}
      </CardContent>
    </Card>
  );
}
