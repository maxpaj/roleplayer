"use client";

import { ReactNode, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../../../components/ui/dropdown-menu";
import { Button } from "../../../../../../components/ui/button";
import { Character, Clazz } from "@repo/rp-lib/character";
import { RemoveFunctions } from "types/without-functions";

type ClassDropdownProps = {
  characterLevel: number;
  character: RemoveFunctions<Character>;
  availableClasses: Clazz[];
  placeholder?: ReactNode;
  onChange: (classes: { classId: string; level: number }[]) => void;
};

export default function ClassDropdown({
  placeholder = "Select classes",
  availableClasses,
  onChange,
  character,
  characterLevel: characterLevels,
}: ClassDropdownProps) {
  const [selectedItems, setSelectedItems] = useState<
    { classId: string; level: number }[]
  >(character.classes);

  const onAdd = (value: string) => {
    const item = selectedItems.find((s) => s.classId === value);
    if (!item) {
      const classes = [
        ...selectedItems,
        {
          classId: value,
          level: 1,
        },
      ];

      setSelectedItems(classes);
      onChange(classes);
      return;
    }

    const classes = [
      ...selectedItems.filter((s) => s.classId !== value),
      { classId: value, level: item?.level + 1 },
    ];

    setSelectedItems(classes);
    onChange(classes);
  };

  const onRemove = (value: string) => {
    const item = selectedItems.find((s) => s.classId === value);
    if (!item) {
      throw new Error("Item doesnt exist while removing");
    }

    if (item.level === 1) {
      setSelectedItems(selectedItems.filter((s) => s.classId !== value));
      onChange(selectedItems.filter((s) => s.classId !== value));
      return;
    }

    const classes = [
      ...selectedItems.filter((s) => s.classId !== value),
      { classId: value, level: item?.level - 1 },
    ];

    setSelectedItems(classes);
    onChange(classes);
  };

  const levelsSelected = selectedItems.reduce((s, curr) => curr.level + s, 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex gap-2 font-bold">
          <span>{placeholder}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {availableClasses.map(
          (
            option: ClassDropdownProps["availableClasses"][0],
            index: number
          ) => {
            const current = selectedItems.find((i) => i.classId === option.id);

            return (
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                key={index}
                className="flex justify-between"
              >
                {option.name} {current ? <>({current.level})</> : <></>}
                <div>
                  <Button
                    disabled={levelsSelected === characterLevels}
                    variant="outline"
                    onClick={() => onAdd(option.id)}
                  >
                    +
                  </Button>
                  <Button
                    disabled={!current}
                    variant="outline"
                    onClick={() => onRemove(option.id)}
                  >
                    -
                  </Button>
                </div>
              </DropdownMenuItem>
            );
          }
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
