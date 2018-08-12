export default function getPathname(url: string) {
  const index = Math.max(url.indexOf("#"), url.indexOf("?"));
  return index === -1 ? url : url.substring(0, index);
}