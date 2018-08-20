import parse from "@path/parse";
import normalize from "@path/normalize";
export default function splice(pathname: string, member: string, index: number, length?) {
  const p = parse(pathname);
  const m = normalize(member);
  if (index < 0 && typeof length === "undefined") {
    p.chunks.splice(p.chunks.length + index, p.chunks.length, m);
  } else {
    p.chunks.splice(index, length || index, m);
  }
  return p.root + p.chunks.join("/") + "/";
};