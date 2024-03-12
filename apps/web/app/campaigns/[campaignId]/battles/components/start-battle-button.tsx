"use client";

import { Button } from "@/components/ui/button";
import { Campaign } from "roleplayer";
import { createBattle } from "app/campaigns/actions";

export function StartBattleButton({
  campaignId,
}: {
  campaignId: Campaign["id"];
}) {
  return (
    <Button onClick={async () => createBattle(campaignId)}>Start battle</Button>
  );
}
