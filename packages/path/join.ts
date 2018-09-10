import normalize from "@path/normalize";
export default function join(...pathname: string[]) {
  let i = -1;
  const root = pathname[0][0] === "/" ? "/" : "";
  const n = pathname.length;
  const res = [];

  while (++i < n) {
    if (pathname[i] !== "/") {
      res.push(normalize(pathname[i]));
    }
  }

  return root + res.join("/") + "/";
}