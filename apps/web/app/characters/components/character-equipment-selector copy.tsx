import { Button } from "@/components/ui/button";
import { ItemDefinition } from "roleplayer";

type CharacterSlotEquipmentSelectorProps = {
  eligibleEquipment: ItemDefinition[];
  onEquip: (item: ItemDefinition) => void;
};

export function CharacterSlotEquipmentSelector({ eligibleEquipment, onEquip }: CharacterSlotEquipmentSelectorProps) {
  return (
    <>
      {eligibleEquipment.map((slot) => {
        return (
          <Button size="sm" variant="outline" onClick={() => onEquip(slot)}>
            Equip
          </Button>
        );
      })}
    </>
  );
}
