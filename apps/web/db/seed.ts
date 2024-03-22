import { db } from ".";
import { actionsSchema } from "./schema/actions";
import { campaignsSchema } from "./schema/campaigns";
import {
  charactersSchema,
  charactersToActionsSchema,
  charactersToCampaignsSchema,
  charactersToItemsSchema,
} from "./schema/characters";
import { classesSchema } from "./schema/classes";
import { eventsSchema } from "./schema/events";
import { friendInvitesSchema } from "./schema/friend-invite";
import { itemsSchema } from "./schema/items";
import { rulesSchema } from "./schema/rules";
import { statusesSchema } from "./schema/statuses";
import { usersSchema } from "./schema/users";
import { worldsSchema } from "./schema/worlds";

async function seed() {
  console.log("Seeding...");
  console.time("DB has been seeded!");

  // database teardown
  await db.delete(actionsSchema);
  await db.delete(campaignsSchema);
  await db.delete(charactersSchema);
  await db.delete(charactersToActionsSchema);
  await db.delete(charactersToCampaignsSchema);
  await db.delete(charactersToItemsSchema);
  await db.delete(classesSchema);
  await db.delete(eventsSchema);
  await db.delete(friendInvitesSchema);
  await db.delete(itemsSchema);
  await db.delete(rulesSchema);
  await db.delete(statusesSchema);
  await db.delete(usersSchema);
  await db.delete(worldsSchema);

  // database setup
  await db
    .insert(usersSchema)
    .values({
      name: "Root user",
    })
    .returning();
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Seeding done!");
    process.exit(0);
  });
