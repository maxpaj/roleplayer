"use client";

import { Button } from "@/components/ui/button";
import { createBattle } from "app/campaigns/actions";
import { CampaignRecord } from "@/db/schema/campaigns";

export function StartBattleButton({ campaignId }: { campaignId: CampaignRecord["id"] }) {
  return <Button onClick={async () => createBattle(campaignId)}>Start battle</Button>;
}
