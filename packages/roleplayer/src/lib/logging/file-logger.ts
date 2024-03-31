import { WriteStream } from "fs";
import { createWriteStream } from "node:fs";
import { Logger } from "./logger";

export class FileLogger implements Logger {
  stream: WriteStream;
  buffer: { level: "INFO" | "DEBUG" | "WARN" | "ERROR"; log: any }[];

  constructor(fileName: string = "debug-log.json") {
    this.stream = createWriteStream(fileName, { start: 0 });
    this.buffer = [];
  }

  info(...args: any[]) {
    this.writeToBuffer(args, "INFO");
  }

  debug(...args: any[]) {
    this.writeToBuffer(args, "DEBUG");
  }

  warn(...args: any[]) {
    this.writeToBuffer(args, "WARN");
  }

  writeToBuffer(args: any[], level: "INFO" | "DEBUG" | "WARN") {
    const logs = args.map((log) => {
      const row = {
        level,
        log,
      };

      return row;
    });

    this.buffer.push(...logs);
    this.stream.write(JSON.stringify(logs));
  }

  writeToFile() {
    this.stream.write(JSON.stringify(this.buffer));
    this.stream.close();
    this.buffer = [];
  }
}
