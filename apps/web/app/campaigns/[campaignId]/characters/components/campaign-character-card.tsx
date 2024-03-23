import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CampaignRecord } from "@/db/schema/campaigns";
import { WorldAggregated } from "services/world-service";
import { Actor } from "roleplayer";
import { RemoveFunctions } from "types/without-functions";

type CampaignCharacterCardProps = {
  character: RemoveFunctions<Actor>;
  campaignId: CampaignRecord["id"];
  world: WorldAggregated;
};

export function CampaignCharacterCard({ world, campaignId, character }: CampaignCharacterCardProps) {
  return (
    <Link href={`/campaigns/${campaignId}/characters/${character.id}`}>
      <Card className="h-[100px] w-[150px] overflow-hidden">
        <CardHeader className="p-2">
          <CardTitle>{character.name || "Current"}</CardTitle>
          <CardDescription>
            {character.classes.map((c) => {
              const clazz = world.classes.find((cl) => cl.id === c.classId);

              if (!clazz) {
                throw new Error("Cannot find class");
              }

              return (
                <>
                  {clazz.name} Level {c.level}
                </>
              );
            })}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
