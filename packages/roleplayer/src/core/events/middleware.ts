import { RoleplayerEvent } from "./events";

export type Middleware = {
  name: string;
  handle(event: RoleplayerEvent, next: () => void): Promise<void>;
};
