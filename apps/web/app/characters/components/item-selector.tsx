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
  onChange: (itemId: ItemDefinition["id"]) => void;
};

export function ItemSelector({ availableItems, placeholder = "Select item", onChange }: ItemSelectorProps) {
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
        {availableItems.map((itemOption: ItemSelectorProps["availableItems"][0], index: number) => {
          return (
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} key={index} className="flex justify-between">
              <div>
                <ItemCard item={itemOption} onClick={() => onChange(itemOption.id)} />
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
