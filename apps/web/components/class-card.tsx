import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ClazzRecord } from "@/db/schema/classes";
import { WorldRecord } from "@/db/schema/worlds";

type ClassCardProps = {
  clazz: ClazzRecord;
  worldId: WorldRecord["id"];
};

export function ClassCard({ worldId, clazz }: ClassCardProps) {
  return (
    <Link href={`/worlds/${worldId}/classes/${clazz.id}`}>
      <Card className="w-[100px] h-[100px]">
        <CardHeader className="p-2">
          <CardTitle className={"text-md"}>{clazz.name}</CardTitle>
        </CardHeader>
        <CardContent>{clazz.description}</CardContent>
      </Card>
    </Link>
  );
}
