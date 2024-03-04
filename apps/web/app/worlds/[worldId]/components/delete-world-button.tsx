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

export function DeleteWorldButton({ worldId }: { worldId: string }) {
  const [confirm, setConfirm] = useState("");
  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive-outlined">Delete world</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete world</DialogTitle>
          <DialogDescription>
            Are you sure you want to permanently delete {worldId}? Type the name
            of the world below.
          </DialogDescription>
          <Input
            placeholder={worldId}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={confirm !== worldId}
            variant="destructive"
            onClick={async () => {
              await deleteWorld(worldId);
              router.push("/");
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
