const path: {
  join?(...path: string[]): string;
  normalize?(pathname: string): string;
  pop?(pathname: string): string;
  splice?(pathname: string, member: string, index: number, length?): string;
} = {};

path.normalize = function (pathname: string) {
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

path.join = function (...pathname: string[]) {
  let i = -1;
  const n = pathname.length;
  const res = [];
  let s = pathname[0][0] === "/" ? "/" : "";

  while (++i < n) {
    res.push(this.normalize(pathname[i]));
  }

  return s + res.join("/") + "/";
};

path.pop = function (pathname: string, times: number = 1) {
  const s = pathname[0][0] === "/" ? "/" : "";
  const p = this.normalize(pathname).split("/");
  let i = -1;
  while (++i < times) {
    p.pop();
  }
  return s + p.join("/") + "/";
};

path.splice = function (pathname: string, member: string, index: number, length?) {
  const s = pathname[0][0] === "/" ? "/" : "";
  const p = this.normalize(pathname).split("/");
  const m = this.normalize(member);
  if (index < 0 && typeof length === "undefined") {
    p.splice(p.length + index, p.length, m);
    return s + p.join("/") + "/"
  }
  p.splice(index, length || index, m);
  return s + p.join("/") + "/";
};

export default path;