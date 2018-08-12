export default function get(
  object: object,
  path: string | Array<string | number>
) {
  const p = typeof path === "string" ? path.split(".") : path;
  let r = object;
  let i = -1;
  const n = p.length;

  while (++i < n) {
    r = object[p[i]];
    if (typeof r === "undefined") {
      return undefined;
    }
  }

  return r;
}