"use client";

import { Button } from "@/components/ui/button";
import { deleteCampaign } from "../actions";

export function DeleteCampaignButton({ campaignId }: { campaignId: string }) {
  return (
    <Button
      onClick={async () => {
        await deleteCampaign(campaignId);
      }}
    >
      Delete campaign
    </Button>
  );
}
