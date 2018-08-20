import Element, { ElementAttributes } from "@class/element";

type QueryObject = Partial<Element>;

export default function querySelectorToObjectList(selector: string) {
  const queryList: QueryObject[] = [];
  let attributes: ElementAttributes = {};
  let queryObject: QueryObject = {
    attributes,
  };

  let i = -1;
  let c;
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

      i -= 1;
    }
    
    if (selector[i] === "#") {
      attributes.id = "";
      i += 1;

      while (selector[i] && !boundary[selector[i]]) {
        attributes.id += selector[i];
        i += 1;
      }

      i -= 1;
    }
    
    if (selector[i] === ".") {
      attributes.className = attributes.className ? attributes.className + " " : "";
      i += 1;

      while (selector[i] && !boundary[selector[i]]) {
        attributes.className += selector[i];
        i += 1;
      }

      i -= 1;
    }
    
    if (selector[i] === "[") {
      c = [""];
      i += 1;
      
      while (selector[i] && selector[i] !== "]") {
        c[0] += selector[i];
        i += 1;
      }
      c[1] = c[0].match(/[A-Za-z\-\_]+|/)[0];
      c[2] = c[0].match(/[\^|\*|\$]=|/)[0][0];
      c[3] = (c[0].match(/=[^\]]+$/) || [""])[0].substring(1).replace(/^"|"$/g, "");
      if (c[2] === "^") {
        c[4] = new RegExp("^" + c[3]);
      } else if (c[2] === "$") {
        c[4] = new RegExp(c[3] + "$");
      } else if (c[2] === "*") {
        c[4] = new RegExp(c[3]);
      } else {
        c[4] = c[3];
      }
      attributes[c[0].match(/[A-Za-z\-\_]+|/)[0]] = c[4];
      i -= 1;
    }

    if (selector[i] === " " || i === n - 1) {
      queryList.push(queryObject);
      attributes = {};
      queryObject = {
        attributes,
      };
    }
  }
  
  return queryList;
}