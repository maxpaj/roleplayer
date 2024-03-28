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
import { Actor, CharacterClass, Clazz } from "roleplayer";
import { ClazzRecord } from "@/db/schema/classes";
import { RemoveFunctions } from "types/without-functions";
import { Paragraph } from "@/components/ui/typography";

type ClassDropdownProps = {
  characterLevel: number;
  character: RemoveFunctions<Actor>;
  availableClasses: Clazz[];
  placeholder?: ReactNode;
  onAdd: (clazz: CharacterClass) => void;
  onRemove: (clazz: CharacterClass) => void;
  onChange: (classes: CharacterClass[]) => void;
};

export function ClassSelector({
  placeholder = "Select classes",
  availableClasses,
  onChange,
  onAdd,
  onRemove,
  character,
  characterLevel,
}: ClassDropdownProps) {
  const [selectedItems, setSelectedItems] = useState<{ classId: ClazzRecord["id"]; level: number }[]>(
    character.classes
  );

  const onAddClass = (classId: ClazzRecord["id"]) => {
    const item = selectedItems.find((s) => s.classId === classId);

    if (!item) {
      const add = {
        classId: classId,
        level: 1,
      };

      const classes = [...selectedItems, add];

      setSelectedItems(classes);
      onChange(classes);
      onAdd(add);
      return;
    }

    const add = { classId: classId, level: item?.level + 1 };
    const classes = [...selectedItems.filter((s) => s.classId !== classId), add];

    setSelectedItems(classes);
    onChange(classes);
    onAdd(add);
  };

  const onRemoveClass = (classId: ClazzRecord["id"]) => {
    const item = selectedItems.find((s) => s.classId === classId);
    if (!item) {
      throw new Error("Item doesnt exist while removing");
    }

    if (item.level === 1) {
      setSelectedItems(selectedItems.filter((s) => s.classId !== classId));
      onChange(selectedItems.filter((s) => s.classId !== classId));
      onRemove(item);
      return;
    }

    const remove = { classId: classId, level: item?.level - 1 };
    const classes = [...selectedItems.filter((s) => s.classId !== classId), remove];

    onRemove(remove);
    setSelectedItems(classes);
    onChange(classes);
  };

  const levelsSelected = selectedItems.reduce((s, curr) => curr.level + s, 0);
  const hasUsedAllLevelPoints = levelsSelected === characterLevel;

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
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              key={index}
              className="spacing-y-0 flex justify-between"
            >
              <Paragraph className={hasUsedAllLevelPoints && !current ? `text-muted-foreground/50` : "text-foreground"}>
                {classOption.name} {current ? <>(Level {current.level})</> : <></>}
              </Paragraph>
              <div>
                <Button disabled={hasUsedAllLevelPoints} variant="outline" onClick={() => onAddClass(classOption.id)}>
                  +
                </Button>
                <Button disabled={!current} variant="outline" onClick={() => onRemoveClass(classOption.id)}>
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
