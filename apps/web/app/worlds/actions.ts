"use server";

import { WorldRecord } from "@/db/schema/worlds";
import { redirect } from "next/navigation";
import { WorldService } from "services/world-service";

export async function saveWorld(worldId: WorldRecord["id"], world: Partial<WorldRecord>) {
  await new WorldService().saveWorld(worldId, world);
  redirect(`/worlds/${worldId}`);
}
