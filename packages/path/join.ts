import parse from "@path/parse";
import normalize from "@path/normalize";
export default function join(...pathname: string[]) {
  let i = -1;
  const p = parse(pathname[0]);
  const n = pathname.length;
  const res = [];

  while (++i < n) {
    res.push(normalize(pathname[i]));
  }

  return p.root + res.join("/") + "/";
}