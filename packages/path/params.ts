// tslint:disable:no-default-export
import parse from "@path/parse";

function isMatch(schema: any, url: any) {
  return schema === url || (!!schema && !!url && schema[0] === ":");
}

interface BaseParams {
  _isExact: boolean;
  _isMatch: boolean;
  _pathname: string[];
  _schema: string[];
  [key: string]: any;
}

export type PathParams<T = {}> = Partial<BaseParams> & T;

export default function params<T = {}>(pathname: string = "", schema: string = ""): PathParams<T> {
  const urlPathname = parse(pathname).chunks;
  const schemaPathname = parse(schema).chunks;

  const params: PathParams = {
    _isExact: true,
    _isMatch: true,
    _pathname: urlPathname,
    _schema: schemaPathname,
  };

  let i = -1;
  const n = Math.max(schemaPathname.length, urlPathname.length);

  while (++i < n) {
    if (i < schemaPathname.length && !isMatch(schemaPathname[i], urlPathname[i])) {
      params._isMatch = false;
    }

    if (!isMatch(schemaPathname[i], urlPathname[i])) {
      params._isExact = false;
    }

    if (schemaPathname[i] && schemaPathname[i][0] === ":") {
      params[schemaPathname[i].substring(1)] = urlPathname[i];
    }
  }

  return params as T;
}