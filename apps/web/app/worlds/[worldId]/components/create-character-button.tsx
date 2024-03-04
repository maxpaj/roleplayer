"use client";

import { World } from "@repo/rp-lib";
import { ButtonLink } from "@/components/ui/button-link";

export function CreateCharacterButton({ worldId }: { worldId: World["id"] }) {
  return (
    <ButtonLink href={`/worlds/${worldId}/characters`}>
      Create character
    </ButtonLink>
  );
}
