import * as React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemDefinition } from "roleplayer";

type ItemCardProps = {
  item: Partial<ItemDefinition>;
  onClick?: () => void;
};

export function ItemCard({ item, onClick }: ItemCardProps) {
  return (
    <Card className="h-[100px] w-[150px] overflow-hidden" onClick={onClick}>
      <CardHeader className="p-2">
        <CardTitle className={"text-md"}>{item.name}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
