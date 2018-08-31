import parse from "@path/parse";

export default function slice(pathname: string, start?: number, end?: number) {
  const p = parse(pathname);
  return p.root + p.chunks.slice(start, end).join("/") + "/";;
}