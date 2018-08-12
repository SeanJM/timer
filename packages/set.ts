export default function set(
  object: object,
  path: string | Array<string | number>,
  value: any
) {
  const p = typeof path === "string" ? path.split(".") : path;
  let r = object;
  let i = -1;
  const n = p.length - 1;

  while (++i < n) {
    r = object[p[i]];
    if (typeof r === "undefined") {
      return undefined;
    }
  }

  return r[p.length] = value;
}