import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { campaignsSchema } from "./schema/campaigns";
import { monstersSchema } from "./schema/monster";
import { worldsSchema } from "./schema/worlds";
import { usersSchema } from "./schema/users";
import { charactersSchema } from "./schema/characters";
import { eventsSchema } from "./schema/events";

export const db = drizzle(sql, {
  schema: {
    campaigns: campaignsSchema,
    characters: charactersSchema,
    events: eventsSchema,
    monsters: monstersSchema,
    users: usersSchema,
    worlds: worldsSchema,
  },
});
