import Link from "next/link";
import {
  Card,
  CardBackground,
  CardBackgroundGradient,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { WorldRecord } from "db/schema/worlds";

type WorldCardProps = { world: WorldRecord };

export function WorldCard({ world }: WorldCardProps) {
  return (
    <Link href={`/worlds/${world.id}`}>
      <Card className="w-[200px] h-[150px] overflow-hidden">
        {world.imageUrl ? (
          <CardBackground alt={world.name} src={world.imageUrl} />
        ) : (
          <CardBackgroundGradient />
        )}
        <CardHeader className="p-2">
          <CardTitle className={"text-md"}>{world.name}</CardTitle>
          <CardDescription>{world.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
