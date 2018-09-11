import querySelectorToObjectList from "@query-selector-to-object";

export interface ElementAttributes {
  id?: string;
  name?: string;
  description?: string;
  className?: string;
  state?: string;
  created?: number;
  completed?: number;
  color?: string;
  [key: string]: any;
}

export type ElementChild = Partial<DatabaseElement> | string | boolean;

function findElementFromQuery(node: DatabaseElement, index: number, queryObject: Partial<DatabaseElement>[]) {
  let i = -1;
  const query = queryObject[index];
  const n = node.children
    ? node.children.length
    : 0;

  while (++i < n) {
    if (node.children[i] instanceof DatabaseElement) {
      let child = node.children[i] as DatabaseElement;
      if (child.is(query)) {
        if (index === queryObject.length - 1) {
          return child;
        } else {
          let c = findElementFromQuery(child, index + 1, queryObject);
          if (c) {
            return c;
          }
        }
      } else {
        let c = findElementFromQuery(child, index, queryObject);
        if (c) {
          return c;
        }
      }
    }
  }

  return null;
}

function findElementsFromQuery(node: DatabaseElement, index: number, queryObject: Partial<DatabaseElement>[]) {
  const n = node.children ? node.children.length : 0;
  const children = [];
  const query = queryObject[index];
  let i = -1;

  while (++i < n) {
    let child = node.children[i] as DatabaseElement;
    if (child instanceof DatabaseElement) {
      if (child.is(query)) {
        if (index === queryObject.length - 1) {
          children.push(child);
        }
        if (queryObject[index + 1]) {
          [].push.apply(
            children,
            findElementsFromQuery(child, index + 1, queryObject)
          );
        }
      } else {
        [].push.apply(
          children,
          findElementsFromQuery(child, index, queryObject)
        );
      }
    }
  }

  return children;
}

export class DatabaseElement {
  type: string;
  attributes: ElementAttributes;
  children: Array<ElementChild | undefined>;
  parentNode: DatabaseElement;

  constructor(type: string, attributes: ElementAttributes, children: Array<ElementChild>) {
    let i = -1;
    const n = children.length;
    this.type = type;
    this.attributes = attributes;
    this.children = children;
    while (++i < n) {
      if (children[i] instanceof DatabaseElement) {
        (children[i] as DatabaseElement).parentNode = this;
      }
    }
  }

  setAttributes(value: { [key in keyof ElementAttributes]: ElementAttributes[key] });
  setAttributes<T extends keyof ElementAttributes>(name: T, value: ElementAttributes[T]);
  setAttributes() {
    if (typeof arguments[0] === "object") {
      Object.assign(this.attributes, arguments[0]);
    } else {
      this.attributes[arguments[0]] = arguments[1];
    }
    return this;
  }

  is(query: Partial<DatabaseElement>): boolean {
    if (query.type && query.type !== this.type) {
      return false;
    }

    for (var k in query.attributes) {
      if (query.attributes[k] instanceof RegExp) {
        if (!query.attributes[k].test(this.attributes[k])) {
          return false;
        }
      } else if (k === "className") {
        if (this.attributes[k]) {
          let i = -1;
          const queryClassList = query.attributes[k].split(" ");
          const elementClassList = this.attributes[k].split(" ");
          const n = queryClassList.length;
          while (++i < n) {
            if (elementClassList.indexOf(queryClassList[i]) === -1) {
              return false;
            }
          }
        } else {
          return false;
        }
      } else if (query.attributes[k] !== this.attributes[k]) {
        return false;
      }
    }

    return true;
  }

  querySelectorAll<T extends DatabaseElement>(selector: string): T[] {
    const queryObjectList = querySelectorToObjectList(selector);
    return findElementsFromQuery(this, 0, queryObjectList);
  }

  querySelector<T extends DatabaseElement>(selector: string): null | T {
    const queryObjectList = querySelectorToObjectList(selector);
    return findElementFromQuery(this, 0, queryObjectList);
  }

  toJSON() {
    return {
      type: this.type,
      attributes: this.attributes,
      children: this.children,
    } as Partial<DatabaseElement>;
  }

  appendChild(child: ElementChild) {
    this.children.push(child);
    if (child instanceof DatabaseElement) {
      (child as DatabaseElement).parentNode = this;
    }
    return this;
  }

  removeChild(child: ElementChild) {
    this.children = this.children.filter((c) => c !== child);
    return this;
  }
}