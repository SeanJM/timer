import parse from "@path/parse";

function isMatch(query: any, url: any) {
  return query === url || (query && url && query[0] === ":");
}

export interface Params {
  __exact: boolean;
  __match: boolean;
  __pathname: string[];
  __schema: string[];
  [key: string]: any;
}

export default function params(pathname: string = "", schema: string = "") {
  const urlPathname = parse(pathname).chunks;
  const queryPathname = parse(schema).chunks;

  const params: Params = {
    __exact: true,
    __match: true,
    __pathname: urlPathname,
    __schema: queryPathname,
  };

  if (queryPathname) {
    let i = -1;
    const n = Math.max(queryPathname.length, urlPathname.length);
    while (++i < n) {
      if (i < queryPathname.length && !isMatch(queryPathname[i], urlPathname[i])) {
        params.__match = false;
      }

      if (!isMatch(queryPathname[i], urlPathname[i])) {
        params.__exact = false;
      }

      if (queryPathname[i] && queryPathname[i][0] === ":") {
        params[queryPathname[i].substring(1)] = urlPathname[i];
      }
    }
  }

  return params;
}