import { Console } from "console";

export class FileLogger {
  console: Console;

  constructor() {
    this.console = new Console(process.stdout);
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
