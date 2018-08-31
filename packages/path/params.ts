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
  const schemaPathname = parse(schema).chunks;

  const urlIsAny =
    (urlPathname.length === 1 && urlPathname[0] === "") ||
    (schemaPathname.length === 1 && schemaPathname[0] === "");

  const params: Params = {
    isExact: true,
    isMatch: true,
    __pathname: urlPathname,
    __schema: schemaPathname,
  };

  let i = -1;
  const n = Math.max(schemaPathname.length, urlPathname.length);

  while (++i < n) {
    if (!urlIsAny && i < schemaPathname.length && !isMatch(schemaPathname[i], urlPathname[i])) {
      params.isMatch = false;
    }

    if (!isMatch(schemaPathname[i], urlPathname[i])) {
      params.isExact = false;
    }

    if (schemaPathname[i] && schemaPathname[i][0] === ":") {
      params[schemaPathname[i].substring(1)] = urlPathname[i];
    }
  }

  return params;
}