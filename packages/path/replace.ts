import parse from "@path/parse";
export default function replace(schema: string, params: object) {
  const p = parse(schema);
  const n = p.chunks.length;
  let i = -1;
  let res = [];
  let cache;
  while (++i < n) {
    cache = p.chunks[i][0] === ":" && params[p.chunks[i].substring(1)];
    if (cache) {
      res.push(cache);
    } else {
      res.push(p.chunks[i]);
    }
  }
  return p.root + res.join("/") + "/";
}