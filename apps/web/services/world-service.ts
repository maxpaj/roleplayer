import { eq } from "drizzle-orm";
import { db } from "../db";
import { ActionRecord, RequiredResourceRecord, actionsSchema, actionsToEffectSchema } from "../db/schema/actions";
import { CampaignRecord, campaignsSchema } from "../db/schema/campaigns";
import {
  CharacterRecord,
  NewCharacterRecord,
  charactersSchema,
  charactersToActionsSchema,
  charactersToResourcesSchema,
} from "../db/schema/characters";
import { ClazzRecord, NewClazzRecord, classesSchema } from "../db/schema/classes";
import { ItemRecord, NewItemRecord, itemsSchema, itemsToActionsSchema } from "../db/schema/items";
import { StatusRecord, statusesSchema, statusesToEffectsSchema } from "../db/schema/statuses";
import { UserRecord } from "../db/schema/users";
import { NewWorldRecord, WorldRecord, worldsSchema } from "../db/schema/worlds";
import { CampaignService } from "./campaign-service";
import { DEFAULT_USER_ID } from "@/db/data";
import { alias } from "drizzle-orm/pg-core";
import { EffectRecord, effectsSchema } from "@/db/schema/effects";
import { CharacterResource, TargetType } from "roleplayer";

export type WorldAggregated = WorldRecord & {
  campaigns: CampaignRecord[];
  monsters: ActorAggregated[];
  characters: ActorAggregated[];
  statuses: StatusAggregated[];
  items: ItemAggregated[];
  classes: ClazzRecord[];
  actions: ActionAggregated[];
};

export type StatusAggregated = StatusRecord & {
  appliesEffects: EffectRecord[];
};

export type ActionAggregated = ActionRecord & {
  appliesEffects: EffectRecord[];
  eligibleTargets: TargetType[];
  requiresResources: RequiredResourceRecord[];
};

export type ItemAggregated = ItemRecord & {
  actions: ActionAggregated[];
};

export type ActorAggregated = CharacterRecord & {
  resourceTypes: CharacterResource[];
  actions: ActionAggregated[];
};

export class WorldService {
  async getAll(userId: UserRecord["id"] = DEFAULT_USER_ID): Promise<WorldRecord[]> {
    const query = db.select().from(worldsSchema);

    return query;
  }

