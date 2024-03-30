export interface Logger {
  info(...args: any[]): void;
  debug(...args: any[]): void;
  warn(...args: any[]): void;
}
