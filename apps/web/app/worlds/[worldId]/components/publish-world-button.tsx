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
import { publishWorld } from "../actions";
import { Paragraph } from "@/components/ui/typography";
import { WorldRecord } from "@/db/schema/worlds";

export function PublishWorldButton({
  worldId,
  worldName,
}: {
  worldId: WorldRecord["id"];
  worldName: WorldRecord["name"];
}) {
  const [confirm, setConfirm] = useState<WorldRecord["name"]>("");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Publish world
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Publish world</DialogTitle>
          <DialogDescription>
            Are you sure you want to share {worldName} with the public?
          </DialogDescription>
        </DialogHeader>

        <Paragraph>Type the name of the world below</Paragraph>
        <Input
          placeholder={worldName}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <DialogFooter>
          <Button
            disabled={confirm !== worldName}
            onClick={async () => {
              await publishWorld(worldId);
              setOpen(false);
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
