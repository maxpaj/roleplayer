"use client";

import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Paragraph } from "@/components/ui/typography";
import { CampaignRecord } from "@/db/schema/campaigns";
import { deleteCampaign } from "app/campaigns/actions";

export function DeleteCampaignButton({
  campaignId,
  campaignName,
}: {
  campaignId: CampaignRecord["id"];
  campaignName: CampaignRecord["name"];
}) {
  const [confirm, setConfirm] = useState("");
  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive-outline">Delete campaign</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete campaign</DialogTitle>
          <DialogDescription>
            Are you sure you want to permanently delete {campaignName}?
          </DialogDescription>
        </DialogHeader>
        <Paragraph>Type the name of the campaign below</Paragraph>
        <Input
          placeholder={campaignName}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <DialogFooter>
          <Button
            disabled={confirm !== campaignName}
            variant="destructive"
            onClick={async () => {
              await deleteCampaign(campaignId);
              router.push("/campaigns");
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
