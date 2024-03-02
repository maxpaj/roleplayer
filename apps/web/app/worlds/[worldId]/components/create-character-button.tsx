"use client";

import Link from "next/link";
import { World } from "@repo/rp-lib/world";
import { Button } from "@/components/ui/button";

export function CreateCharacterButton({ worldId }: { worldId: World["id"] }) {
  return (
    <Button>
      <Link href={`/worlds/${worldId}/characters`}>Create character</Link>
    </Button>
  );
}
