import normalize from "./normalize";
export default function parse(pathname: string): {chunks: string[], isRelative: boolean, root: "/" | ""} {
  const p = normalize(pathname);
  const chunks = p.split("/");
  return {
    chunks,
    isRelative: pathname[0] !== "/",
    root: pathname[0] === "/" ? "/" : "",
  }
}