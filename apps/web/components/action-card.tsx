import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { WorldRecord } from "@/db/schema/worlds";
import { ActionAggregated } from "services/data-mapper";

type ActionCardProps = {
  action: ActionAggregated;
  worldId: WorldRecord["id"];
};

export function ActionCard({ worldId, action }: ActionCardProps) {
  return (
    <Link href={`/worlds/${worldId}/actions/${action.id}`}>
      <Card className="h-[100px] w-[150px] overflow-hidden">
        <CardHeader className="p-2">
          <CardTitle className={"text-md"}>{action.name}</CardTitle>
          <CardDescription>{action.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
