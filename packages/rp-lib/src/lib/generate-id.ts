export type Id = number;

export function dangerousGenerateId() {
  return Math.floor(Math.random() * 100_000_000);
}
