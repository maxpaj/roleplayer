"use client";

import { ReactNode, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Actor, Clazz } from "roleplayer";
import { ClazzRecord } from "@/db/schema/classes";
import { RemoveFunctions } from "types/without-functions";

type ClassDropdownProps = {
  characterLevel: number;
  character: RemoveFunctions<Actor>;
  availableClasses: Clazz[];
  placeholder?: ReactNode;
  onChange: (classes: { classId: ClazzRecord["id"]; level: number }[]) => void;
};

export function ClassSelector({
  placeholder = "Select classes",
  availableClasses,
  onChange,
  character,
  characterLevel,
}: ClassDropdownProps) {
  const [selectedItems, setSelectedItems] = useState<{ classId: ClazzRecord["id"]; level: number }[]>(
    character.classes
  );

  const onAdd = (classId: ClazzRecord["id"]) => {
    const item = selectedItems.find((s) => s.classId === classId);
    if (!item) {
      const classes = [
        ...selectedItems,
        {
          classId: classId,
          level: 1,
        },
      ];

      setSelectedItems(classes);
      onChange(classes);
      return;
    }

    const classes = [
      ...selectedItems.filter((s) => s.classId !== classId),
      { classId: classId, level: item?.level + 1 },
    ];

    setSelectedItems(classes);
    onChange(classes);
  };

  const onRemove = (classId: ClazzRecord["id"]) => {
    const item = selectedItems.find((s) => s.classId === classId);
    if (!item) {
      throw new Error("Item doesnt exist while removing");
    }

    if (item.level === 1) {
      setSelectedItems(selectedItems.filter((s) => s.classId !== classId));
      onChange(selectedItems.filter((s) => s.classId !== classId));
      return;
    }

    const classes = [
      ...selectedItems.filter((s) => s.classId !== classId),
      { classId: classId, level: item?.level - 1 },
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

      <DropdownMenuContent className="w-56" onCloseAutoFocus={(e) => e.preventDefault()}>
        <DropdownMenuLabel>Select a class</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableClasses.map((classOption: ClassDropdownProps["availableClasses"][0], index: number) => {
          const current = selectedItems.find((i) => i.classId === classOption.id);

          return (
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} key={index} className="flex justify-between">
              {classOption.name} {current ? <>({current.level})</> : <></>}
              <div>
                <Button
                  disabled={levelsSelected === characterLevel}
                  variant="outline"
                  onClick={() => onAdd(classOption.id)}
                >
                  +
                </Button>
                <Button disabled={!current} variant="outline" onClick={() => onRemove(classOption.id)}>
                  -
                </Button>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
