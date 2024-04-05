import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { actionsSchema } from "./schema/actions";
import { campaignsSchema } from "./schema/campaigns";
import { charactersSchema } from "./schema/characters";
import { classesSchema } from "./schema/classes";
import { effectsSchema } from "./schema/effects";
import { eventsSchema } from "./schema/events";
import { itemInstancesSchema, itemTemplatesSchema } from "./schema/items";
import { rulesSchema } from "./schema/rules";
import { statusesSchema } from "./schema/statuses";
import { usersSchema } from "./schema/users";
import { worldsSchema } from "./schema/worlds";

export const db = drizzle(sql, {
  schema: {
    actions: actionsSchema,
    campaigns: campaignsSchema,
    characters: charactersSchema,
    classes: classesSchema,
    effects: effectsSchema,
    events: eventsSchema,
    itemTemplates: itemTemplatesSchema,
    itemInstances: itemInstancesSchema,
    statuses: statusesSchema,
    users: usersSchema,
    rules: rulesSchema,
    worlds: worldsSchema,
  },
});
