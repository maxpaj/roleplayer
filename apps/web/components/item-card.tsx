import * as React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { WorldRecord } from "@/db/schema/worlds";
import { Item } from "roleplayer";

type ItemCardProps = {
  item: Partial<Item>;
  worldId: WorldRecord["id"];
};

export function ItemCard({ worldId, item }: ItemCardProps) {
  return (
    <Link href={`/worlds/${worldId}/items/${item.id}`}>
      <Card className="w-[150px] h-[100px]">
        <CardHeader className="p-2">
          <CardTitle className={"text-md"}>{item.name}</CardTitle>
          <CardDescription>{item.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
