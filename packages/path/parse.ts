import normalize from "@path/normalize";

interface Parse {
  chunks: string[];
  search: string | null;
  hash: string | null;
  isRelative: boolean;
  root: "/" | "";
}

function getSanitizedPathname(pathname) {
  let sanitizedPath = "";
  let i = -1;
  const n = pathname.length;

  while (++i < n && pathname[i] !== "#" && pathname[i] !== "?") {
    sanitizedPath += pathname[i];
  }

  return sanitizedPath;
}

function getSearch(pathname) {
  const indexOfHash = pathname.indexOf("#");
  const indexOfSearch = pathname.indexOf("?");
  const searchStart = indexOfSearch > -1 ? indexOfSearch : 0;
  const searchEnd = indexOfHash > -1 ? indexOfHash : pathname.length;
  return searchStart ? pathname.substring(searchStart, searchEnd) : null;
}

function getHash(pathname) {
  const indexOfHash = pathname.indexOf("#");
  return indexOfHash > -1 ? pathname.substring(indexOfHash) : null;
}

export default function parse(pathname: string): Parse {
  const sanitizedPath = getSanitizedPathname(pathname);
  const p = normalize(sanitizedPath);
  const chunks = p.split("/");

  return {
    chunks,
    search: getSearch(pathname),
    hash: getHash(pathname),
    isRelative: sanitizedPath[0] !== "/",
    root: sanitizedPath[0] === "/" ? "/" : "",
  };
}