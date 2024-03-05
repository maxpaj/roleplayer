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

export function PublishWorldButton({ worldId }: { worldId: string }) {
  const [confirm, setConfirm] = useState("");
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
            Are you sure you want to share {worldId} with the public?
          </DialogDescription>
        </DialogHeader>

        <Paragraph>Type the name of the world below</Paragraph>
        <Input
          placeholder={worldId}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <DialogFooter>
          <Button
            disabled={confirm !== worldId}
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
