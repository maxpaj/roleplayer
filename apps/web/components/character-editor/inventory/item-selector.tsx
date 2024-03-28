import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ItemDefinition } from "roleplayer";
import { ReactNode } from "react";
import { ItemCard } from "@/components/item-card";

type ItemSelectorProps = {
  availableItems: ItemDefinition[];
  placeholder?: ReactNode;
  onSelect: (item: ItemDefinition) => void;
};

export function ItemSelector({ availableItems, placeholder = "Select item", onSelect }: ItemSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex gap-2 font-bold">
          <span>{placeholder}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" onCloseAutoFocus={(e) => e.preventDefault()}>
        <DropdownMenuLabel>Select an item</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableItems.map((itemOption: ItemSelectorProps["availableItems"][0]) => {
          return (
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} key={itemOption.id} className="flex justify-between">
              <div>
                <ItemCard item={itemOption} onClick={() => onSelect(itemOption)} />
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
