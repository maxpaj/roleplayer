import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XIcon } from "lucide-react";
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
        <Button variant={"outline"} size="sm" onClick={() => onRemove()}>
          <XIcon size={16} className="mr-2" /> Remove
        </Button>
      </CardHeader>
    </Card>
  );
}