  async getWorld(userId: UserRecord["id"], worldId: WorldRecord["id"]) {
    const worldActionsAlias = alias(actionsSchema, "worldActionsAlias");
    const worldActionsToEffectAlias = alias(actionsToEffectSchema, "worldActionsToEffectAlias");
    const worldActionEffectsAlias = alias(effectsSchema, "worldActionEffectsAlias");

    const characterActionsAlias = alias(actionsSchema, "characterActionsAlias");
    const characterActionsToEffectAlias = alias(actionsToEffectSchema, "characterActionsToEffectAlias");
    const characterActionEffectsAlias = alias(effectsSchema, "characterActionEffectsAlias");

    const itemsActionsAlias = alias(actionsSchema, "itemsActionsAlias");
    const itemsActionsToEffectsAlias = alias(actionsToEffectSchema, "itemsActionsToEffectsAlias");
    const itemsActionsEffectAlias = alias(effectsSchema, "itemsActionsEffectAlias");

    const statusesToEffectsAlias = alias(statusesToEffectsSchema, "statusesToEffectsAlias");
    const statusesEffectsAlias = alias(effectsSchema, "statusesEffectsAlias");

    const rows = await db
      .select()
      .from(worldsSchema)
      .leftJoin(campaignsSchema, eq(worldsSchema.id, campaignsSchema.worldId))
      .leftJoin(classesSchema, eq(classesSchema.worldId, worldsSchema.id))

      // Join statuses
      .leftJoin(statusesSchema, eq(statusesSchema.worldId, worldsSchema.id))
      .leftJoin(statusesToEffectsAlias, eq(statusesToEffectsAlias.statusId, statusesSchema.id))
      .leftJoin(statusesEffectsAlias, eq(statusesEffectsAlias.id, statusesToEffectsAlias.effectId))

      .leftJoin(itemsSchema, eq(itemsSchema.worldId, worldsSchema.id))
      .leftJoin(itemsToActionsSchema, eq(itemsSchema.id, itemsToActionsSchema.itemId))
      .leftJoin(itemsActionsAlias, eq(itemsActionsAlias.id, itemsToActionsSchema.actionId))
      .leftJoin(itemsActionsToEffectsAlias, eq(itemsActionsToEffectsAlias.actionId, itemsActionsAlias.id))
      .leftJoin(itemsActionsEffectAlias, eq(itemsActionsEffectAlias.id, itemsActionsToEffectsAlias.effectId))

      // Join actions
      .leftJoin(worldActionsAlias, eq(worldActionsAlias.worldId, worldsSchema.id))
      .leftJoin(worldActionsToEffectAlias, eq(worldActionsAlias.id, worldActionsToEffectAlias.actionId))
      .leftJoin(worldActionEffectsAlias, eq(worldActionEffectsAlias.id, worldActionsToEffectAlias.effectId))

      // Join characters
      .leftJoin(charactersSchema, eq(charactersSchema.worldId, worldsSchema.id))
      .leftJoin(charactersToResourcesSchema, eq(charactersToResourcesSchema.characterId, charactersSchema.id))
      .leftJoin(charactersToActionsSchema, eq(charactersToActionsSchema.characterId, charactersSchema.id))
      .leftJoin(characterActionsAlias, eq(charactersToActionsSchema.actionId, characterActionsAlias.id))
      .leftJoin(characterActionsToEffectAlias, eq(characterActionsAlias.id, characterActionsToEffectAlias.actionId))
      .leftJoin(characterActionEffectsAlias, eq(characterActionsToEffectAlias.effectId, characterActionEffectsAlias.id))

      // Filter the given world
      .where(eq(worldsSchema.id, worldId));

    function accumulateCharacterRows(row: (typeof rows)[0], acc: Record<string, WorldAggregated>, world: WorldRecord) {
      if (row.characters) {
        const existingCharacter = acc[world.id]!.characters.filter((c) => c.id === row.characters!.id)[0];
        const characterToAdd: ActorAggregated = {
          actions: existingCharacter?.actions || [],
          resourceTypes: existingCharacter?.resourceTypes || [],
          ...(existingCharacter || row.characters),
        };

        if (row.characterToResources) {
          const existingResource = characterToAdd.resourceTypes.filter(
            (r) => r.resourceTypeId === row.characterToResources!.resourceTypeId
          )[0];

          const resourceToAdd: CharacterResource = {
            ...(existingResource || row.characterToResources),
            max: row.characterToResources.max,
            resourceTypeId: row.characterToResources.resourceTypeId!,
            amount: row.characterToResources.amount,
            min: 0,
          };

          characterToAdd.resourceTypes = [
            ...characterToAdd.resourceTypes.filter(
              (a) => a.resourceTypeId !== row.characterToResources!.resourceTypeId
            ),
            resourceToAdd,
          ];
        }

        if (row.characterActionsAlias) {
          const existingAction = characterToAdd.actions.filter((c) => c.id === row.characterActionsAlias!.id)[0];
          const actionToAdd: ActionAggregated = {
            ...(existingAction || row.characterActionsAlias),
            appliesEffects: existingAction?.appliesEffects || [],
            eligibleTargets: existingAction?.eligibleTargets || [],
            requiresResources: existingAction?.requiresResources || [],
          };

          // TODO: Gather up all action eligible targets
          if (row.characterActionEffectsAlias) {
            const existingEffect = actionToAdd.appliesEffects.filter(
              (c) => c.id === row.characterActionEffectsAlias!.id
            )[0];
            const effectToAdd: EffectRecord = existingEffect || row.characterActionEffectsAlias;

            actionToAdd.appliesEffects = [
              ...actionToAdd.appliesEffects.filter((a) => a.id !== row.characterActionEffectsAlias!.id),
              effectToAdd,
            ];
          }

          characterToAdd.actions = [
            ...characterToAdd.actions.filter((a) => a.id !== row.characterActionsAlias!.id),
            actionToAdd,
          ];
        }

        acc[world.id]!.characters = [
          ...acc[world.id]!.characters.filter((c) => c.id !== row.characters!.id),
          characterToAdd,
        ];
      }
    }

    function accumulateItems(row: (typeof rows)[0], acc: Record<string, WorldAggregated>, world: WorldRecord) {
      if (row.items) {
        const existingItem = acc[world.id]!.items.filter((c) => c.id === row.items!.id)[0];
        const itemToAdd: ItemAggregated = {
          ...(existingItem || row.items),
          actions: existingItem?.actions || [],
        };

        if (row.itemsActionsAlias) {
          const existingItemAction = itemToAdd.actions.filter((c) => c.id === row.itemsActionsAlias!.id)[0];
          const actionToAdd: ActionAggregated = {
            ...(existingItemAction || row.itemsActionsAlias),
            appliesEffects: existingItemAction?.appliesEffects || [],
            eligibleTargets: existingItemAction?.eligibleTargets || [],
            requiresResources: existingItemAction?.requiresResources || [],
          };

          if (row.itemsActionsEffectAlias) {
            const existingEffect = actionToAdd.appliesEffects.filter(
              (e) => e.id === row.itemsActionsEffectAlias!.id
            )[0];

            const effectToAdd: EffectRecord = { ...(existingEffect || row.itemsActionsEffectAlias) };

            actionToAdd.appliesEffects = [
              ...actionToAdd.appliesEffects.filter((a) => a.id !== row.itemsActionsEffectAlias!.id),
              effectToAdd,
            ];
          }

          itemToAdd.actions = [...itemToAdd.actions.filter((a) => a.id !== row.itemsActionsAlias!.id), actionToAdd];
        }

        acc[world.id]!.items = [...acc[world.id]!.items.filter((c) => c.id !== row.items!.id), itemToAdd];
      }
    }

    const aggregated = rows.reduce<Record<WorldRecord["id"], WorldAggregated>>((acc, row) => {
      const world = row.worlds;

      if (!acc[world.id]) {
        acc[world.id] = {
          ...world,
          monsters: [],
          actions: [],
          campaigns: [],
          characters: [],
          classes: [],
          items: [],
          statuses: [],
        };
      }

      accumulateCharacterRows(row, acc, world);

      if (row.campaigns) {
        acc[world.id]!.campaigns = [
          ...acc[world.id]!.campaigns.filter((c) => c.id !== row.campaigns!.id),
          row.campaigns,
        ];
      }

      if (row.statuses) {
        const existingStatus = acc[world.id]!.statuses.filter((c) => c.id === row.statuses!.id)[0];
        const statusToAdd: StatusAggregated = {
          ...(existingStatus || row.statuses),
          appliesEffects: existingStatus?.appliesEffects || [],
        };

        if (row.statusesEffectsAlias) {
          const existingEffect = statusToAdd.appliesEffects.filter((e) => e.id === row.statusesEffectsAlias!.id)[0];
          const effectToAdd: EffectRecord = { ...(existingEffect || row.statusesEffectsAlias) };

          statusToAdd.appliesEffects = [
            ...statusToAdd.appliesEffects.filter((a) => a.id !== row.statusesEffectsAlias!.id),
            effectToAdd,
          ];
        }

        acc[world.id]!.statuses = [...acc[world.id]!.statuses.filter((c) => c.id !== row.statuses!.id), statusToAdd];
      }

      accumulateItems(row, acc, world);

      if (row.worldActionsAlias) {
        const existingAction = acc[world.id]!.actions.filter((c) => c.id === row.worldActionsAlias!.id)[0];
        const actionToAdd: ActionAggregated = {
          ...(existingAction || row.worldActionsAlias),
          appliesEffects: existingAction?.appliesEffects || [],
          eligibleTargets: [],
          requiresResources: existingAction?.requiresResources || [],
        };

        if (row.worldActionEffectsAlias) {
          const existingEffect = actionToAdd.appliesEffects.filter((c) => c.id === row.worldActionEffectsAlias!.id)[0];
          const effectToAdd: EffectRecord = existingEffect || row.worldActionEffectsAlias;

          actionToAdd.appliesEffects = [
            ...actionToAdd.appliesEffects.filter((a) => a.id !== row.worldActionEffectsAlias!.id),
            effectToAdd,
          ];
        }

        acc[world.id]!.actions = [
          ...acc[world.id]!.actions.filter((c) => c.id !== row.worldActionsAlias!.id),
          actionToAdd,
        ];
      }

      if (row.classes) {
        acc[world.id]!.classes = [...acc[world.id]!.classes.filter((c) => c.id !== row.classes!.id), row.classes];
      }

      return acc;
    }, {});

    const result = Object.values(aggregated);

    return result[0];
  }

