"use server";

import { redirect } from "next/navigation";
import { memoryWorldRepository } from "../../../storage/world-repository";

export async function getWorld(id: string) {
  const world = await memoryWorldRepository.getWorld(id);
  return world;
}

export async function deleteWorld(id: string) {
  await memoryWorldRepository.deleteWorld(id);
  redirect("/worlds/");
}
