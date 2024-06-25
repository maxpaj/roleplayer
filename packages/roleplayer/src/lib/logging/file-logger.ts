import { Logger } from "./logger";

export class FileLogger implements Logger {
  stream: WritableStream;
  buffer: { level: "INFO" | "DEBUG" | "WARN" | "ERROR"; log: any }[];

  constructor(fileStream: WritableStream) {
    this.stream = fileStream;
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
    this.stream.getWriter().write(JSON.stringify(logs));
  }

  writeToFile() {
    this.stream.getWriter().write(JSON.stringify(this.buffer));
    this.stream.close();
    this.buffer = [];
  }
}
