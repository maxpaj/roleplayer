import { loadEnvConfig } from "@next/env";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import { actionsSchema } from "./schema/actions";
import { campaignsSchema } from "./schema/campaigns";
import { charactersSchema } from "./schema/characters";
import { classesSchema } from "./schema/classes";
import { eventsSchema } from "./schema/events";
import { itemsSchema } from "./schema/items";
import { monstersSchema } from "./schema/monster";
import { statusesSchema } from "./schema/statuses";
import { usersSchema } from "./schema/users";
import { worldsSchema } from "./schema/worlds";

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
    worlds: worldsSchema,
  },
});

await migrate(db, { migrationsFolder: "./migrations" });

await sql.end();
