import getPathname from "@frontend/components/router/get-pathname";
import getSearch from "@frontend/components/router/get-search";
import getHash from "@frontend/components/router/get-hash";
import path from "@path";

export default function getLocation(href: string) {
  const search = getSearch(href);
  return {
    hash: getHash(href),
    pathname: getPathname(href),
    query: path.query(search).value,
    href: href,
    search,
  };
}