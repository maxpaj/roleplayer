"use client";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { H5 } from "@/components/ui/typography";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { World } from "roleplayer";
import { createCampaign } from "app/worlds/[worldId]/actions";
import { redirect } from "next/navigation";

type StartCampaignFormProps = {
  worldId: World["id"];
};

export function StartCampaignForm({ worldId }: StartCampaignFormProps) {
  const [adventurers, setAdventurers] = useState([]);

  return (
    <>
      <H5>Adventurers</H5>
      <div className="flex gap-2 my-2">
        <Button variant="outline">Add player character</Button>
        <Button variant="outline">Invite a friend</Button>
      </div>

      <Separator className="my-4" />

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
          await createCampaign(worldId, adventurers);
        }}
      >
        Start campaign
      </Button>
    </>
  );
}
