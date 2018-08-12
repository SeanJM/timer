function isMatch(query: any, url: any) {
  return query === url || (query && url && query[0] === ":");
}

export interface Params {
  __exact: boolean;
  __match: boolean;
  [key: string]: boolean | string;
}

export default function getParams(pathname: string, schema?: string) {
  const urlPathname = pathname.split("/");
  const queryPathname = schema ? schema.split("/") : null;

  const params: Params = {
    __exact: true,
    __match: true,
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