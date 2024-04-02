import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CharacterInventoryItem, ItemDefinition } from "roleplayer";
import { ReactNode } from "react";
import { ItemCard } from "@/components/item-card";

type ItemOption = { id: CharacterInventoryItem["id"]; item: ItemDefinition };

type ItemSelectorProps = {
  availableItems: ItemOption[];
  placeholder?: ReactNode;
  onSelect: (item: ItemOption) => void;
};

export function ItemSelector({ availableItems, placeholder = "Select item", onSelect }: ItemSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2">
          {placeholder}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" onCloseAutoFocus={(e) => e.preventDefault()}>
        <DropdownMenuLabel>Select an item</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableItems.map((itemOption: ItemSelectorProps["availableItems"][0]) => {
          return (
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} key={itemOption.id} className="flex justify-between">
              <div>
                <ItemCard item={itemOption.item} onClick={() => onSelect(itemOption)} />
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
