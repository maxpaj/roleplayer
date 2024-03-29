import { Console } from "console";
import { createWriteStream } from "node:fs";

export class Logger {
  console: Console;

  constructor(fileName: string = "debug-log.json") {
    const stream = createWriteStream(fileName, { start: 0 });
    this.console = new Console(stream);
  }

  table(...args: any[]) {
    this.console.table(...args);
  }

  info(...args: any[]) {
    this.console.info(...args);
  }

  debug(...args: any[]) {
    this.console.debug(...args);
  }

  warn(...args: any[]) {
    this.console.warn(...args);
  }
}
