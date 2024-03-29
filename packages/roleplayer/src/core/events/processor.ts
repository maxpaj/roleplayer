import { Logger } from "../../lib/logger";
import { RoleplayerEvent } from "./events";
import { Middleware } from "./middleware";

const logger = new Logger();

const terminate: Middleware = {
  name: "Terminate",
  async handle(event: RoleplayerEvent, next: () => void) {
    logger.info("Terminating event processing");
    next();
  },
};

const loggerMiddleware: Middleware = {
  name: "Logger",
  async handle(event: RoleplayerEvent, next: () => void) {
    logger.info(`Processing event ${event.type}`);
    next();
  },
};

const transformUnknownToRoundStarted: Middleware = {
  name: "Handle unknown event",
  async handle(event: RoleplayerEvent, next: () => void) {
    if (event.type === "Unknown") {
      event.type = "RoundStarted" as "Unknown";
    }

    next();
  },
};

export class EventProcessor {
  middleware: Middleware[] = [loggerMiddleware, transformUnknownToRoundStarted, terminate];

  async process(event: RoleplayerEvent) {
    let i = 0;
    let current = this.middleware[i];

    while (current) {
      await current!.handle(event, () => {
        current = this.middleware[++i];
      });
    }

    return event;
  }
}
