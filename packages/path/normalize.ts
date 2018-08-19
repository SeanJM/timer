export default function normalize(pathname: string) {
  let i = -1;
  const p = pathname.split("/");
  const n = p.length;
  const res = [];
  while (++i < n) {
    if (p[i]) {
      res.push(p[i]);
    }
  }
  return res.join("/");
};