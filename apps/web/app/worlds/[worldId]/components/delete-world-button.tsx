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
import { deleteWorld } from "../actions";
import { useRouter } from "next/navigation";
import { Paragraph } from "@/components/ui/typography";
import { WorldRecord } from "@/db/schema/worlds";

export function DeleteWorldButton({
  worldId,
  worldName,
}: {
  worldId: WorldRecord["id"];
  worldName: WorldRecord["name"];
}) {
  const [confirm, setConfirm] = useState("");
  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive-outline">Delete world</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete world</DialogTitle>
          <DialogDescription>
            This is an irreversible action. Are you sure you want to permanently
            delete {worldName}?
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
            variant="destructive"
            onClick={async () => {
              await deleteWorld(worldId);
              router.push("/worlds");
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
