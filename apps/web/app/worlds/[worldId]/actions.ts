"use server";

import { memoryWorldRepository } from "../../../storage/world-repository";

export async function getWorld(id: string) {
  const world = await memoryWorldRepository.getWorld(id);
  return world;
}

export async function deleteWorld(id: string) {
  await memoryWorldRepository.deleteWorld(id);
}

export async function unpublishWorld(id: string) {
  await memoryWorldRepository.setWorldPublicVisibility(id, false);
}

export async function publishWorld(id: string) {
  await memoryWorldRepository.setWorldPublicVisibility(id, true);
}
