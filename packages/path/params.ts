import parse from "@path/parse";

function isMatch(query: any, url: any) {
  return query === url || (!!query && !!url && query[0] === ":");
}

export interface Params {
  isExact: boolean;
  isMatch: boolean;
  __pathname: string[];
  __schema: string[];
  [key: string]: any;
}

export default function params(pathname: string = "", schema: string = "") {
  const urlPathname = parse(pathname).chunks;
  const queryPathname = parse(schema).chunks;
  const urlIsAny = urlPathname.length === 1 && urlPathname[0] === "";

  const params: Params = {
    isExact: true,
    isMatch: true,
    __pathname: urlPathname,
    __schema: queryPathname,
  };

  let i = -1;
  const n = Math.max(queryPathname.length, urlPathname.length);

  while (++i < n) {
    if (!urlIsAny && i < queryPathname.length && !isMatch(queryPathname[i], urlPathname[i])) {
      params.isMatch = false;
    }

    if (!isMatch(queryPathname[i], urlPathname[i])) {
      params.isExact = false;
    }

    if (queryPathname[i] && queryPathname[i][0] === ":") {
      params[queryPathname[i].substring(1)] = urlPathname[i];
    }
  }

  return params;
}