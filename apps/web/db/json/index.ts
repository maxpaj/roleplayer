import { readFile, writeFile } from "fs/promises";
import process from "process";
import { JSONEntityRecord } from "db/json/schema/entity";

const isoDateRegexp =
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;
const storageDir = `${process.cwd()}/../../data`;

function jsonDateReviver(_: string, value: string | number | null | undefined) {
  if (typeof value === "string") {
    const dateMatch = isoDateRegexp.exec(value);
    if (!dateMatch || !dateMatch[1]) {
      return value;
    }

    return new Date(dateMatch[1]);
  }

  return value;
}

export class JSONEntityStorage<S extends JSONEntityRecord<S["entity"]>> {
  private filePath: string;
  private entityType: new (param: S["entity"]) => S["entity"];
  private typeMap: (param: unknown) => S[];

  constructor(
    fileName: string,
    type: new (param: S["entity"]) => S["entity"],
    parse: (param: unknown) => S[]
  ) {
    this.filePath = `${storageDir}/${fileName}.json`;
    this.entityType = type;
    this.typeMap = parse;
  }

  async read() {
    const jsonfileContents = await readFile(this.filePath, {
      encoding: "utf-8",
    });
    const jsonData = JSON.parse(jsonfileContents, jsonDateReviver);
    const typed = this.typeMap(jsonData) as S[];

    return typed.map(({ entity, ...rest }: S) => {
      return {
        entity: new this.entityType(entity),
        ...rest,
      };
    });
  }

  async write(content: JSONEntityRecord<S["entity"]>[]) {
    await writeFile(this.filePath, JSON.stringify(content, null, 2));
  }
}
