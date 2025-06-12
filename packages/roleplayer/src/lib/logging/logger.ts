export type LogLevel = "INFO" | "DEBUG" | "WARN" | "ERROR";

export interface Logger {
  info(...args: any[]): void;
  debug(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
}
