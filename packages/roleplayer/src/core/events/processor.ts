import { RoleplayerEvent } from "./events";
import { Middleware } from "./middleware";

const terminate: Middleware = {
  name: "Terminate",
  handle(event: RoleplayerEvent, next: () => void) {
    console.log("Terminating event processing");
    next();
  },
};

const logger: Middleware = {
  name: "Logger",
  handle(event: RoleplayerEvent, next: () => void) {
    if (event.type === "Unknown") {
      console.log("");
    }

    next();
  },
};

const transformUnknownToRoundStarted: Middleware = {
  name: "Handle unknown event",
  handle(event: RoleplayerEvent, next: () => void) {
    if (event.type === "Unknown") {
      event.type = "RoundStarted" as "Unknown";
    }

    next();
  },
};

export class EventProcessor {
  middleware: Middleware[] = [logger, transformUnknownToRoundStarted, terminate];

  process(event: RoleplayerEvent) {
    let i = 0;
    let current = this.middleware[i];

    while (current) {
      current!.handle(event, () => {
        current = this.middleware[++i];
      });
    }

    return event;
  }
}
