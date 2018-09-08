export default function getSearch(url: string): string | null {
  const start = url.indexOf("?") > -1 ? url.indexOf("?") : 0;
  const end = url.indexOf("#") > -1 ? url.indexOf("#") : url.length;
  return url.substring(start, end) || null;
}