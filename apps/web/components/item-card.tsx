import * as React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ItemRecord } from "@/db/schema/items";

type ItemCardProps = {
  item: ItemRecord;
  worldId: string;
};

export function ItemCard({ worldId, item }: ItemCardProps) {
  return (
    <Link href={`/worlds/${worldId}/items/${item.id}`}>
      <Card className="w-[100px] h-[100px]">
        <CardHeader className="p-2">
          <CardTitle className={"text-md"}>{item.name}</CardTitle>
          <CardDescription>{item.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
