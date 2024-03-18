import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ActionAggregated } from "services/world-service";
import { WorldRecord } from "@/db/schema/worlds";

type ActionCardProps = {
  action: ActionAggregated;
  worldId: WorldRecord["id"];
};

export function ActionCard({ worldId, action }: ActionCardProps) {
  return (
    <Link href={`/worlds/${worldId}/interactions/${action.action.id}`}>
      <Card className="h-[100px] w-[150px] overflow-hidden">
        <CardHeader className="p-2">
          <CardTitle className={"text-md"}>{action.action.name}</CardTitle>
          <CardDescription>{action.action.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
