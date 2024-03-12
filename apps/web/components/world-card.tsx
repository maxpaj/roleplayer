import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { WorldRecord } from "db/schema/worlds";

type WorldCardProps = { world: WorldRecord };

export function WorldCard({ world }: WorldCardProps) {
  return (
    <Link href={`/worlds/${world.id}`}>
      <Card className="w-[200px] h-[150px] overflow-hidden">
        <CardHeader className="p-2">
          <CardTitle className={"text-md"}>{world.name}</CardTitle>
          <CardDescription>{world.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
