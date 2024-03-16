"use server";

import { DEFAULT_USER_ID } from "@/db/data";
import { NewCampaignRecord } from "@/db/schema/campaigns";
import { CharacterRecord } from "@/db/schema/characters";
import { ClazzRecord } from "@/db/schema/classes";
import { ItemRecord } from "@/db/schema/items";
import { MonsterRecord } from "@/db/schema/monster";
import { StatusRecord } from "@/db/schema/statuses";
import { WorldRecord } from "@/db/schema/worlds";
import { redirect } from "next/navigation";
import { World } from "roleplayer";
import { CampaignService } from "services/campaign-service";
import { WorldService } from "services/world-service";

type WorldData = {
  world: WorldRecord;
  characters: CharacterRecord[];
  items: ItemRecord[];
  statuses: StatusRecord[];
  monsters: MonsterRecord[];
  classes: ClazzRecord[];
};

export async function getWorldData(id: World["id"]): Promise<WorldData | undefined> {
  return await new WorldService().getWorld(DEFAULT_USER_ID, id);
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
