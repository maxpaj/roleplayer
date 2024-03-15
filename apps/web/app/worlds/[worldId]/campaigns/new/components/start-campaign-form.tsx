"use client";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { createCampaign } from "app/worlds/[worldId]/actions";
import { WorldRecord } from "@/db/schema/worlds";
import { DEFAULT_USER_ID } from "@/db/index";

type StartCampaignFormProps = {
  worldId: WorldRecord["id"];
  worldName: string;
};

export function StartCampaignForm({ worldName, worldId }: StartCampaignFormProps) {
  return (
    <>
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Reminder</AlertTitle>
        <AlertDescription>Any changes made to the world after starting the campaign will not be automatically added to the campaign</AlertDescription>
      </Alert>

      <Button
        className="mb-2 mt-5"
        onClick={async () => {
          await createCampaign({
            name: `${worldName}: New campaign`,
            isDemo: false,
            worldId,
            userId: DEFAULT_USER_ID
          });
        }}
      >
        Start campaign
      </Button>
    </>
  );
}
