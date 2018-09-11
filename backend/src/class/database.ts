import * as fs from "fs";
import { promisify } from "util";
import { readFileSync } from "fs";
import { DatabaseElement, ElementChild, ElementAttributes } from "./element";

const writeFile = promisify(fs.writeFile);

interface IDList {
  [key: string]: DatabaseElement;
}

function toElement(node: ElementChild, idList: IDList) {
  if ((node as Partial<DatabaseElement>).children) {
    let element = new DatabaseElement(
      (node as Partial<DatabaseElement>).type,
      (node as Partial<DatabaseElement>).attributes,
      (node as Partial<DatabaseElement>).children.map((child) => toElement(child, idList))
    );

    if (element.attributes.id) {
      idList[element.attributes.id] = element;
    }

    return element;
  }
  return node;
}

export default class Database {
  body: DatabaseElement;
  filename: string;
  idList: IDList;

  constructor(filename) {
    const str = readFileSync(filename, "utf8");
    this.filename = filename;
    this.idList = {};
    this.body = str.length
      ? toElement(JSON.parse(str), this.idList)
      : this.createElement({ id: "body" });
  }

  createElement<T extends DatabaseElement = DatabaseElement>(): T;
  createElement<T extends DatabaseElement = DatabaseElement>(tagName: string): T;
  createElement<T extends DatabaseElement = DatabaseElement>(props: ElementAttributes): T;
  createElement<T extends DatabaseElement = DatabaseElement>(props: ElementAttributes, children: ElementChild[]): T;
  createElement<T extends DatabaseElement = DatabaseElement>(children: ElementChild[]): T;
  createElement<T extends DatabaseElement = DatabaseElement>(tagName: string, props: ElementAttributes): T;
  createElement<T extends DatabaseElement = DatabaseElement>(tagName: string, props: ElementAttributes, children: ElementChild[]): T;
  createElement<T extends DatabaseElement = DatabaseElement>(...args: any[]): T {
    let type = "element";
    let attributes: Partial<T["attributes"]> = {};
    let children = [];

    let i = -1;
    const n = args.length;

    while (++i < n) {
      // TagName
      if (typeof args[i] === "string" && i === 0) {
        type = args[i];
      } else if (typeof args[i] === "string") {
        children.push(args[i]);
      } else if (Array.isArray(args[i])) {
        Array.prototype.push.apply(children, args[i]);
      } else if (typeof args[i] === "object") {
        Object.assign(attributes, args[i]);
      }
    }

    let element = new DatabaseElement(type, attributes, children);

    if (element.attributes.id) {
      this.idList[element.attributes.id] = element;
    }

    return element as T;
  }

  save() {
    const string = JSON.stringify(this.body, null, "  ");
    return writeFile(this.filename, string)
      .catch((e) => console.error(e));
  }

  getElementById<T extends DatabaseElement = DatabaseElement>(id: string): T | null {
    return this.idList[id] as T;
  }
}