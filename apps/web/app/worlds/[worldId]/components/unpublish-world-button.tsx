"use client";

import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter, DialogTrigger, Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { unpublishWorld } from "../actions";
import { useRouter } from "next/navigation";
import { Paragraph } from "@/components/ui/typography";
import { WorldRecord } from "@/db/schema/worlds";

export function UnpublishWorldButton({ worldId, worldName }: { worldId: WorldRecord["id"]; worldName: WorldRecord["name"] }) {
  const [confirm, setConfirm] = useState<WorldRecord["name"]>("");
  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Unpublish world</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Unpublish world</DialogTitle>
          <DialogDescription>
            Are you sure you want to unpublish {worldName}? This will revoke any access to campaigns currently running within this world.
          </DialogDescription>
        </DialogHeader>

        <Paragraph>Type the name of the world below</Paragraph>
        <Input placeholder={worldName} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <DialogFooter>
          <Button
            disabled={confirm !== worldName}
            variant="destructive"
            onClick={async () => {
              await unpublishWorld(worldId);
              router.push(`/worlds/${worldId}/settings`);
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
