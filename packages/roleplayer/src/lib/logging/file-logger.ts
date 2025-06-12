import { Logger, LogLevel } from "./logger";

export class FileLogger implements Logger {
  stream: WritableStream;
  buffer: { level: LogLevel; log: any }[];

  constructor(fileStream: WritableStream) {
    this.stream = fileStream;
    this.buffer = [];
  }

  error(...args: any[]): void {
    this.writeToBuffer(args, "ERROR");
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

  writeToBuffer(args: any[], level: LogLevel) {
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
