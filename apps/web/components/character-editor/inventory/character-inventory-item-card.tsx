import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemDefinition } from "roleplayer";

type InventoryItemCardProps = {
  item: ItemDefinition;
  onRemove: () => void;
};

export function InventoryItemCard({ item, onRemove }: InventoryItemCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription></CardDescription>
        <Button onClick={() => onRemove()}>Remove from inventory</Button>
      </CardHeader>
    </Card>
  );
}
