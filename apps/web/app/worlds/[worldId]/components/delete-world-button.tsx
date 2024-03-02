"use client";

import { Button } from "@/components/ui/button";
import { deleteWorld } from "../actions";

export function DeleteWorldButton({ worldId }: { worldId: string }) {
  return (
    <Button
      onClick={async () => {
        await deleteWorld(worldId);
      }}
    >
      Delete world
    </Button>
  );
}
