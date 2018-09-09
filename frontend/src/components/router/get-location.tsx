import getPathname from "@frontend/components/router/get-pathname";
import getSearch from "@frontend/components/router/get-search";
import getHash from "@frontend/components/router/get-hash";

export default function getLocation(href: string) {
  return {
    href: href,
    pathname: getPathname(href),
    search: getSearch(href),
    hash: getHash(href),
  };
}