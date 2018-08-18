import Element, { ElementAttributes } from "@class/element";

export default function querySelectorToObject(selector: string) {
  const attributes: ElementAttributes = {};
  const queryObject: Partial<Element> = {
    attributes,
  };

  let i = -1;
  const n = selector.length;

  const boundary = {
    " ": true,
    ".": true,
    "[": true,
    "]": true,
    "#": true,
  };

  while (++i < n) {
    if (/[a-zA-Z]/.test(selector[i])) {
      queryObject.type = "";
      while (selector[i] && !boundary[selector[i]]) {
        queryObject.type += selector[i];
        i += 1;
      }
    } else if (selector[i] === "#") {
      attributes.id = "";
      i += 1;
      while (selector[i] && !boundary[selector[i]]) {
        attributes.id += selector[i];
        i += 1;
      }
    } else if (selector[i] === ".") {
      attributes.className = attributes.className ? attributes.className + " " : "";
      i += 1;
      while (selector[i] && !boundary[selector[i]]) {
        attributes.className += selector[i];
        i += 1;
      }
    }
  }

  return queryObject;
}