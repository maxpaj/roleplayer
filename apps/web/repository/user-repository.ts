import { JSONUserRecord } from "db/json/schema/user";

export interface IUserRepository {
  getAll(): Promise<JSONUserRecord[]>;
  deleteUser(userId: JSONUserRecord["id"]): Promise<void>;
  createUser(name: string): Promise<JSONUserRecord>;
  getUser(userId: JSONUserRecord["id"]): Promise<JSONUserRecord>;
}
