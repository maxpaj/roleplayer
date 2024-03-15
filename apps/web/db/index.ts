import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { dangerousGenerateId } from "roleplayer";
import { actionsSchema } from "./schema/actions";
import { campaignsSchema } from "./schema/campaigns";
import { charactersSchema } from "./schema/characters";
import { classesSchema } from "./schema/classes";
import { effectsSchema } from "./schema/effects";
import { eventsSchema } from "./schema/events";
import { itemsSchema } from "./schema/items";
import { monstersSchema } from "./schema/monster";
import { rulesSchema } from "./schema/rules";
import { statusesSchema } from "./schema/statuses";
import { usersSchema } from "./schema/users";
import { worldsSchema } from "./schema/worlds";

export const DEFAULT_USER_ID = dangerousGenerateId();

export const db = drizzle(sql, {
  schema: {
    actions: actionsSchema,
    campaigns: campaignsSchema,
    characters: charactersSchema,
    classes: classesSchema,
    effects: effectsSchema,
    events: eventsSchema,
    items: itemsSchema,
    monsters: monstersSchema,
    statuses: statusesSchema,
    users: usersSchema,
    rules: rulesSchema,
    worlds: worldsSchema,
  },
});
