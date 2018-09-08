// tslint:disable:no-default-export

export interface PathQueryValue {
  [key: string]: string | string[];
}

export class PathQuery {
  value: PathQueryValue;

  constructor(pathname: string = "") {
    const pathSplit = pathname.split("?");
    const search = (pathSplit[1] || pathSplit[0]).split("#")[0];
    const delimited = search ? search.split("&") : [];

    let i = -1;
    const n = delimited.length;

    this.value = {};

    while (++i < n) {
      if (delimited[i].length) {
        let s = delimited[i].split("=");
        s[0] = decodeURI(s[0]);
        s[1] = decodeURI(s[1]);
        if (s[0].slice(-2) === "[]") {
          let t = s[0].slice(0, -2);
          if (!this.value[t]) { this.value[t] = []; }
          this.value[t] = (this.value[t] as string[]).concat(s[1]);
        } else {
          this.value[s[0]] = s[1];
        }
      }
    }
  }

  assign(props: PathQueryValue) {
    Object.assign(this.value, props);
    return this;
  }

  forEach(iterator: (value: string[] | string, key: string) => void) {
    const keys = Object.keys(this.value).sort((a, b) => a > b ? 1 : -1);
    let i = -1;
    const n = keys.length;
    while (++i < n) {
      iterator(this.value[keys[i]], keys[i]);
    }
  }

  toString(): string {
    let res = [];
    this.forEach((value, key) => {
      let property = encodeURI(key);
      if (Array.isArray(value)) {
        value.forEach(member => {
          res.push(property + "[]=" + encodeURI(member));
        });
      } else {
        res.push(property + "=" + encodeURI(value as string));
      }
    });
    return "?" + res.join("&");
  }
}

export default function query(pathname: string = ""): PathQuery {
  return new PathQuery(pathname);
}