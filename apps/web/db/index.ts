import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { campaignsSchema } from "./schema/campaigns";
import { monstersSchema } from "./schema/monster";
import { worldsSchema } from "./schema/worlds";
import { usersSchema } from "./schema/users";
import { charactersSchema } from "./schema/characters";
import { eventsSchema } from "./schema/events";
import { actionsSchema } from "./schema/actions";
import { classesSchema } from "./schema/classes";
import { itemsSchema } from "./schema/items";
import { statusesSchema } from "./schema/statuses";
import { rulesSchema } from "./schema/rules";

export const DEFAULT_USER_ID = 2;

export const db = drizzle(sql, {
  schema: {
    actions: actionsSchema,
    campaigns: campaignsSchema,
    characters: charactersSchema,
    classes: classesSchema,
    events: eventsSchema,
    items: itemsSchema,
    monsters: monstersSchema,
    statuses: statusesSchema,
    users: usersSchema,
    rules: rulesSchema,
    worlds: worldsSchema,
  },
});
