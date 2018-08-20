import parse from "@path/parse";
export default function pop(pathname: string, times: number = 1) {
  const p = parse(pathname);
  let i = -1;
  while (++i < times) {
    p.chunks.pop();
  }
  return p.root + p.chunks.join("/") + "/";
};