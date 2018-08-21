import parse from "@path/parse";
export default function reduceReplace(schema: string, params: object) {
  const p = parse(schema);
  const n = p.chunks.length;
  let i = -1;
  let res = [];
  let cache;
  let isSchema;
  while (++i < n) {
    isSchema = p.chunks[i][0] === ":";
    cache = isSchema && params[p.chunks[i].substring(1)];
    if (cache) {
      res.push(cache);
    } else if (!isSchema) {
      res.push(p.chunks[i]);
    }
  }
  return p.root + res.join("/") + "/";
}