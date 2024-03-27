import { Button } from "@/components/ui/button";
import { ItemDefinition, EquipmentSlotDefinition } from "roleplayer";

type CharacterEquipmentSlotSelectorProps = {
  item: ItemDefinition;
  eligibleSlots: EquipmentSlotDefinition[];
  onEquipmentChange: (slot: EquipmentSlotDefinition) => void;
};

export function CharacterEquipmentSlotSelector({
  eligibleSlots,
  onEquipmentChange,
}: CharacterEquipmentSlotSelectorProps) {
  return (
    <>
      {eligibleSlots.map((slot) => {
        return (
          <Button size="sm" variant="outline" onClick={() => onEquipmentChange(slot)}>
            Equip
          </Button>
        );
      })}
    </>
  );
}
