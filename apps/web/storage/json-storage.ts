import { readFile, writeFile } from "fs/promises";
import process from "process";

const storageDir = `${process.cwd()}/../../data`;

export class JSONStorage<T> {
  private filePath: string;
  private type: new (param: T) => T;
  private parse: (param: unknown) => T[];

  constructor(
    fileName: string,
    type: new (param: T) => T,
    parse: (param: unknown) => T[]
  ) {
    this.filePath = `${storageDir}/${fileName}.json`;
    this.type = type;
    this.parse = parse;
  }

  async read() {
    const fileContents = await readFile(this.filePath, { encoding: "utf-8" });
    const json = JSON.parse(fileContents);
    const typed = this.parse(json);

    return typed.map((obj: T) => new this.type(obj));
  }

  async write(content: T[]) {
    await writeFile(this.filePath, JSON.stringify(content));
  }
}
