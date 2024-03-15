"use server";

import { World } from "roleplayer";
import { CampaignService } from "services/campaign-service";
import { WorldService } from "services/world-service";
import { redirect } from "next/navigation";
import { WorldRecord } from "@/db/schema/worlds";
import { CharacterRecord } from "@/db/schema/characters";
import { ItemRecord } from "@/db/schema/items";
import { StatusRecord } from "@/db/schema/statuses";
import { MonsterRecord } from "@/db/schema/monster";
import { NewCampaignRecord } from "@/db/schema/campaigns";
import { ClazzRecord } from "@/db/schema/classes";

type WorldData = {
  world: WorldRecord;
  characters: CharacterRecord[];
  items: ItemRecord[];
  statuses: StatusRecord[];
  monsters: MonsterRecord[];
  classes: ClazzRecord[];
};

export async function getWorldData(
  id: World["id"]
): Promise<WorldData | undefined> {
  return await new WorldService().getWorld(0, id);
}

export async function getWorldCampaigns(id: World["id"]) {
  return await new CampaignService().getWorldCampaigns(id);
}

export async function deleteWorld(id: World["id"]) {
  await new WorldService().deleteWorld(id);
}

export async function unpublishWorld(id: World["id"]) {
  await new WorldService().setWorldPublicVisibility(id, false);
}

export async function publishWorld(id: World["id"]) {
  await new WorldService().setWorldPublicVisibility(id, true);
}

export async function createCampaign(newCampaign: NewCampaignRecord) {
  const created = await new CampaignService().createCampaign(newCampaign);
  redirect(`/campaigns/${created.id}`);
}
