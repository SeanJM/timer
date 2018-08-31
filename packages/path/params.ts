import parse from "@path/parse";

function isMatch(schema: any, url: any) {
  return schema === url || (!!schema && !!url && schema[0] === ":");
}

export interface Params {
  isExact: boolean;
  isMatch: boolean;
  pathname: string[];
  schema: string[];
  [key: string]: any;
}

export default function params(pathname: string = "", schema: string = "") {
  const urlPathname = parse(pathname).chunks;
  const schemaPathname = parse(schema).chunks;

  const params: Params = {
    isExact: true,
    isMatch: true,
    pathname: urlPathname,
    schema: schemaPathname,
  };

  let i = -1;
  const n = Math.max(schemaPathname.length, urlPathname.length);

  while (++i < n) {
    if (i < schemaPathname.length && !isMatch(schemaPathname[i], urlPathname[i])) {
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