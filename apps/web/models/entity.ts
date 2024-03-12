/**
 * To tie roleplayer, SQL/ORM and the web application together, we need to;
 *  - Store and read roleplayer entity data, with relationships, from the database
 *  - Store and read app metadata on entities, like image URLs, created date, updated date, etc.
 *  - Map raw data to instantiated classes at runtime, so that we can shove them into components and use roleplayer functionality
 */
export type EntityRecord<T extends { id: number }> = {
  entity: T;
  id: T["id"];
};
