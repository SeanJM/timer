import getPathname from "@components/router/get-pathname";
import getSearch from "@components/router/get-search";
import getHash from "@components/router/get-hash";

export default function getLocation(href: string) {
  return {
    pathname: getPathname(href),
    search: getSearch(href),
    hash: getHash(href),
  };
}