export default function getSearch(url: string): null | object {
  const index = url.indexOf("?");
  const s = url.substring(index === -1 ? url.length : index, url.length);
  const searchGroups = s.split("&");
  let i = -1;
  const n = searchGroups.length;
  const res = {};

  while (++i < n) {
    let splitSearchGroup = searchGroups[i].split("=");
    res[splitSearchGroup[0]] = splitSearchGroup[1];
  }

  return index === -1 ? null : res;
}