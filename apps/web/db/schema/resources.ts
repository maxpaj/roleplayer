import { pgEnum } from "drizzle-orm/pg-core";

export const resourceTypeEnum = pgEnum("resourceType", [
  "Health",
  "Mana",
  "Primary action",
  "Secondary action",
  "Movement",
  "Spell Level 1",
  "Spell Level 2",
  "Spell Level 3",
  "Spell Level 4",
  "Spell Level 5",
  "Spell Level 6",
]);

export type ResourceTypeEnum = (typeof resourceTypeEnum.enumValues)[number];