  async deleteWorld(worldId: WorldRecord["id"]): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async createWorld(newWorldRecord: NewWorldRecord): Promise<{ id: WorldRecord["id"] }> {
    const rows = await db.insert(worldsSchema).values(newWorldRecord).returning({ id: worldsSchema.id });

    if (rows[0]) {
      return rows[0];
    }

    throw new Error("No rows inserted");
  }

  async createCharacter(
    character: NewCharacterRecord,
    campaignId?: CampaignRecord["id"]
  ): Promise<{ id: CampaignRecord["id"] }> {
    const rows = await db.insert(charactersSchema).values(character).returning();
    const created = rows[0];

    if (!created) {
      throw new Error("No rows inserted");
    }

    if (campaignId) {
      await new CampaignService().addCharacter(campaignId, created);
    }

    return created;
  }

  async getTemplateWorlds(): Promise<WorldRecord[]> {
    const query = db.select().from(worldsSchema).where(eq(worldsSchema.isTemplate, true));

    return query;
  }

  async setWorldPublicVisibility(worldId: WorldRecord["id"], isPublic: boolean) {
    throw new Error("Method not implemented.");
  }

  async createWorldCharacter(character: NewCharacterRecord) {
    return db.insert(charactersSchema).values(character).returning({ id: charactersSchema.id });
  }

  async createItem(item: NewItemRecord) {
    return db.insert(itemsSchema).values(item).returning({ id: itemsSchema.id });
  }

  async createCharacterClass(clazz: NewClazzRecord) {
    return db.insert(classesSchema).values(clazz).returning({ id: classesSchema.id });
  }

  async saveWorld(worldId: WorldRecord["id"], update: Partial<WorldRecord>) {
    return db
      .update(worldsSchema)
      .set({ name: update.name, description: update.description })
      .where(eq(worldsSchema.id, worldId))
      .returning({ id: worldsSchema.id });
  }
}
