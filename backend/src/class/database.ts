import * as fs from "fs";
import { promisify } from "util";
import { readFileSync } from "fs";
import Element, { ElementChild, ElementAttributes } from "./element";

const writeFile = promisify(fs.writeFile);

interface IDList {
  [key: string]: Element;
}

function toElement(node: ElementChild, idList: IDList) {
  if ((node as Partial<Element>).children) {
    let element = new Element(
      (node as Partial<Element>).type,
      (node as Partial<Element>).attributes,
      (node as Partial<Element>).children.map((child) => toElement(child, idList))
    );

    if (element.attributes.id) {
      idList[element.attributes.id] = element;
    }

    return element;
  }
  return node;
}

export default class Database {
  body: Element;
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

  createElement<T extends Element>(): T;
  createElement<T extends Element>(tagName: string): T;
  createElement<T extends Element>(props: ElementAttributes): T;
  createElement<T extends Element>(props: ElementAttributes, children: ElementChild[]): T;
  createElement<T extends Element>(children: ElementChild[]): T;
  createElement<T extends Element>(tagName: string, props: ElementAttributes): T;
  createElement<T extends Element>(tagName: string, props: ElementAttributes, children: ElementChild[]): T;
  createElement<T extends Element>(...args: any[]): T {
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

    let element = new Element(type, attributes, children);

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

  getElementById<T extends Element>(id: string): T | null {
    return this.idList[id] as T;
  }
}