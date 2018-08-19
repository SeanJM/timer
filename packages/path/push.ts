import normalize from "./normalize";
import parse from "./parse";
export default function push(pathname: string, ...members: string[]) {
  const p = parse(pathname);
  const m = members.map((member) => normalize(member));
  Array.prototype.push.apply(p.chunks, m);
  return p.root + p.chunks.join("/") + "/";
}