import parse from "@path/parse";

export default function query(pathname: string): {[key: string]: string} | null {
  const p = parse(pathname);

  const split = p.search
    ? p.search.substring(1).split("&").filter(a => a.length)
    : [];

  let i = -1;
  const n = split.length;
  const res = {};

  while (++i < n) {
    let t = split[i].split("=");
    res[decodeURI(t[0])] = decodeURI(t[1]);
  }

  return n ? res : null;
}