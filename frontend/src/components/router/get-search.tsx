export default function getSearch(url: string): string {
  return url.indexOf("?") === -1
    ? ""
    : url.split("?")[1].split("#")[0];
}