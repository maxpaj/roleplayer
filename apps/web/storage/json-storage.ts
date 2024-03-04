import { readFile, writeFile } from "fs/promises";
import process from "process";

const storageDir = `${process.cwd()}/../../data`;

export type EntityRecord<T, U> = { entity: T; metadata: U };

export class JSONEntityStorage<T, U> {
  private filePath: string;
  private entityType: new (param: T) => T;
  private parse: (param: unknown) => EntityRecord<T, U>[];

  constructor(
    fileName: string,
    type: new (param: T) => T,
    parse: (param: unknown) => EntityRecord<T, U>[]
  ) {
    this.filePath = `${storageDir}/${fileName}.json`;
    this.entityType = type;
    this.parse = parse;
  }

  async read() {
    const fileContents = await readFile(this.filePath, { encoding: "utf-8" });
    const json = JSON.parse(fileContents);
    const typed = this.parse(json) as EntityRecord<T, U>[];

    return typed.map(({ entity, metadata }: EntityRecord<T, U>) => ({
      entity: new this.entityType(entity),
      metadata,
    }));
  }

  async write(content: EntityRecord<T, U>[]) {
    await writeFile(this.filePath, JSON.stringify(content));
  }
}
