"use client";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { createCampaign } from "app/worlds/[worldId]/actions";
import { WorldRecord } from "@/db/schema/worlds";

type StartCampaignFormProps = {
  worldId: WorldRecord["id"];
};

export function StartCampaignForm({ worldId }: StartCampaignFormProps) {
  return (
    <>
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Reminder</AlertTitle>
        <AlertDescription>
          Any changes made to the world after starting the campaign will not be
          automatically added to the campaign
        </AlertDescription>
      </Alert>

      <Button
        className="mb-2 mt-5"
        onClick={async () => {
          await createCampaign(worldId, {
            name: "My world new campaign",
            isDemo: false,
            worldId,
            userId: 2,
          });
        }}
      >
        Start campaign
      </Button>
    </>
  );
}
