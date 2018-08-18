import path from "@path";

export default function (test) {
  test("path", path.splice("/a/b/c/", "d", 1)).isEqual("/a/d/c/");
  test("path", path.splice("/a/b/c/", "d", -1)).isEqual("/a/b/d/");
  test("path", path.splice("/a/b/c/", "d", -2)).isEqual("/a/d/");
  test("path", path.splice("/a/b/c/", "d", -2, 1)).isEqual("/a/d/c/");
}