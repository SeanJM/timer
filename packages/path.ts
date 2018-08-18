const path: {
  join?(...path: string[]): string;
  normalize?(pathname: string): string;
  pop?(pathname: string, times?: number): string;
  splice?(pathname: string, member: string, index: number, length?): string;
  push?(pathname: string, ...members: string[]): string;
} = {};

function parse(pathname: string): {chunks: string[], isRelative: boolean, root: "/" | ""} {
  const p = path.normalize(pathname);
  const chunks = p.split("/");
  return {
    chunks,
    isRelative: pathname[0] !== "/",
    root: pathname[0] === "/" ? "/" : "",
  }
}

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
  const p = parse(pathname[0]);
  const n = pathname.length;
  const res = [];

  while (++i < n) {
    res.push(this.normalize(pathname[i]));
  }

  return p.root + res.join("/") + "/";
};

path.pop = function (pathname: string, times: number = 1) {
  const p = parse(pathname);
  let i = -1;
  while (++i < times) {
    p.chunks.pop();
  }
  return p.root + p.chunks.join("/") + "/";
};

path.splice = function (pathname: string, member: string, index: number, length?) {
  const p = parse(pathname);
  const m = this.normalize(member);
  if (index < 0 && typeof length === "undefined") {
    p.chunks.splice(p.chunks.length + index, p.chunks.length, m);
  } else {
    p.chunks.splice(index, length || index, m);
  }
  return p.root + p.chunks.join("/") + "/";
};

path.push = function (pathname: string, ...members: string[]) {
  const p = parse(pathname);
  const m = members.map((member) => this.normalize(member));
  Array.prototype.push.apply(p.chunks, m);
  return p.root + p.chunks.join("/") + "/";
}

export default path;