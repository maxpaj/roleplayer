"use client";

import Link from "next/link";
import { Campaign } from "@repo/rp-lib/world";
import { Button } from "@/components/ui/button";

export function CreateCharacterButton({
  campaignId,
}: {
  campaignId: Campaign["id"];
}) {
  return (
    <Button>
      <Link href={`/campaigns/${campaignId}/characters`}>Create character</Link>
    </Button>
  );
}
