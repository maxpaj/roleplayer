import {
  serial,
  varchar,
  boolean,
  pgTable,
  date,
  integer,
} from "drizzle-orm/pg-core";
import { worldsSchema } from "./worlds";

export const campaignsSchema = pgTable("campaign", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  isDemo: boolean("isDemo"),
  createdUtc: date("createdUtc"),
  imageUrl: varchar("imageUrl", { length: 2048 }),
  description: varchar("description", { length: 4096 }),
  worldId: integer("worldId").references(() => worldsSchema.id),
});
