export interface ElementAttributes {
  id?: string;
  name?: string;
  description?: string;
  className?: string;
  state?: string;
  created?: number;
}

export type ElementChild = Partial<Element> | string | boolean;

export default class Element {
  type: string
  attributes: ElementAttributes;
  children: Array<ElementChild | undefined>;
  parentNode: Element;

  constructor(type: string, attributes: ElementAttributes, children: Array<ElementChild>) {
    let i = -1;
    const n = children.length;
    this.type = type;
    this.attributes = attributes;
    this.children = children;
    while (++i < n) {
      if (children[i] instanceof Element) {
        (children[i] as Element).parentNode = this;
      }
    }
  }

  setAttributes(value: { [key in keyof ElementAttributes]: ElementAttributes[key] })
  setAttributes<T extends keyof ElementAttributes>(name: T, value: ElementAttributes[T])
  setAttributes() {
    if (typeof arguments[0] === "object") {
      Object.assign(this.attributes, arguments[0]);
    } else {
      this.attributes[arguments[0]] = arguments[1];
    }
    return this;
  }

  toJSON() {
    return {
      type: this.type,
      attributes: this.attributes,
      children: this.children,
    } as Partial<Element>;
  }

  appendChild(child: ElementChild) {
    this.children.push(child);
    if (child instanceof Element) {
      (child as Element).parentNode = this;
    }
    return this;
  }

  removeChild(child: ElementChild) {
    this.children = this.children.filter((c) => c !== child);
    return this;
  }
}